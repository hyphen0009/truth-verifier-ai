import { NextRequest, NextResponse } from 'next/server';

async function queryOllama(model: string, prompt: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || 'No response from model';
  } catch (error) {
    console.error(`Error querying ${model}:`, error);
    return `Error: Could not get response from ${model}`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    console.log(`Analyzing URL: ${url}`);
    
    // For now, we'll simulate the analysis since we can't actually download videos
    // In a real implementation, you would download the video and extract audio/frames
    
    const fakeTranscription = "This is a simulated transcription. In a real implementation, we would download the video and use Whisper to transcribe the audio.";
    const fakeVisualAnalysis = "This is a simulated visual analysis. In a real implementation, we would extract video frames and use LLaVA to analyze them.";
    
    // Use llama3 for fact-checking analysis
    const prompt = `
    Analyze this social media content for credibility:
    
    CONTENT: ${fakeTranscription}
    
    Please provide:
    1. Credibility rating (Highly Credible, Mostly Credible, Mixed Reliability, Mostly Unreliable, Highly Unreliable)
    2. Confidence score (0-100%)
    3. Brief conclusion explaining your assessment
    
    Format your response as JSON with these keys: credibility, score, conclusion
    `;

    const aiResponse = await queryOllama('llama3', prompt);
    
    // Try to parse the AI response
    let credibility = "Mixed Reliability";
    let score = 65;
    let conclusion = "AI analysis completed. This is a simulation since actual video processing is not implemented.";
    
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        credibility = parsed.credibility || credibility;
        score = parsed.score || score;
        conclusion = parsed.conclusion || conclusion;
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      conclusion = aiResponse;
    }
    
    const response = {
      credibility,
      score,
      transcription: fakeTranscription,
      visualAnalysis: fakeVisualAnalysis,
      conclusion: conclusion + " \n\nNote: This is a simulation. Real implementation would process actual video content.",
      factCheckResults: []
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error verifying reel:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process reel',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}