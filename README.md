# ScoreCheck

A production-grade web application for analyzing exam response sheets and generating detailed scorecards with subject-wise performance, accuracy metrics, and question-level diagnostics.

## Features

- **Zero-Authentication Flow**: No login, signup, or credentials required
- **Multi-Exam Support**: TG TET, NEET, JEE Main, EAMCET, SSC, RRB, and custom exams
- **Subject-wise Analysis**: Detailed breakdown by subject with accuracy metrics
- **Question Diagnostics**: Filter questions by status (correct/wrong/unattempted) and subject
- **PDF Generation**: Download high-resolution PDF scorecards
- **Print Support**: Optimized print layout for physical scorecards
- **Demo Mode**: Pre-loaded sample datasets for testing
- **SSRF Protection**: Robust security with private IP blocking and request validation
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## Tech Stack

### Backend
- Node.js + Express
- Cheerio (HTML parsing)
- Axios (HTTP client with SSRF protection)
- ipaddr.js (IP validation)

### Frontend
- React 19 + Vite
- Tailwind CSS (styling)
- Lucide React (icons)
- Recharts (data visualization)
- jsPDF + html2canvas (PDF generation)

## Project Structure

```
SCORECARD/
├── backend/
│   ├── configs/          # Exam configurations and marking schemes
│   ├── parsers/          # Exam-specific HTML parsers
│   ├── services/         # Business logic (fetch, scoring, analysis)
│   ├── utils/            # Security utilities and mock data
│   ├── routes/           # API endpoints
│   └── server.js         # Express server
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   └── App.jsx       # Main application
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

### Analyzing a Response Sheet

1. Open the application in your browser
2. Paste a publicly accessible response sheet URL
3. Select the exam type and paper (if applicable)
4. Configure marking scheme (optional - uses defaults based on exam)
5. Click "Analyze Score"
6. View the detailed scorecard with metrics and analysis

### Demo Mode

Click any of the demo buttons to test the application with pre-loaded sample data:
- TG TET Paper 1 Demo (150 questions)
- NEET Demo (180 questions)
- JEE Main Demo (75 questions)

## API Endpoints

### POST /api/analyze
Analyzes a response sheet from a URL.

**Request Body:**
```json
{
  "url": "https://example.com/response-sheet",
  "exam": "tg-tet",
  "paper": "paper1",
  "marksPerCorrect": 1,
  "negativeMarksPerWrong": 0,
  "marksPerUnanswered": 0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "examId": "tg-tet",
    "examName": "TG TET",
    "paper": "Paper 1",
    "candidateInfo": {
      "candidateName": "John Doe",
      "rollNumber": "123456",
      "examDate": "2024-05-20",
      "shift": "Shift 1"
    },
    "summary": {
      "totalQuestions": 150,
      "attempted": 148,
      "unattempted": 2,
      "correct": 118,
      "wrong": 30,
      "totalScore": 118,
      "maxScore": 150,
      "percentage": 78.67,
      "accuracy": 79.73,
      "performanceRating": "Good"
    },
    "subjects": [...],
    "questions": [...]
  }
}
```

### GET /api/demo/:examId
Returns demo data for a specific exam.

**Response:** Same format as /api/analyze with `isDemo: true`

### GET /api/exams
Returns list of supported exams and their papers.

## Security Features

- **SSRF Protection**: Blocks requests to localhost, private IPs, and cloud metadata endpoints
- **Request Timeout**: 10-second timeout for all external requests
- **Payload Size Limit**: Maximum 5MB response size
- **URL Validation**: Strict validation of redirect chains
- **No Authentication**: Eliminates credential-related security risks

## Supported Exams

| Exam | Papers | Questions | Marking Scheme |
|------|--------|------------|----------------|
| TG TET | Paper 1, Paper 2 (Maths/Science), Paper 2 (Social) | 150 | +1, 0, 0 |
| NEET UG | Default | 180 | +4, -1, 0 |
| JEE Main | Default | 75 | +4, -1, 0 |
| EAMCET | Engineering, Agriculture/Medical | 160 | +1, 0, 0 |
| SSC | CGL, CHSL | 100 | +2, -0.5, 0 |
| RRB | NTPC, Group D | 100 | +1, -0.33, 0 |
| Custom | User-defined | Variable | User-defined |

## Deployment

### Backend (Render)

1. Push code to GitHub
2. Create a new Web Service on Render
3. Connect your repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables from `.env.example`

### Frontend (Vercel)

1. Push code to GitHub
2. Import project on Vercel
3. Configure root directory as `frontend`
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Add environment variable for backend API URL

## Error Handling

The application provides clear user-friendly error messages for:
- Invalid/malformed URLs
- SSRF blocked addresses
- Protected/authenticated pages (401/403)
- Page not found (404)
- Rate limiting (429)
- Request timeouts
- Unsupported response sheet formats

## License

MIT

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.
