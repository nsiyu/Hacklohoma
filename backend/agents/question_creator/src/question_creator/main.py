import sys
import warnings
from datetime import datetime

from question_creator.crew import QuestionCreator

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")


def run():
    """
    Run the crew.
    """
    inputs = {"topic": "AI LLMs", "current_year": str(datetime.now().year)}

    try:
        QuestionCreator().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")


def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {"topic": "AI LLMs"}
    try:
        QuestionCreator().crew().train(
            n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs
        )

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")


def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        QuestionCreator().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")


def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {"topic": "AI LLMs"}
    try:
        QuestionCreator().crew().test(
            n_iterations=int(sys.argv[1]), openai_model_name=sys.argv[2], inputs=inputs
        )

    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")


def create_question(topic: str, difficulty: str, custom_requirements: str = None):
    """
    Create a question with custom parameters.

    Args:
        topic: The topic for the question
        difficulty: Desired difficulty level (easy, medium, hard)
        custom_requirements: Any additional requirements for the question

    Returns:
        dict: The created question in JSON format
    """
    inputs = {
        "topic": topic,
        "difficulty": difficulty,
        "custom_requirements": custom_requirements,
    }

    try:
        result = QuestionCreator().crew().kickoff(inputs=inputs)
        return result
    except Exception as e:
        raise Exception(f"An error occurred while creating the question: {e}")


def create_question(topic: str, difficulty: str, custom_requirements: str = None):
    """
    Create a question with custom parameters.

    Args:
        topic: The topic for the question
        difficulty: Desired difficulty level (easy, medium, hard)
        custom_requirements: Any additional requirements for the question

    Returns:
        dict: The created question in JSON format
    """
    inputs = {
        "topic": topic,
        "difficulty": difficulty,
        "custom_requirements": custom_requirements,
    }

    try:
        result = QuestionCreator().crew().kickoff(inputs=inputs)
        return result
    except Exception as e:
        raise Exception(f"An error occurred while creating the question: {e}")
