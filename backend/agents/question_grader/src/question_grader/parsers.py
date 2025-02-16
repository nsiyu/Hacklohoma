from typing import List
from pydantic import BaseModel, Field


class CodeFeedback(BaseModel):
    correctness_score: int = Field(
        description="The score of the correctness of the alogirthm for the problem given the constraints.",
        ge=0,
        le=5,
    )
    syntax_score: int = Field(
        description="The score of the correctness of the code syntax.", ge=0, le=5
    )
    completeness_score: int = Field(
        description="The score of the completeness of the code to solve the question. The code should be fully runnable.",
        ge=0,
        le=5,
    )
    optimality_score: int = Field(
        description="The score of the optimality of the algorithm and the code for the given problem.",
        ge=0,
        le=5,
    )


class EngineerFuturePlanFeedback(BaseModel):
    key_strengths: List[str] = Field(
        description="The areas of the user strength each being less or equal to 23 words",
        min_length=1,
        max_length=5,
    )

    area_to_focus: List[str] = Field(
        description="The areas of the user improvement each being less or equal to 3 words",
        min_length=1,
        max_length=5,
    )

    recommended_practice_topics: List[str] = Field(
        description="Similar and related topics to practice each being less or equal to 3 words",
        min_length=1,
        max_length=5,
    )

    improvement_feedback_plan: List[str] = Field(
        description="The improvement plan of the interviewer for how the candidate can improve.",
        min_length=1,
        max_length=5,
    )


class RecruiterFeedback(BaseModel):

    software_engineer_code_feedback: CodeFeedback = Field(
        description="Numerical scores of the software engineer interviewer's feedback."
    )

    software_engineer_subjective_feedback: EngineerFuturePlanFeedback = Field(
        description="Feedback of the software engineer interviewer for key strengths of the user, areas to focus, recommend practice topics, and improvement plan list"
    )

    interview_feedback: str = Field(
        description="The summary of the interview feedback from the interviewer."
    )
    behavioral_feedback: str = Field(
        description="The summary of the candidate's behavioral and communication skills feedback from the interviewer."
    )
