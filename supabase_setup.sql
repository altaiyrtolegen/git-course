-- 1. Включаем расширение pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Создаем таблицу legal_chunks
CREATE TABLE legal_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    metadata JSONB NOT NULL,
    embedding vector(1536)
);

-- 3. Создаем функцию для поиска по косинусному сходству
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    legal_chunks.id,
    legal_chunks.content,
    legal_chunks.metadata,
    1 - (legal_chunks.embedding <=> query_embedding) AS similarity
  FROM legal_chunks
  WHERE 1 - (legal_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY legal_chunks.embedding <=> query_embedding
  LIMIT match_count;
$$;
