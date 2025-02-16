from pydantic import BaseModel


class QuestionRequest(BaseModel):
    topic: str
    difficulty: str = "easy"
    custom_requirements: str | None = None
