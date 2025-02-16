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
    examples: Optional[List[Example]] = Field(
        default_factory=list
    )  # ✅ Ensures list parsing
    constraints: Optional[List[str]] = Field(
        default_factory=list
    )  # ✅ Ensures list parsing


class Transcript(BaseModel):
    conversation_turn_metrics: Optional[str] = None
    feedback: Optional[str] = None
    message: Optional[str] = None
    role: Optional[str] = None
    time_in_call_secs: Optional[int] = None
    tool_calls: Optional[List] = None  # ✅ Allow None
    tool_results: Optional[List] = None  # ✅ Allow None


class GradeRequest(BaseModel):
    code: str
    question: CodingQuestionRequest
    transcripts: List[Transcript]
