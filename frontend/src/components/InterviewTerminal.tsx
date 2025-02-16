'use client'

interface TerminalProps {
  output?: string;
}

const Terminal = ({ output = '' }: TerminalProps) => {
  return (
    <div className="h-full w-full flex flex-col bg-gray-900 text-gray-100 font-mono text-sm">
      <div className="flex items-center gap-2 p-2 border-b border-gray-700 flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-2 text-gray-400">Output</span>
      </div>
      <div className="flex-1 p-4 overflow-auto w-full">
        <div className="whitespace-pre-wrap font-mono w-full">
          {output || (
            <span className="text-gray-500">
              Click &quot;Run Code&quot; to see the output here...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Terminal;