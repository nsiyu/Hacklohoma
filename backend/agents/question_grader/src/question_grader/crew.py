from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

from .parsers import CodeFeedback, EngineerFuturePlanFeedback, RecruiterFeedback


@CrewBase
class QuestionGrader:
    """QuestionGrader crew"""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def technical_question_grader(self) -> Agent:
        return Agent(
            config=self.agents_config["technical_question_grader"],
            verbose=True,
            llm="gemini/gemini-2.0-flash-exp",
        )

    @agent
    def recruiter_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["recruiter_agent"],
            verbose=True,
            llm="gemini/gemini-2.0-flash-exp",
        )

    @task
    def code_scoring_task(self) -> Task:
        return Task(
            config=self.tasks_config["code_scoring_task"],
            output_pydantic=CodeFeedback,
        )

    @task
    def strengths_feedback_task(self) -> Task:
        return Task(
            config=self.tasks_config["strengths_feedback_task"],
            output_pydantic=EngineerFuturePlanFeedback,
        )

    @task
    def feedback_generation_task(self) -> Task:
        return Task(
            config=self.tasks_config["feedback_generation_task"],
            output_pydantic=RecruiterFeedback,
            context=[self.code_scoring_task(), self.strengths_feedback_task()],
        )

    @crew
    def crew(self) -> Crew:
        """Creates the QuestionGrader crew"""

        return Crew(
            agents=self.agents,  # Automatically created by the @agent decorator
            tasks=self.tasks,  # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
        )
