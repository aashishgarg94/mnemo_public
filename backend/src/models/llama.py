# models/llama.py
import requests
from pydantic_ai import RunContext
from ai.agents import AgentMessage

class LLaMAModel:
    def __init__(self, endpoint_url: str):
        self.endpoint_url = endpoint_url

    def __call__(self, messages: List[AgentMessage], context: Optional[RunContext] = None) -> AgentMessage:
        prompt = "\n".join([f"{m.sender}: {m.content}" for m in messages])
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 150,
                "temperature": 0.7,
                "do_sample": True,
                "top_p": 0.95,
                "top_k": 50
            }
        }

        response = requests.post(self.endpoint_url, json=payload)
        response.raise_for_status()
        result = response.json()

        # Assuming TGI/vLLM format: {'generated_text': '...'}
        if isinstance(result, list):
            text = result[0].get("generated_text", "").strip()
        else:
            text = result.get("generated_text", "").strip()

        return AgentMessage(sender="AI", content=text)
