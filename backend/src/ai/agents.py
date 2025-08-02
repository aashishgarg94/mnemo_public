from typing import Optional, Dict, List, Any
from fastapi import FastAPI, Body
from pydantic import BaseModel, Field
from pydantic_ai import Agent, RunContext
from models.llama import LLaMAModel
# from pydantic_ai.settings import ModelSettings
import json


# class GameState(BaseModel):
#     """Flexible store for scenario metrics."""
#     metrics: Dict[str, int] = Field(default_factory=dict)


# class ScenarioDocument(BaseModel):
#     """Holds info about the scenario (e.g., Cleopatra, Henry Ford)."""
#     title: str
#     overview: str
#     rules: Dict[str, Any] = Field(default_factory=dict)


class ScenarioDocument(BaseModel):
    title: str
    intro: str
    ai_character: Dict[str, Any] = Field(default_factory=dict)
    scenes: List[Dict[str, Any]] = Field(default_factory=list)
    background_images: List[Dict[str, Any]] = Field(default_factory=list)
    avatar_images: List[Dict[str, Any]] = Field(default_factory=list)
    facts: List[str] = Field(default_factory=list)
    puzzles: List[Dict[str, Any]] = Field(default_factory=list)
    companion: Dict[str, Any] = Field(default_factory=dict)
    game_visual_assets: List[Dict[str, Any]] = Field(default_factory=list)

class AgentMessage(BaseModel):
    sender: str
    content: str
    context: Dict[str, Any] = Field(default_factory=dict)


# class GameState(BaseModel):
#     step: int


class AvatarImage(BaseModel):
    src: str
    x: int
    y: int
class GameAgentOutput(BaseModel):
    nextMessage: str
    step: int
    background_image: str
    avatar_images: List[AvatarImage] = Field(default_factory=list)
    prompt_suggestions: List[str] = Field(default_factory=list)

class PuzzleAgentOutput(BaseModel):
    nextMessage: str

class SummaryAgentOutput(BaseModel):
    nextMessage: str

class CompanionAgentOutput(BaseModel):
    nextMessage: str

class AssetsAgentOutput(BaseModel):
    src: str
    x: int
    y: int


class GameSimulatorAgent:
    def __init__(self, scenario: ScenarioDocument, model: LLaMAModel):
        self.agent = Agent(
            model=model,
            system_prompt=(
                "You are a game simulation AI. "
                "You receive a scenario with certain rules and the current game step "
                "You also receive user input describing an action. "
                "You must determine if the game moves to the next step or stays on the current."
                "You are a historical figure providing context in first-person. "
                "Stay in character, be informative. Personality details:\n"
                f"{scenario.ai_character}\n"
                # "Output valid JSON that fits the GameAgentOutput model.\n"
                f"You can refer to facts while conversing or giving a contrarian view: {scenario.facts}\n"
                f"Scenario Title: {scenario.title}\n"
                f"Scenario Overview: {scenario.intro}\n"
                "Scenes in order:\n"
                f"{scenario.scenes}\n"
                "Check if the scene requires a different background image than the current. If yes, pick from the list based on its description, and send the url as string of whatever image is chosen - current or next. But make sure one image is chosen.\n"
                f"Background images:{scenario.background_images}\n"
                "If the scene requires a puzzle or hints around the puzzle being played, it can be picked from the list. In the case of puzzle being played the relevant background image will be the puzzle image. Otherwise the normal background image of the scene. In case the user is stuck, you can help using hints and answer. If the correct answer is sent while playing the puzzle, can move to another puzzle or next scene.\n"
                f"{scenario.puzzles}\n"
                "Use these narrations as representative, but construct the message in your tone.\n"
                "Use player's name and game history as per your convenience.\n",
                "Also you can give upto 3 prompt suggestions as a list of strings for the user to choose from for the next action. These can be taken from the suggested_prompts in the scenes. You can choose to not give any suggested responses also if none are required in that scene according to the description.\n",
                "Keep your responses crisp and try to be funny at times in the style of your character.\n",
                "Limit your response to 20 words\n",
                "Do not use words like my dear friend, my dear player, etc. Keep the reply relevant.\n",
                f"Also, you need to send the avatar images as a list of objects with src, x and y coordinates for the avatar to be placed on the screen in a format that matches AvatarImage. URL and reference coordinates of the avatars are included in {scenario.avatar_images}\n",
                "Important: the avatar_images field in output has to be a list of JSON matching { src: string, x: int, y: int }.\n"
                "Important: Only output JSON matching { nextMessage: string, step: int, background_image: string, avatar_images: list, prompt_suggestions: list }.\n"
            ),
            # model_settings=ModelSettings(max_tokens=512, temperature=0.0),
            retries=2
        )

    async def respond(
        self, current_step: int, user_message: AgentMessage, background_image: str, game_history: List[dict], deps
    ) -> GameAgentOutput:
        user_prompt = (
            f"Current GameState.step: {current_step}\n"
            f"User Input: {user_message.content}\n"
            f"Background Image: {background_image}\n"
            f"Game History: {game_history}\n"
            "What happens next?\n"
        )
        result = await self.agent.run(user_prompt, deps=deps)

        print(result)
        print(result.data)
        parsed_json = json.loads(result.data)
        # # response_content = result._all_messages[-1].parts[0].content.strip()  # Access the last message (ModelTextResponse)
        # response_content = result

        # # Extract only the JSON part
        # json_string = response_content.strip("```json").strip("```").strip()

        # # Optionally, parse the JSON string into a Python dictionary
        # parsed_json = json.loads(json_string)

        game_history.append({
            "step": current_step,
            "user_message": user_message.content,
            "agent_response": parsed_json
        })

        return GameAgentOutput(**parsed_json), game_history


