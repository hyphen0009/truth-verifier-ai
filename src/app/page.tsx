'use client';

import { useState } from 'react';

export default function Home() {
  const [reelUrl, setReelUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    credibility: string;
    score: number;
    transcription: string;
    visualAnalysis: string;
    conclusion: string;
    factCheckResults?: any[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyReel = async () => {
    if (!reelUrl) return;
    
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/verify-reel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: reelUrl }),
      });
      
      if (!response.ok) {
        throw new Error('Verification failed');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to verify reel. Please check the URL and try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-700 bg-green-50 border-green-200';
    if (score >= 60) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const getCredibilityIcon = (score: number) => {
    if (score >= 80) return '✅';
    if (score >= 60) return '⚠️';
    return '❌';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-sm mb-5 border border-gray-100">
            <span className="text-3xl">🔍</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Truth Verifier AI</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Verify the authenticity of social media content with AI-powered analysis
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          {/* Input Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="reel-url" className="block text-sm font-semibold text-gray-800">
                Enter Social Media URL
              </label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Beta
              </span>
            </div>
            
            <div className="flex gap-3">
              <input
                type="url"
                id="reel-url"
                value={reelUrl}
                onChange={(e) => setReelUrl(e.target.value)}
                placeholder="https://instagram.com/reel/... or https://tiktok.com/..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
              />
              
              <button
                onClick={verifyReel}
                disabled={isAnalyzing || !reelUrl}
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold whitespace-nowrap min-w-[120px]"
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Analyzing
                  </span>
                ) : (
                  'Verify Now'
                )}
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2 ml-1">
              Supports Instagram Reels, TikTok, YouTube Shorts, and more
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Results Section */}
          {result && (
            <div className="space-y-6 pt-6 border-t border-gray-100">
              {/* Credibility Score Card */}
              <div className={`border rounded-2xl p-6 text-center ${getCredibilityColor(result.score)}`}>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-3xl mr-3">{getCredibilityIcon(result.score)}</span>
                  <h2 className="text-2xl font-bold">{result.credibility}</h2>
                </div>
                
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div 
                      className={`h-2.5 rounded-full ${
                        result.score >= 80 ? 'bg-green-500' :
                        result.score >= 60 ? 'bg-blue-500' :
                        result.score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${result.score}%` }}
                    ></div>
                  </div>
                  <p className="text-sm font-semibold">{result.score}% Confidence Score</p>
                </div>
                
                <p className="text-sm text-gray-600">
                  Based on AI analysis of audio and visual content
                </p>
              </div>

              {/* Two Column Layout for Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Transcription Card */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-100 p-2 rounded-lg mr-3">
                      <span className="text-blue-600 text-lg">🎤</span>
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">Audio Transcription</h3>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-100">
                    <p className="text-gray-700 leading-relaxed text-sm">{result.transcription}</p>
                  </div>
                </div>

                {/* Visual Analysis Card */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <span className="bg-green-100 p-2 rounded-lg mr-3">
                      <span className="text-green-600 text-lg">🖼️</span>
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">Visual Analysis</h3>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-100">
                    <p className="text-gray-700 leading-relaxed text-sm">{result.visualAnalysis}</p>
                  </div>
                </div>
              </div>

              {/* Fact Check Results */}
              {result.factCheckResults && result.factCheckResults.length > 0 && (
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                  <div className="flex items-center mb-4">
                    <span className="bg-amber-100 p-2 rounded-lg mr-3">
                      <span className="text-amber-600 text-lg">📋</span>
                    </span>
                    <h3 className="text-lg font-semibold text-amber-900">Fact Check Results</h3>
                  </div>
                  <div className="space-y-4">
                    {result.factCheckResults.map((factCheck: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-amber-100">
                        <h4 className="font-semibold text-amber-900 mb-2">"{factCheck.claim}"</h4>
                        {factCheck.results.map((result: any, idx: number) => (
                          <div key={idx} className="text-sm text-gray-700 ml-2 mb-2">
                            <p><strong>Source:</strong> {result.claimReview?.[0]?.publisher?.name || 'Unknown'}</p>
                            <p><strong>Rating:</strong> {result.claimReview?.[0]?.textualRating || 'No rating'}</p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conclusion Card */}
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <div className="flex items-center mb-4">
                  <span className="bg-blue-100 p-2 rounded-lg mr-3">
                    <span className="text-blue-600 text-lg">📝</span>
                  </span>
                  <h3 className="text-lg font-semibold text-blue-900">AI Conclusion</h3>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <p className="text-blue-900 leading-relaxed">{result.conclusion}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Powered by AI analysis • Always verify through multiple reliable sources
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Using Ollama with llama3 model for content verification
          </p>
        </div>
      </div>
    </div>
  );
}