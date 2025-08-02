from datetime import datetime
from typing import List, Optional
from fastapi import HTTPException
import json
import os
import random
from ai.agents import (
    GameSimulatorAgent,
    PuzzleAgent,
    CompanionAgent,
    SummaryAgent,
    AssetsAgent,
    ScenarioDocument,
    AgentMessage
)
from models.llama import LLaMAModel
from ai.profiles import SupportDependencies, DatabaseConn
from dotenv import load_dotenv
load_dotenv()

class AIGameCollection:
    def __init__(self):
        current_dir = os.path.dirname(__file__)
        json_path = os.path.join(current_dir, "cleopatra_scenario_02.json")

        with open(json_path, "r") as f:
            self.scenario_doc = ScenarioDocument(
                **json.load(f)
            )
        office_api_key = os.getenv("office_api_key")
        self.model = LLaMAModel(endpoint_url=os.getenv("LLAMA_API_ENDPOINT"))

        
        # @self.model.system_prompt
        # async def use_players_name(ctx: RunContext[SupportDependencies]) -> str:
        #     return await ctx.deps.db.player_name(id=ctx.deps.player_id)
    async def respond(
        self,
        user_message: str,
        current_step: Optional[int] = 0,
        player_id: Optional[int] = 111,
        background_image: Optional[str] = "",
        game_history: Optional[List[dict]] = [],
        response_type: Optional[str] = "respond",
        current_puzzle: Optional[str] = "hieroglyphic_01"
    ) -> any:
        try:
            deps = SupportDependencies(player_id=player_id, db=DatabaseConn())
            message = AgentMessage(
                sender="User",
                content=user_message,
            )
            self.game_simulator_agent = GameSimulatorAgent(scenario=self.scenario_doc, model=self.model)

            if response_type == "puzzle":
                puzzles = self.scenario_doc.puzzles
                puzzle = [p for p in puzzles if p["puzzle_id"] == current_puzzle]
                if not puzzle:
                    puzzle = puzzles[0]
                else:
                    puzzle = puzzle[0]
                self.game_simulator_agent = PuzzleAgent(scenario=self.scenario_doc, model=self.model, puzzle=puzzle)
            elif response_type == "summary":
                self.game_simulator_agent = SummaryAgent(scenario=self.scenario_doc, model=self.model)
            elif response_type == "companion":
                self.game_simulator_agent = CompanionAgent(scenario=self.scenario_doc, model=self.model)
            elif response_type == "assets":
                self.game_simulator_agent = AssetsAgent(scenario=self.scenario_doc, model=self.model)

            response_text, updated_history = await self.game_simulator_agent.respond(
                current_step=current_step,
                user_message=message,
                background_image=background_image,
                game_history=game_history,
                deps=deps,
            )
            return [response_text, updated_history] if response_text and updated_history else None

        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail="Something went wrong")