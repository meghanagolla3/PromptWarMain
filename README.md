# HabitMind AI

An AI-powered behavior change coach that helps users break bad habits and build healthier routines through intelligent analysis, risk prediction, and personalized coaching.

## 🎯 Features

- **Intelligent Behavior Analysis**: AI understands your behavioral patterns, emotional triggers, and habit loops
- **Risk Prediction**: Predicts high-risk moments before they happen, allowing you to prepare and stay in control
- **Adaptive Coaching**: Personalized interventions that adapt to your current state, mood, and environment
- **Progress Tracking**: Visual dashboards showing your streaks, mood trends, and habit frequency over time
- **AI Insights**: Discovers patterns you might miss - like how stress affects your habits or time-based triggers
- **Smart Nudges**: Timely, personalized reminders based on your historical data and current situation

## 🚀 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Forms & Validation**: React Hook Form, Zod
- **AI**: Google Gemini 2.5 Flash with structured JSON outputs
- **Icons**: Lucide React
- **State Management**: Local Storage for data persistence

## 📋 Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd habitmind-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Add your Google Gemini API key to `.env.local`:
```
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

## 🏃 Running the Application

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Application Flow

1. **Landing Page**: Introduction to HabitMind AI with features and CTA
2. **Onboarding**: Collect user profile (name, habit, goal, coaching style)
3. **Daily Check-in**: Mood, stress, triggers, location, and reflection
4. **AI Analysis**: Behavior analysis, risk prediction, and coaching generation
5. **Dashboard**: Progress tracking, achievements, and AI insights
6. **Reflection**: End-of-day reflection on goal completion

## 🧠 AI Reasoning Pipeline

The application uses a multi-step AI reasoning process:

1. **Behavior Analysis**: Analyzes emotional state, triggers, and patterns
2. **Risk Prediction**: Predicts likelihood of habit engagement based on current state
3. **Coaching Generation**: Creates personalized interventions and micro-goals
4. **Insight Generation**: Identifies patterns across multiple check-ins
5. **Reflection Summary**: Generates daily reflection summaries

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   ├── onboarding/        # Onboarding flow
│   ├── checkin/           # Daily check-in
│   └── dashboard/         # Progress dashboard
├── components/            # React components
│   ├── Landing/           # Landing page components
│   ├── Onboarding/        # Onboarding form components
│   ├── CheckIn/           # Check-in form components
│   ├── RiskCard/          # Risk prediction display
│   ├── CoachCard/         # Coaching plan display
│   ├── Dashboard/         # Dashboard components
│   └── Reflection/        # Reflection form
├── services/              # AI services
│   └── gemini/           # Gemini API integration
├── prompts/              # AI prompt templates
├── types/                # TypeScript types
├── utils/                # Utility functions
├── constants/            # Application constants
└── hooks/                # Custom React hooks
```

## 🔒 Security

- API keys are stored in environment variables
- All inputs are validated before processing
- Data is stored locally in the browser (no server storage)
- Rate limiting on AI endpoints

## 🧪 Testing

The application includes edge case handling for:
- Empty onboarding data
- Invalid habit selections
- Missing mood inputs
- API timeouts
- Gemini failures
- Large reflection text
- Keyboard-only navigation
- Mobile responsiveness

## 📝 License

This project is created for the AI hackathon challenge.

## 🤝 Contributing

This is a hackathon project. Feel free to fork and modify for your own use.
