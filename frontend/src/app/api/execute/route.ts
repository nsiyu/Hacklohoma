import { NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function POST(request: Request) {
  try {
    const { code, language } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    if (language !== 'python') {
      return NextResponse.json(
        { error: 'Only Python execution is supported' },
        { status: 400 }
      );
    }

    const output = await executePython(code);
    return NextResponse.json({ output });

  } catch (error) {
    console.error('Error executing code:', error);
    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 }
    );
  }
}

async function executePython(code: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = spawn('python3', ['-c', code]);
    
    let output = '';
    let errorOutput = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    process.on('close', (code) => {
      if (code !== 0) {
        resolve(`Error:\n${errorOutput}`);
      } else {
        resolve(output || 'No output');
      }
    });

    process.on('error', (err) => {
      reject(`Failed to start Python process: ${err.message}`);
    });

    const timeout = setTimeout(() => {
      process.kill();
      reject('Execution timed out (5 seconds)');
    }, 5000);

    process.on('close', () => {
      clearTimeout(timeout);
    });
  });
} 