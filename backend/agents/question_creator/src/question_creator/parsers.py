from pydantic import BaseModel, Field
from typing import List


class Example(BaseModel):
    input: str = Field(description="The input example for the coding question")
    output: str = Field(description="The expected output for the example")
    explanation: str = Field(description="Explanation of how the example works")


class CodingQuestionGeneratorAgentModel(BaseModel):
    title: str = Field(description="Title of the coding question")
    description: str = Field(description="Detailed description of the problem")
    difficulty: str = Field(description="Difficulty level: easy, medium, or hard")
    examples: List[Example] = Field(description="List of example cases")
    constraints: List[str] = Field(description="List of constraints for the problem")


class CodingQuestion(CodingQuestionGeneratorAgentModel):
    id: str = Field(description="Unique identifier for the question")
