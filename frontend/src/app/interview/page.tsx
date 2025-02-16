'use client'

import { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import CodeEditor from '@/components/CodeEditor';
import Terminal from '@/components/InterviewTerminal';
import InterviewSidebar from '@/components/InterviewSidebar';
import ConvAI from '@/components/ConvAI';
import { InterviewQuestion } from '@/types/Interview';

enum Topic {
  Array = "Array",
  String = "String",
  BinarySearch = "Binary Search",
  Sorting = "Sorting",
  Greedy = "Greedy",
  DynamicProgramming = "Dynamic Programming",
}

const ResizeHandle = ({ className = '', ...props }) => {
  return (
    <PanelResizeHandle 
      className={`group relative bg-gray-200 transition-colors hover:bg-emerald-500 ${className}`}
      {...props}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
        <svg width="8" height="24" viewBox="0 0 8 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4" cy="4" r="0.75" fill="white"/>
          <circle cx="4" cy="12" r="0.75" fill="white"/>
          <circle cx="4" cy="20" r="0.75" fill="white"/>
        </svg>
      </div>
    </PanelResizeHandle>
  );
};

const InterviewPage = () => {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [question, setQuestion] = useState<InterviewQuestion | null>(null);
  const [currentCode, setCurrentCode] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<any[]>([]);

  const addTranscriptMessage = (message: any) => {
    setTranscript(prev => [...prev, message]);
  };

  const handleQuestionLoaded = (loadedQuestion: InterviewQuestion) => {
    setQuestion(loadedQuestion);
    setIsLoading(false);
  };

  const handleRunCode = async (code: string, language: string) => {
    try {
      setIsRunning(true);
      setOutput('Running code...');

      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();
      
      if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else {
        setOutput(data.output || 'No output');
      }
    } catch {
      setOutput('Failed to execute code. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-screen flex bg-white">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
            <p className="text-gray-600 font-medium">Loading interview environment...</p>
          </div>
        </div>
      )}

      <PanelGroup direction="horizontal" className="h-full w-full">
        <Panel defaultSize={25} minSize={20}>
          <InterviewSidebar 
            onQuestionLoaded={handleQuestionLoaded} 
            questionParams={{topic: Topic.Array, company: "Meta"}}
            conversationId={conversationId || undefined}
          />
        </Panel>

        <ResizeHandle className="w-1.5" />

        <Panel minSize={30}>
          <PanelGroup direction="vertical" className="h-full">
            <Panel defaultSize={70} minSize={30}>
              <CodeEditor 
                onRun={handleRunCode} 
                isRunning={isRunning}
                onCodeChange={setCurrentCode}
              />
            </Panel>

            <ResizeHandle className="h-1.5" />

            <Panel defaultSize={30} minSize={20}>
              <div className="h-full">
                <Terminal output={output} />
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>

      <ConvAI 
        question={question} 
        currentCode={currentCode}
        onConversationStart={setConversationId}
        onTranscriptUpdate={addTranscriptMessage}
      />
    </div>
  );
};

export default InterviewPage;
