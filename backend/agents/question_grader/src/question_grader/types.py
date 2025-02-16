from pydantic import BaseModel, Field
from typing import List, Optional


class Example(BaseModel):
    input: str = Field(description="The input example for the coding question")
    output: str = Field(description="The expected output for the example")
    explanation: str = Field(description="Explanation of how the example works")


class CodingQuestionRequest(BaseModel):
    title: Optional[str] = Field(description="Title of the coding question")
    description: Optional[str] = Field(
        description="Detailed description of the problem"
    )
    difficulty: Optional[str] = Field(
        description="Difficulty level: easy, medium, or hard"
    )
    examples: Optional[List[Example]] = Field(description="List of example cases")
    constraints: Optional[List[str]] = Field(
        description="List of constraints for the problem"
    )


class Transcript(BaseModel):
    conversation_turn_metrics: Optional[str] = None
    feedback: Optional[str] = None
    message: Optional[str] = None
    role: Optional[str] = None
    time_in_call_secs: Optional[str] = None
    tool_calls: Optional[str] = None
    tool_results: Optional[List] = None


class GradeRequest(BaseModel):
    code: str
    question: CodingQuestionRequest
    transcript: List[Transcript]
