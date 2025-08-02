from openai import AsyncOpenAI
from pydantic_ai import Agent, RunContext
from models.llama import LLaMAModel
from dataclasses import dataclass
from typing import List, Optional
import asyncpg
import pydantic_core

from .db import database_connect, OPENAI_API_KEY

@dataclass
class Deps:
    pool: asyncpg.Pool
    openai: AsyncOpenAI


# Initialize the agent
model = LLaMAModel(endpoint_url=os.getenv("LLAMA_API_ENDPOINT"))
rag_agent = Agent(model, deps_type=Deps)

@rag_agent.tool
async def retrieve(context: RunContext[Deps], search_query: str) -> str:
    """Retrieve documentation sections based on a search query.

    Args:
        context: The call context.
        search_query: The search query.
    """
    print("Retrieving..............")
    embedding = await context.deps.openai.embeddings.create(
            input=search_query,
            model='text-embedding-3-small',
        )
    
    assert (
        len(embedding.data) == 1
    ), f'Expected 1 embedding, got {len(embedding.data)}, doc query: {search_query!r}'
    
    embedding = embedding.data[0].embedding
    embedding_json = pydantic_core.to_json(embedding).decode()
    rows = await context.deps.pool.fetch(
        'SELECT chunk FROM text_chunks ORDER BY embedding <-> $1 LIMIT 4',
        embedding_json,
    )
    from_db = '\n\n'.join(
    f'# Chunk:\n{row["chunk"]}\n'
    for row in rows
    ) 
    return from_db

async def run_agent(question: str, character: str, game_history: Optional[List[dict]] = []):
    """Entry point to run the agent and perform RAG-based question answering."""

    # Set up the agent and dependencies
    async with database_connect(False) as pool:
        openai_client = AsyncOpenAI(api_key=OPENAI_API_KEY)

        async with database_connect(False) as pool:
            deps = Deps(openai=openai_client, pool=pool)
            base_instruction = f"Use the 'retrieve' tool to fetch information to help you answer this question: {question} and answer as {character}. Answer in between 50 to 70 words. Use the information given to you, and ensure that your tone is like the character you are impersonating. The history of the conversation till now is: {game_history}. Make sure you explain the topic asked"
            answer = await rag_agent.run(base_instruction, deps=deps)
            return answer.data