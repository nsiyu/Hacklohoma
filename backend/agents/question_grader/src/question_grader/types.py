from pydantic import BaseModel, Field


class Example(BaseModel):
    input: str = Field(description="The input example for the coding question")
    output: str = Field(description="The expected output for the example")
    explanation: str = Field(description="Explanation of how the example works")
