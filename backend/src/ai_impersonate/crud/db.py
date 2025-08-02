from contextlib import asynccontextmanager
from pydantic import BaseModel
from openai import AsyncOpenAI
from typing import List
import os

import asyncpg
import json
import httpx
import fitz 


OPENAI_API_KEY = os.getenv("office_api_key")

DB_DSN = os.getenv("DB_DSN")
DB_SCHEMA = """
    CREATE EXTENSION IF NOT EXISTS vector;

    CREATE TABLE IF NOT EXISTS text_chunks (
        id serial PRIMARY KEY,
        chunk text NOT NULL,
        embedding vector(1536) NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_text_chunks_embedding ON text_chunks USING hnsw (embedding vector_l2_ops);
    """
    
@asynccontextmanager
async def database_connect(create_db: bool = False):
    """Manage database connection pool."""
    pool = await asyncpg.create_pool(DB_DSN)
    try:
        if create_db:
            async with pool.acquire() as conn:
                await conn.execute(DB_SCHEMA)
        yield pool
    finally:
        await pool.close()
        
class Chunk(BaseModel):
    chunk: str
    
async def split_text_into_chunks(text: str, max_words: int = 300, overlap: float = 0.2) -> List[Chunk]:
    """Split long text into smaller chunks based on word count with overlap."""
    words = text.split()
    chunks = []
    step_size = int(max_words * (1 - overlap))

    for start in range(0, len(words), step_size):
        end = start + max_words
        chunk_words = words[start:end]
        if chunk_words:
            chunks.append(Chunk(chunk=" ".join(chunk_words)))

    return chunks

async def insert_chunks(pool: asyncpg.Pool, chunks: List[Chunk], openai_client: AsyncOpenAI):
    """Insert text chunks into the database with embeddings."""
    for chunk in chunks:
        embedding_response = await openai_client.embeddings.create(
            input=chunk.chunk,
            model="text-embedding-3-small"
        )
        
        # Extract embedding data and convert to JSON format
        assert len(embedding_response.data) == 1, f"Expected 1 embedding, got {len(embedding_response.data)}"
        embedding_data = json.dumps(embedding_response.data[0].embedding)

        # Insert into the database
        await pool.execute(
            'INSERT INTO text_chunks (chunk, embedding) VALUES ($1, $2)',
            chunk.chunk,
            embedding_data 
        )

def extract_text_from_pdf(pdf_content: bytes) -> str:
    """Extract text from PDF content."""
    document = fitz.open(stream=pdf_content, filetype="pdf")
    # document = None
    text = ""
    for page_num in range(document.page_count):
        page = document.load_page(page_num)
        text += page.get_text()
    return text
        
async def download_pdf(url: str) -> bytes:
    """Download PDF from a given URL."""
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.content

async def add_pdf_to_db(url: str):
    """Download PDF, extract text, and add to the embeddings database."""
    openai_client = AsyncOpenAI(api_key=OPENAI_API_KEY)
    pdf_content = await download_pdf(url)
    print("PDF downloaded successfully", pdf_content)
    text = extract_text_from_pdf(pdf_content)
    async with database_connect(create_db=True) as pool:
        chunks = await split_text_into_chunks(text)
        await insert_chunks(pool, chunks, openai_client)