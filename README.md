# DISCERN - AI-Powered Credibility Analyzer

![DISCERN Logo](https://img.shields.io/badge/DISCERN-Credibility%20Analyzer-blue)
![Built with Claude](https://img.shields.io/badge/AI-Claude%204.6%20Sonnet-purple)
![License](https://img.shields.io/badge/license-MIT-green)

**Know What to Trust** - AI-powered credibility scoring for online articles, news, and documents.

Built for the Presidential AI Challenge to combat misinformation with transparent, explainable AI analysis.

## ✨ Features

- 🔍 **Multi-Input Analysis**: Analyze URLs, pasted text, or PDF documents
- 🎯 **AI-Powered Scoring**: Claude 4.6 Sonnet evaluates content across 4 key factors
- ⚖️ **Neutrality Detection**: Identifies bias, emotional manipulation, and loaded terminology
- 🏛️ **Source Reputation**: Evaluates domain authority and institutional credibility
- 📚 **Evidence Quality**: Assesses citations, data sources, and expert references
- 🧠 **Logical Consistency**: Checks for contradictions and reasoning soundness
- 📊 **Citation Verification**: Auto-generates supporting/contradicting sources
- ⚡ **Real-Time Results**: Instant credibility scores with detailed breakdowns
- 📈 **Analytics Dashboard**: Track trends and analyze patterns (admin only)
- 🔐 **Ethical AI**: Transparent, acknowledges limitations and uncertainty

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Anthropic API key (Claude access)

### Local Development

1. **Clone the repository**:
```bash
git clone https://github.com/YOUR_USERNAME/discern.git
cd discern
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up database**:
```bash
# Create PostgreSQL database
createdb discern

# Run migrations
cd backend
npx prisma migrate dev
npx prisma db seed
```

4. **Configure environment variables**:

Create `backend/.env`:
```env
DATABASE_URL="postgresql://user@localhost:5432/discern"
ANTHROPIC_API_KEY="your-api-key-here"
PORT=3001
FRONTEND_URL="http://localhost:3000"
ADMIN_PASSWORD="admin123"
JWT_SECRET="dev-secret"
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

5. **Start development servers**:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Open the app**: http://localhost:3000

## 📖 How It Works

### Credibility Scoring (0-100 scale)

DISCERN evaluates content across **4 factors** (each worth 0-25 points):

1. **Neutrality** (0-25):
   - 25 = Neutral, fact-based language
   - 0 = Extreme bias, propaganda techniques

2. **Source Reputation** (0-25):
   - 25 = Peer-reviewed journals, established institutions
   - 0 = Unknown sources, no credentials

3. **Evidence Quality** (0-25):
   - 25 = Multiple high-quality sources with data
   - 0 = No sources, anecdotal only

4. **Logical Consistency** (0-25):
   - 25 = Sound reasoning, no contradictions
   - 0 = Major contradictions, poor reasoning

**Final Score** = Sum of all 4 factors (0-100)

### Confidence Levels

- **High**: Factors are consistent, clear evidence
- **Medium**: Mixed signals, some uncertainty
- **Low**: Conflicting indicators, limited data

## 🏗️ Technology Stack

### Frontend
- **Next.js 14** (React framework)
- **TypeScript** (type safety)
- **Tailwind CSS** (styling)
- **Framer Motion** (animations)
- **Recharts** (analytics charts)

### Backend
- **Node.js + Express** (API server)
- **TypeScript** (type safety)
- **PostgreSQL** (database)
- **Prisma** (ORM)
- **Anthropic Claude 4.6 Sonnet** (AI analysis)

### Infrastructure
- **Railway / Vercel** (hosting)
- **GitHub** (version control)

## 📊 Cost Per Analysis

Using Claude Sonnet 4.6:
- ~$0.02-0.03 per article
- With $20 in API credits: ~650-750 articles

## 🔒 Security & Privacy

- No personal data collection
- API keys stored securely in environment variables
- Admin dashboard password-protected
- Content analysis only - no tracking or profiling

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Railway or Vercel.

## 📝 API Endpoints

### Public Endpoints

- `POST /api/analyze` - Analyze content
- `GET /api/health` - Health check

### Admin Endpoints (require authentication)

- `POST /api/admin/login` - Admin login
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/stats` - Get quick stats
- `GET /api/admin/export` - Export CSV

## 🤝 Contributing

This project was created for the Presidential AI Challenge. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⚠️ Disclaimer

DISCERN provides **AI-assisted credibility analysis**, not absolute truth. Scores are based on algorithmic assessment and should be used as one tool among many. Always:

- Verify important information from multiple sources
- Consider context and nuance beyond algorithmic scoring
- Use critical thinking alongside AI assistance
- Consult experts for specialized or critical decisions

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

## 🙏 Acknowledgments

- Built with [Claude 4.6 Sonnet](https://www.anthropic.com/claude) by Anthropic
- Created for the Presidential AI Challenge
- Inspired by the fight against misinformation

---

**Made with ❤️ and AI for a more informed world**
