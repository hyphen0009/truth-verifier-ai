# 🔍 Truth Verifier AI

A powerful AI-powered application that analyzes social media content for authenticity and credibility. Built with Next.js and Ollama AI models.

**Team Hyphen** - *Zaid & Manjeet*

## 🌟 Features

- **AI-Powered Analysis**: Uses Ollama with llama3 model for content verification
- **Multi-Platform Support**: Works with Instagram Reels, TikTok, YouTube Shorts, and more
- **Comprehensive Reporting**: Provides credibility scores, transcriptions, visual analysis, and conclusions
- **Modern UI**: Clean, responsive design with perfect alignment and spacing
- **Real-time Processing**: Instant analysis with live progress indicators

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI Backend**: Ollama with llama3 model
- **Video Processing**: FFmpeg (for future implementation)
- **Deployment**: Vercel-ready configuration

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- Ollama installed locally
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://share.google/6XaoY2Hjvb5VfjMJf
   cd truth-verifier-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install and setup Ollama**
   ```bash
   # Download Ollama from https://ollama.ai
   # Pull the required model
   ollama pull llama3
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Usage

1. **Paste URL**: Enter any social media reel URL (Instagram, TikTok, YouTube)
2. **Analyze**: Click "Verify Now" to start AI analysis
3. **Review**: Get comprehensive credibility report including:
   - Credibility score (0-100%)
   - Audio transcription
   - Visual analysis
   - AI conclusion
   - Fact-check results

## 🏗️ Project Structure

```
truth-verifier-ai/
├── src/
│   └── app/
│       ├── api/
│       │   └── verify-reel/
│       │       └── route.ts          # Main analysis API endpoint
│       ├── page.tsx                  # Main UI component
│       ├── layout.tsx                # Root layout
│       └── globals.css               # Global styles
├── public/                           # Static assets
├── package.json                      # Dependencies and scripts
├── tailwind.config.js               # Tailwind CSS configuration
├── next.config.js                   # Next.js configuration
└── README.md                        # This file
```

## 🔧 API Endpoints

### POST `/api/verify-reel`
Analyzes social media content for credibility.

**Request:**
```json
{
  "url": "https://instagram.com/reel/example"
}
```

**Response:**
```json
{
  "credibility": "Mixed Reliability",
  "score": 65,
  "transcription": "Audio transcript...",
  "visualAnalysis": "Visual content analysis...",
  "conclusion": "Comprehensive AI assessment...",
  "factCheckResults": []
}
```

## 🎨 UI Components

- **Main Interface**: Clean input form with URL validation
- **Results Dashboard**: Organized cards showing analysis results
- **Credibility Meter**: Visual progress bar with color-coded scores
- **Loading States**: Animated spinners and progress indicators
- **Error Handling**: User-friendly error messages

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repo to Vercel
   - Configure environment variables if needed
   - Deploy automatically

### Local Production Build

```bash
npm run build
npm start
```

## 🔮 Future Enhancements

- [ ] **Real video processing** with FFmpeg integration
- [ ] **Additional AI models** (Whisper for audio, LLaVA for images)
- [ ] **Multi-language support** for global accessibility
- [ ] **Browser extension** for one-click verification
- [ ] **Mobile app** version for iOS and Android
- [ ] **Historical analysis** with user accounts and history
- [ ] **API access** for third-party integrations

## 🐛 Troubleshooting

### Common Issues

1. **Ollama Connection Error**
   ```bash
   # Ensure Ollama is running
   ollama serve
   
   # Check available models
   ollama list
   ```

2. **Build Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Port Already in Use**
   ```bash
   # Use different port
   npm run dev -- -p 3001
   ```

### Performance Tips

- Use smaller models (llama3:8b) for faster analysis
- Implement client-side caching for repeated URLs
- Use CDN for static assets in production

## 🤝 Contributing

We welcome contributions! Please feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 👥 Team Hyphen

- **MD Zaid** 
- **Manjeet Kumar Kesri** 

## 🙏 Acknowledgments

- Ollama team for the amazing AI infrastructure
- Next.js team for the fantastic framework
- Tailwind CSS for the utility-first CSS framework
- Open source community for continuous inspiration



---

**Built with ❤️ by Team Hyphen - Making the internet more truthful.**
