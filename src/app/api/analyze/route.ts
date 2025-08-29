import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    if (!response.ok) {
      throw new Error('Ollama not responding');
    }
    
    const data = await response.json();
    return NextResponse.json({ 
      status: 'success', 
      message: 'Ollama is running!',
      models: data.models 
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Cannot connect to Ollama',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}