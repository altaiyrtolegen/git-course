import fs from 'fs';
import path from 'path';
const pdf = require('pdf-parse');
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Загружаем конфиг из .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey || !openaiKey || supabaseUrl === 'your_supabase_url') {
  console.error("Ошибка: Пожалуйста, обновите файл .env.local вашими реальными ключами и запустите скрипт заново.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiKey });

async function main() {
  const filePath = path.join(process.cwd(), 'kodeks.pdf');
  
  if (!fs.existsSync(filePath)) {
    console.error(`Файл не найден: ${filePath}`);
    process.exit(1);
  }

  console.log("Читаем PDF...");
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdf(dataBuffer);
  const text = pdfData.text;

  // Регулярное выражение для поиска "Статья [число]". 
  // Ловим номер статьи (группа 1) и текст до следующей статьи (группа 2).
  const articleRegex = /Статья\s+(\d+)[.\s]+([\s\S]*?)(?=(?:Статья\s+\d+)|$)/gi;
  const matches = [...text.matchAll(articleRegex)];

  if (matches.length === 0) {
    console.error("Статьи не найдены по паттерну 'Статья [число]'. Проверьте формат текста в PDF.");
    return;
  }

  console.log(`Найдено статей: ${matches.length}. Начинаем создание эмбеддингов...`);

  for (const match of matches) {
    const articleNumber = match[1];
    const content = match[2].trim();
    
    // Игнорируем пустые блоки
    if (!content) continue;

    const fullContent = `Статья ${articleNumber}. ${content}`;
    console.log(`Обработка статьи ${articleNumber}...`);

    try {
      // 1. Генерация эмбеддинга
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: fullContent,
      });
      const embedding = response.data[0].embedding;

      // 2. Сохранение в Supabase
      const { error } = await supabase.from('legal_chunks').insert({
        content: fullContent,
        metadata: { article: parseInt(articleNumber, 10), target: "УК РК" },
        embedding: embedding,
      });

      if (error) {
        console.error(`Ошибка при сохранении статьи ${articleNumber} в Supabase:`, error.message);
      }
    } catch (e: any) {
      console.error(`Ошибка при обработке статьи ${articleNumber}:`, e.message);
    }
  }

  console.log("Загрузка в базу завершена успішно!");
}

main().catch(console.error);
