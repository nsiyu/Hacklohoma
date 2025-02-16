from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from dotenv import load_dotenv
import json
import logging
from fastapi.middleware.cors import CORSMiddleware

from .main import create_report
from .parsers import RecruiterFeedback
from .types import GradeRequest

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


class QuestionRequest(BaseModel):
    topic: str
    difficulty: str = "medium"
    custom_requirements: str | None = None


@app.post("/grade-interview", response_model=RecruiterFeedback)
async def generate_question(request: GradeRequest):
    try:
        crew_output = create_report(request.code, request.question, request.transcripts)

        logger.debug(f"Crew output type: {type(crew_output)}")

        if (
            hasattr(crew_output, "tasks_output")
            and crew_output.tasks_output
            and crew_output.tasks_output[2].pydantic
        ):
            report: RecruiterFeedback = crew_output.tasks_output[2].pydantic
        else:
            raise HTTPException(500, "Error with question generation")

        logger.debug(f"Report Task Output: {report}")

        return report

    except json.JSONDecodeError as e:
        logger.error(f"JSON parsing error: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to parse JSON output: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Failed to create question: {str(e)}"
        )


# uvicorn question_creator.api:app --reload
