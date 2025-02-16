from fastapi import FastAPI, HTTPException

from .main import create_question
from .parsers import CodingQuestionGeneratorAgentModel, CodingQuestion
from .types import QuestionRequest
import uuid
from dotenv import load_dotenv
import json
import logging
from fastapi.middleware.cors import CORSMiddleware

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


@app.post("/create-question", response_model=CodingQuestion)
async def generate_question(request: QuestionRequest):
    try:
        crew_output = create_question(
            topic=request.topic,
            difficulty=request.difficulty,
            custom_requirements=request.custom_requirements,
        )
        logger.debug(f"Crew output type: {type(crew_output)}")

        if (
            hasattr(crew_output, "tasks_output")
            and crew_output.tasks_output
            and crew_output.tasks_output[0].pydantic
        ):
            question_generation_task_output: CodingQuestionGeneratorAgentModel = (
                crew_output.tasks_output[0].pydantic
            )
        else:
            raise HTTPException(500, "Error with question generation")

        logger.debug(
            f"Question Generation Task Output: {question_generation_task_output}"
        )

        question = CodingQuestion(
            title=question_generation_task_output.title,
            description=question_generation_task_output.description,
            difficulty=question_generation_task_output.difficulty,
            examples=question_generation_task_output.examples,
            constraints=question_generation_task_output.constraints,
            id=str(uuid.uuid4()),
        )

        return question

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
