import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const openaiKey = process.env.OPENAI_API_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiKey });

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // 1. Превращаем текст в эмбеддинг
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    
    const embedding = embeddingResponse.data[0].embedding;

    // 2. Вызываем RPC функцию match_documents (ищем 5 самых релевантных статей)
    const { data: documents, error: matchError } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.2, // Порог совпадения
      match_count: 5,
    });

    if (matchError) {
      console.error('Ошибка при поиске документов:', matchError);
      return NextResponse.json({ error: 'Failed to search documents' }, { status: 500 });
    }

    if (!documents || documents.length === 0) {
      return NextResponse.json({ 
        status: 'ok', 
        analysis: ['Релевантных статей не найдено.'], 
        sources: [] 
      });
    }

    // 3. Формируем промпт для gpt-4o
    const sourcesStrings = documents.map((doc: any) => `Статья ${doc.metadata?.article || 'Неизвестная'}: ${doc.content}`);
    const sourcesContext = sourcesStrings.join('\n\n');

    const prompt = `Ты — ведущий юрист Казахстана. Сравни предложенный текст с данными статьями УК РК:
    
[Список найденных статей]
${sourcesContext}

[Предложенный текст]
${text}

Выяви:
а) Прямые противоречия.
б) Дублирование смысла.
в) Логические нестыковки.
Ответ дай строго в JSON формате: { "status": "warning" | "error" | "ok", "analysis": ["...", "..."], "sources": ["..."] }
В поле analysis помести массив строк с описанием противоречий или дублирований.
В поле sources перечисли статьи (например, "Статья 1", "Статья 2"), которые были затронуты.`;

    // 4. Запрос к gpt-4o
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const completionContent = completion.choices[0].message.content;
    
    if (!completionContent) {
      throw new Error('No response from OpenAI');
    }

    // Парсим результат от нейросети
    const result = JSON.parse(completionContent);

    // Добавляем к ответу полные исходные данные из БД (по желанию)
    return NextResponse.json({
      status: result.status,
      analysis: result.analysis,
      sources: result.sources,
      // Включаем найденные статьи для возможности их визуализации на фронте
      db_matches: documents.map((doc: any) => ({
        article: doc.metadata?.article,
        content: doc.content,
        similarity: doc.similarity
      }))
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