class PuzzleAgent:
    def __init__(self, scenario: ScenarioDocument, model: LLaMAModel, puzzle: Dict[str, Any]):
        self.agent = Agent(
            model=model,
            system_prompt=(
                "You are a puzzle simulation AI.",
                "You receive a puzzle scenario with certain rules, correct answer and possible hints.",
                f"{puzzle}\n",
                "You also receive user input describing a guess or asking for hint. Tell the user the answer is correct or incorrect. Give hints and motivation if the user is stuck.",
                "You are a historical figure providing context in first-person. ",
                "Stay in character, construct the response in your tone. Personality details:\n",
                f"{scenario.ai_character}\n",
                "Use player's name and game history as per your convenience.\n",
                "Keep your responses crisp\n",
                "Do not give hints unless asked, also if the hints are asked be emotionally aware and have a helpful tone.\n",
                "Use easy language suited to 8 year olds kids while maintaining character\n",
                "Do not use words like my dear friend, my dear player, etc. Keep the reply relevant. Limit the response to 30 words\n",
                "Never give the rules in the response again, only use them to create your hint.\n",
                "Important: Only talk about the puzzle and hints in the response. Do not give any other information.\n"
                "Important: Only output JSON matching { nextMessage: string }.\n"
            ),
            # model_settings=ModelSettings(max_tokens=512, temperature=0.0),
            retries=2
        )

    async def respond(
        self, current_step: int, user_message: AgentMessage, background_image: str, game_history: List[dict], deps
    ) -> PuzzleAgentOutput:
        user_prompt = (
            f"User Input: {user_message.content}\n"
            f"Game History: {game_history}\n"
        )
        result = await self.agent.run(user_prompt, deps=deps)
        parsed_json = json.loads(result.data)
        # response_content = result._all_messages[-1].parts[0].content.strip()  # Access the last message (ModelTextResponse)

        # # Extract only the JSON part
        # json_string = response_content.strip("```json").strip("```").strip()

        # # Optionally, parse the JSON string into a Python dictionary
        # parsed_json = json.loads(json_string)

        game_history.append({
            "user_message": user_message.content,
            "agent_response": parsed_json
        })

        return PuzzleAgentOutput(**parsed_json), game_history


class SummaryAgent:
    def __init__(self, scenario: ScenarioDocument, model: LLaMAModel):
        self.agent = Agent(
            model=model,
            system_prompt=(
                "You are a summary agent for a game simulation AI.\n",
                "You receive user input talking to you while discussing what it learnt from the game.\n",
                "You also receive the game history. Judge how the user interacted and learnt in the game\n",
                "You are a historical figure providing context in first-person.\n",
                "Stay in character, construct the response in your tone. Personality details:\n"
                f"{scenario.ai_character}\n"
                "Use player's name and game history as per your convenience.\n",
                "Keep your responses crisp\n",
                "Highlight the key skills the player has, eg are they creative, are they innovative, are they good at problem solving, are they good at puzzles, are they knowledgeable about history, etc. Base your judgement based on the game history\n",
                "If the user asks a specific question about his learning, answer that instead of giving the entire summary\n",
                "This will be the last interaction of the user after playing the game, end with a goodbye note hoping to see them again. Do not ask them to further solve anything in the game. End the conversation with an evaluation of the user skills\n",
                "Never use words like my dear friend, my dear player, etc. Keep the reply relevant. Keep the response between 20 and 30 words\n",
                "Important: Only talk about what the user learnt, achieved and can work on further based on the game history. Do not give any other information.\n",
                "Important: Only output JSON matching { nextMessage: string }.\n"
            ),
            # model_settings=ModelSettings(max_tokens=512, temperature=0.0),
            retries=2
        )

    async def respond(
        self, current_step: int, user_message: AgentMessage, background_image: str, game_history: List[dict], deps
    ) -> SummaryAgentOutput:
        user_prompt = (
            f"User Input: {user_message.content}\n"
            f"Game History: {game_history}\n"
            "What is your evaluation of the user\n"
        )
        result = await self.agent.run(user_prompt, deps=deps)

        parsed_json = json.loads(result.data)

        # response_content = result._all_messages[-1].parts[0].content.strip()  # Access the last message (ModelTextResponse)

        # # Extract only the JSON part
        # json_string = response_content.strip("```json").strip("```").strip()

        # # Optionally, parse the JSON string into a Python dictionary
        # parsed_json = json.loads(json_string)

        game_history.append({
            "user_message": user_message.content,
            "agent_response": parsed_json
        })

        return SummaryAgentOutput(**parsed_json), game_history



