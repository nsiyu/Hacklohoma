'use client'

import Editor from '@monaco-editor/react';
import { useState } from 'react';
import Image from 'next/image';

interface CodeEditorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  onRun?: (code: string, language: string) => void;
  isRunning?: boolean;
  onCodeChange?: (code: string) => void;
}

const CodeEditor = ({ 
  value = '', 
  onChange = () => {}, 
  onRun = () => {},
  isRunning = false,
  onCodeChange = () => {}
}: CodeEditorProps) => {
  const [language, setLanguage] = useState<'python' | 'cpp'>('python');
  const [code, setCode] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { value: 'python', label: 'Python 3', icon: '/logos/python.svg' },
    { value: 'cpp', label: 'C++ 20', icon: '/logos/c++.png' },
  ];

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || '');
    onChange(value);
    onCodeChange(value || '');
  };

  const selectedLanguage = languages.find(lang => lang.value === language);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition-all duration-200 text-gray-700"
          >
            <Image 
              src={selectedLanguage?.icon || ''} 
              alt={selectedLanguage?.label || ''} 
              width={20} 
              height={20} 
              className="object-contain"
            />
            <span>{selectedLanguage?.label}</span>
            <svg 
              className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute mt-2 w-48 bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden z-20">
                {languages.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => {
                      setLanguage(lang.value as 'python' | 'cpp');
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200
                      ${language === lang.value ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700'}`}
                  >
                    <Image 
                      src={lang.icon} 
                      alt={lang.label} 
                      width={20} 
                      height={20} 
                      className="object-contain"
                    />
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        
        <button
          onClick={() => onRun(code, language)}
          disabled={isRunning}
          className={`bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isRunning ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Running...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Run Code
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16 },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;