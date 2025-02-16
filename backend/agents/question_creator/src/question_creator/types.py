from pydantic import BaseModel


class QuestionRequest(BaseModel):
    topic: str
    difficulty: str = "medium"
    custom_requirements: str | None = None