class CompanionAgent:
    def __init__(self, scenario: ScenarioDocument, model: LLaMAModel):
        self.agent = Agent(
            model=model,
            system_prompt=(
                "You are a companion agent for a game simulation AI character.\n",
                "You also receive user input talking to the character.\n",
                "You are a funny or sarcastic animal like a cat etc \n",
                "Stay in character, construct the response in your tone. Personality details:\n"
                f"{scenario.companion}\n"
                "Use player's name and game history as per your convenience.\n",
                "Keep your responses crisp and one liners limited to 20 words, ideally less than 10.\n",
                "Important: Only output JSON matching { nextMessage: string }.\n"
            ),
            # model_settings=ModelSettings(max_tokens=512, temperature=0.0),
            retries=2
        )

    async def respond(
        self, current_step: int, user_message: AgentMessage, background_image: str, game_history: List[dict], deps
    ) -> CompanionAgentOutput:
        user_prompt = (
            f"User Input: {user_message.content}\n"
            f"Game History: {game_history}\n"
            "Give a funny, sarcastic response\n"
        )
        result = await self.agent.run(user_prompt, deps=deps)

        parsed_json = json.loads(result.data)
        # response_content = result._all_messages[-1].parts[0].content.strip()  # Access the last message (ModelTextResponse)

        # # Extract only the JSON part
        # json_string = response_content.strip("```json").strip("```").strip()

        # # Optionally, parse the JSON string into a Python dictionary
        # parsed_json = json.loads(json_string)

        game_history.append({
            "user_message": user_message.content,
            "agent_response": parsed_json
        })

        return CompanionAgentOutput(**parsed_json), game_history


class AssetsAgent:
    def __init__(self, scenario: ScenarioDocument, model: LLaMAModel):
        print("check assets", scenario.game_visual_assets)
        self.agent = Agent(
            model=model,
            system_prompt=(
                "You are a assets suggestion agent for a game simulation.\n",
                "You receive user input asking for what asset they want.\n",
                "You are given a list of available assets with their url and indicative positioning on the frontend, give according to what is most relevant to the user request.\n",
                f"{scenario.game_visual_assets}\n"
                "Use player's name and game history as per your convenience.\n",
                "Give only exactly one relevant asset\n",
                "Important: the url has to be chosen from the list of assets and there is to be no url can be given which is not in the list, and the positioning has to be indicative of where it should be placed on the screen.\n"
                "Important: Only output JSON matching { src: string, x: int, y: int }.\n"
            ),
            # model_settings=ModelSettings(max_tokens=512, temperature=0.0),
            retries=2
        )

    async def respond(
        self, current_step: int, user_message: AgentMessage, background_image: str, game_history: List[dict], deps
    ) -> AssetsAgentOutput:
        user_prompt = (
            f"User Input: {user_message.content}\n"
            f"Game History: {game_history}\n"
            "Give the assets and positioning\n"
        )
        result = await self.agent.run(user_prompt, deps=deps)

        parsed_json = json.loads(result.data)
        # response_content = result._all_messages[-1].parts[0].content.strip()  # Access the last message (ModelTextResponse)

        # # Extract only the JSON part
        # json_string = response_content.strip("```json").strip("```").strip()

        # # Optionally, parse the JSON string into a Python dictionary
        # parsed_json = json.loads(json_string)

        game_history.append({
            "user_message": user_message.content,
            "agent_response": parsed_json
        })

        return AssetsAgentOutput(**parsed_json), game_history