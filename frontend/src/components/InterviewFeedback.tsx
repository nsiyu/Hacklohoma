'use client'

import { ArrowLeftIcon, ShareIcon, DocumentDownloadIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { InterviewFeedbackProps } from '@/types/Feedback';

const InterviewFeedback = ({ feedback, interviewData }: InterviewFeedbackProps) => {
  const totalScore = ((feedback.software_engineer_code_feedback.correctness_score + feedback.software_engineer_code_feedback.syntax_score + 
    feedback.software_engineer_code_feedback.completeness_score + feedback.software_engineer_code_feedback.optimality_score) / 20) * 100;

  const ScoreIndicator = ({ score }: { score: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <div
          key={value}
          className={`h-1.5 w-4 rounded-full ${
            value <= score ? 'bg-emerald-500' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/catalog">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
                </button>
              </Link>
              <h1 className="ml-4 text-2xl font-bold text-gray-900">Interview Feedback</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors">
                <ShareIcon className="w-4 h-4" />
                Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors">
                <DocumentDownloadIcon className="w-4 h-4" />
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="p-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-emerald-600">{totalScore.toFixed(1)}%</span>
                <span className="text-sm text-gray-500 font-medium">Overall Score</span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-sm font-medium text-gray-500 mb-1">Question Level</div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                interviewData.question.difficulty.toLowerCase() === 'easy' 
                  ? 'bg-green-100 text-green-700'
                  : interviewData.question.difficulty.toLowerCase() === 'medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {interviewData.question.difficulty.charAt(0).toUpperCase() + 
                 interviewData.question.difficulty.slice(1)}
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-sm font-medium text-gray-500 mb-1">Duration</div>
              <div className="text-lg font-semibold text-gray-900">
                {Math.round(interviewData.transcript.reduce((max: number, t: { time_in_call_secs?: number }) => 
                  Math.max(max, t.time_in_call_secs || 0), 0) / 60)} mins
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Algorithm Correctness</div>
                    <div className="text-sm text-gray-500">Solution meets requirements</div>
                  </div>
                  <ScoreIndicator score={feedback.software_engineer_code_feedback.correctness_score} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Code Syntax</div>
                    <div className="text-sm text-gray-500">Code quality and readability</div>
                  </div>
                  <ScoreIndicator score={feedback.software_engineer_code_feedback.syntax_score} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Solution Completeness</div>
                    <div className="text-sm text-gray-500">Implementation thoroughness</div>
                  </div>
                  <ScoreIndicator score={feedback.software_engineer_code_feedback.completeness_score} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Code Optimality</div>
                    <div className="text-sm text-gray-500">Efficiency and optimization</div>
                  </div>
                  <ScoreIndicator score={feedback.software_engineer_code_feedback.optimality_score} />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Strengths</h2>
              <div className="flex flex-wrap gap-2">
                {feedback.software_engineer_future_plan_feedback.key_strengths.map((strength, index) => (
                  <span key={index} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full">
                    {strength}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Areas to Focus</h2>
              <div className="flex flex-wrap gap-2">
                {feedback.software_engineer_future_plan_feedback.area_to_focus.map((area, index) => (
                  <span key={index} className="px-3 py-1 bg-amber-50 text-amber-700 text-sm font-medium rounded-full">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 space-y-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Technical Performance</h2>
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{feedback.interview_feedback}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Communication & Behavior</h2>
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{feedback.behavioral_feedback}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Improvement Plan</h2>
              <ul className="space-y-3">
                {feedback.software_engineer_future_plan_feedback.improvement_feedback_plan.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Practice Topics</h2>
          <div className="flex flex-wrap gap-3">
            {feedback.software_engineer_future_plan_feedback.recommended_practice_topics.map((topic, index) => (
              <Link 
                key={index}
                href={`/catalog?topic=${topic}`}
                className="px-4 py-2 bg-white text-emerald-700 text-sm font-medium rounded-lg border border-emerald-200 hover:bg-emerald-50 transition-colors shadow-sm"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedback; 