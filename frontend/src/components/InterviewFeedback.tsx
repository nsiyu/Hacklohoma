'use client'

import { useState } from 'react';
import { ArrowLeftIcon, ShareIcon, DocumentDownloadIcon } from '@heroicons/react/outline';
import Link from 'next/link';

interface FeedbackScores {
  correctness_score: number;
  syntax_score: number;
  completeness_score: number;
  optimality_score: number;
  total_score: number;
  percentile: number;
  interview_duration: string;
  question_difficulty: string;
  interview_feedback: string;
  behavioral_feedback: string;
  improvement_feedback: string;
  key_strengths: string[];
  areas_to_focus: string[];
  recommended_topics: string[];
}

const InterviewFeedback = ({ feedback }: { feedback: FeedbackScores }) => {
  const totalScore = ((feedback.correctness_score + feedback.syntax_score + 
    feedback.completeness_score + feedback.optimality_score) / 20) * 100;

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
      {/* Sticky Header */}
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
        {/* Modified Overview Score Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="p-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-emerald-600">{totalScore.toFixed(1)}%</span>
                <span className="text-sm text-gray-500 font-medium">Overall Score</span>
              </div>
              <div className="mt-1 text-sm text-gray-600">
                Percentile Rank: {feedback.percentile}%
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-sm font-medium text-gray-500 mb-1">Question Level</div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                  {feedback.question_difficulty}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-sm font-medium text-gray-500 mb-1">Duration</div>
              <div className="text-gray-900">{feedback.interview_duration}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Performance Metrics */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Algorithm Correctness</div>
                    <div className="text-sm text-gray-500">Solution meets requirements</div>
                  </div>
                  <ScoreIndicator score={feedback.correctness_score} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Code Syntax</div>
                    <div className="text-sm text-gray-500">Code quality and readability</div>
                  </div>
                  <ScoreIndicator score={feedback.syntax_score} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Solution Completeness</div>
                    <div className="text-sm text-gray-500">Implementation thoroughness</div>
                  </div>
                  <ScoreIndicator score={feedback.completeness_score} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Code Optimality</div>
                    <div className="text-sm text-gray-500">Efficiency and optimization</div>
                  </div>
                  <ScoreIndicator score={feedback.optimality_score} />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Strengths</h2>
              <div className="flex flex-wrap gap-2">
                {feedback.key_strengths.map((strength, index) => (
                  <span key={index} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full">
                    {strength}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Areas to Focus</h2>
              <div className="flex flex-wrap gap-2">
                {feedback.areas_to_focus.map((area, index) => (
                  <span key={index} className="px-3 py-1 bg-amber-50 text-amber-700 text-sm font-medium rounded-full">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Feedback */}
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
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{feedback.improvement_feedback}</p>
            </div>
          </div>
        </div>

        {/* Practice Recommendations */}
        <div className="mt-8 bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Practice Topics</h2>
          <div className="flex flex-wrap gap-3">
            {feedback.recommended_topics.map((topic, index) => (
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