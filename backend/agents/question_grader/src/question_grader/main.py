#!/usr/bin/env python
import sys
import warnings


from question_grader.crew import QuestionGrader
from question_grader.types import Example, CodingQuestionRequest

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information


def run():
    """
    Run the crew.
    """
    inputs = {}

    try:
        QuestionGrader().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")


def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {"topic": "AI LLMs"}
    try:
        QuestionGrader().crew().train(
            n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs
        )

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")


def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        QuestionGrader().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")


def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {"topic": "AI LLMs"}
    try:
        QuestionGrader().crew().test(
            n_iterations=int(sys.argv[1]), openai_model_name=sys.argv[2], inputs=inputs
        )

    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")


def create_report(Question: CodingQuestionRequest, transcript: str):
    examples_list_dict = [example.model_dump() for example in Question.examples]
    inputs = {
        "title": Question.title,
        "description": Question.description,
        "difficulty": Question.difficulty,
        "examples": examples_list_dict,
        "constraints": Question.constraints,
    }

    try:
        result = QuestionGrader().crew().kickoff(inputs=inputs)
        return result
    except Exception as e:
        raise Exception(f"An error occurred while creating the question: {e}")
