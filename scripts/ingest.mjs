import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cwd = process.cwd();

// Загружаем конфиг из .env.local
dotenv.config({ path: path.join(cwd, '.env.local') });

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
  const filePath = path.join(cwd, 'kodeks.pdf');
  
  if (!fs.existsSync(filePath)) {
    console.error(`Файл не найден: ${filePath}`);
    process.exit(1);
  }

  console.log("Читаем PDF...");
  const dataBuffer = fs.readFileSync(filePath);
  
  // Handling differences in CommonJS interop
  const pdfParseFunc = typeof pdf === 'function' ? pdf : (pdf.default || pdf.PDFParse);
  if (typeof pdfParseFunc !== 'function') {
      console.log('Unable to resolve pdf-parse function. Exports:', Object.keys(pdf));
      process.exit(1);
  }

  const pdfData = await pdfParseFunc(dataBuffer);
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

  let count = 0;
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
      } else {
        count++;
      }
    } catch (e) {
      console.error(`Ошибка при обработке статьи ${articleNumber}:`, e.message);
    }
  }

  console.log(`Загрузка в базу завершена успешно! Загружено статей: ${count}`);
}

main().catch(console.error);
