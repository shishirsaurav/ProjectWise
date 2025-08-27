# ProjectWise

**Your AI-powered copilot for seamless project management**

ProjectWise is a modern, AI-driven project management application that helps teams track tasks, assess risks, and collaborate effectively. Built with Next.js and powered by Google's Gemini AI, it provides intelligent insights and automated project summaries to keep teams aligned and productive.

## 🚀 Features

### Core Functionality
- **Role-Based Dashboards**: Separate interfaces for Project Leads and Team Members
- **Task Management**: Create, update, and track tasks with priorities, dependencies, and completion status
- **AI-Powered Chatbot**: Natural language interface to query project data using Firebase integration
- **Risk Assessment**: AI-driven analysis to identify potential project risks and delays
- **Project Summaries**: Automated insights and recommendations for project leads
- **Team Updates**: Daily progress tracking and status updates

### AI Capabilities
- **Natural Language Queries**: Ask questions about project status, tasks, and team progress
- **Risk Analysis**: Automated identification of potential blockers and delays
- **Project Status Summarization**: AI-generated insights for better decision making
- **Firebase Data Integration**: Seamless querying of project data through conversational interface

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.3.3 with React 18
- **UI Framework**: Tailwind CSS with Radix UI components
- **AI Integration**: Google Genkit with Gemini 2.0 Flash model
- **Database**: Firebase (with mock data for development)
- **TypeScript**: Full type safety throughout the application
- **Styling**: Custom color scheme with Deep Indigo (#4B0082) primary and Teal (#008080) accent colors

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd AI-Task
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add your configuration:
   ```env
   # Add your Firebase and Google AI API keys here
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:9002`

## 🎯 Usage

### Getting Started
1. Navigate to the home page and select your role:
   - **Project Lead**: Access to full dashboard, risk assessment, and team overview
   - **Project Member**: Focus on assigned tasks and updates

### Project Lead Dashboard
- View project summaries and AI-generated insights
- Monitor team member progress and daily updates
- Assess project risks and potential blockers
- Access the AI chatbot for project queries
- Manage all project tasks and assignments

### Project Member Dashboard
- View assigned tasks and update progress
- Submit daily updates and status reports
- Access the AI chatbot for task-related queries

### AI Chatbot Features
- Ask natural language questions about project status
- Query specific task information and dependencies
- Get insights about team member progress
- Receive AI-generated recommendations

## 🏗️ Project Structure

```
src/
├── ai/                     # AI integration and flows
│   ├── flows/             # AI workflow implementations
│   ├── tools/             # AI tool definitions
│   └── genkit.ts          # Genkit configuration
├── app/                    # Next.js app router
│   ├── lead/              # Project lead pages
│   ├── member/            # Project member pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── [feature-components] # Feature-specific components
├── hooks/                 # Custom React hooks
└── lib/                   # Utility functions and types
```

## 🎨 Design System

### Colors
- **Primary**: Deep Indigo (#4B0082) - Professional and focused
- **Background**: Light Gray (#F0F0F0) - Clean and modern
- **Accent**: Teal (#008080) - Highlight key actions

### Typography
- **Body**: Inter - Clear readability for task details
- **Headlines**: Space Grotesk - Contemporary and professional
- **Code**: Source Code Pro - For Firebase queries in chatbot

## 🤖 AI Features

### Genkit Integration
The application uses Google's Genkit framework with the Gemini 2.0 Flash model to provide:

1. **Query Firebase Data**: Natural language interface to project database
2. **Risk Assessment**: Automated analysis of project risks and delays
3. **Project Status Summary**: AI-generated insights for project leads

### Available AI Flows
- `query-firebase-data`: Process natural language queries about project data
- `assess-project-risks`: Analyze tasks and identify potential issues
- `summarize-project-status`: Generate comprehensive project summaries

## 📊 Data Models

### Task
```typescript
interface Task {
  id: string;
  taskName: string;
  owner: string[] | null;
  priority: 'High' | 'Medium' | 'Low' | null;
  status: 'Completed' | 'In Progress' | 'On hold' | 'Not Started' | 'Terminated' | null;
  startDate: string | null;
  dueDate: string | null;
  percentComplete: number | null;
  dependsOn: string | null;
  blockers: string | null;
  nextSteps: string | null;
  notes: string | null;
}
```

### Team Member
```typescript
interface TeamMember {
  id: string;
  name: string;
  role: 'Project Lead' | 'Project Member';
  dailyUpdate?: DailyUpdate;
}
```

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit development server
- `npm run genkit:watch` - Start Genkit with file watching

### Development Tools
- **Turbopack**: Fast development builds
- **TypeScript**: Type safety and better development experience
- **ESLint**: Code quality and consistency
- **Tailwind CSS**: Utility-first styling

## 🚀 Deployment

The application is configured for deployment with:
- **Firebase App Hosting**: Using `apphosting.yaml` configuration
- **Vercel**: Next.js optimized deployment
- **Custom hosting**: Standard Node.js deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and ensure tests pass
4. Commit your changes: `git commit -m 'Add new feature'`
5. Push to the branch: `git push origin feature/new-feature`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For questions, issues, or feature requests, please open an issue on the GitHub repository.

---

**ProjectWise** - Empowering teams with AI-driven project management
