from crewai import Agent, Crew, Task
from crewai.project import CrewBase, agent, crew, task
from .parsers import CodingQuestionGeneratorAgentModel


@CrewBase
class QuestionCreator:
    """QuestionCreator crew"""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def question_creator(self) -> Agent:
        return Agent(
            config=self.agents_config["question_creator"],
            verbose=True,
            llm="gemini/gemini-2.0-flash-exp",
        )

    @task
    def question_creation_task(self) -> Task:
        return Task(
            config=self.tasks_config["question_creation_task"],
            output_pydantic=CodingQuestionGeneratorAgentModel,
        )

    @crew
    def crew(self) -> Crew:
        """Creates the QuestionCreator crew"""

        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            verbose=True,
        )
