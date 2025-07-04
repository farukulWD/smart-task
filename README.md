# Smart Task Manager with AI Assistance

A modern, responsive task management application built with Next.js 15+, React, and TypeScript. Features AI-powered subtask suggestions using the Google Gemini API.

## Features

- **Task Management**
  - Add, edit, and delete tasks
  - Task fields: Title, description, status (pending/completed), due date
  - Tasks are persisted in localStorage for demo purposes

- **AI-Powered Subtask Suggestions**
  - "Suggest Subtasks" button on each task
  - Uses Google Gemini API to break down a task into 3-5 actionable subtasks
  - Handles API errors and quota gracefully

- **Responsive Design**
  - Works seamlessly on both mobile and desktop devices

- **Clean, Simple UI**
  - Built with Radix UI, Tailwind CSS, and Framer Motion for smooth interactions

## Technologies Used

- [Next.js 15+ (App Router)](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Google Gemini API](https://aistudio.google.com/app/apikey)
- [Zod](https://zod.dev/) for schema validation
- [React Hook Form](https://react-hook-form.com/)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-task-manager.git
cd smart-task-manager
```

### 2. Install Dependencies

```bash
npm install
# or
yarn
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add your Gemini API key:

```
GEMINI_API_KEY=your-gemini-api-key-here
```

> See `.env.example` for the required variable.

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Add a Task:** Use the "Add Task" button. Fill in the title, description, due date, and status.
- **Edit/Delete a Task:** Use the edit (✏️) or delete (🗑️) icons on each task card.
- **Mark as Completed:** Click the status icon to toggle between pending and completed.
- **Suggest Subtasks:** Click the "Suggest Subtasks" (💡) button on a pending task. The app will use Gemini AI to suggest 3-5 actionable steps.

## Environment Variables

Create a `.env.local` file with the following:

```
GEMINI_API_KEY=your-gemini-api-key-here
```

## Error Handling

- If the Gemini API is overloaded or quota is exceeded, the app will show a user-friendly error message.
- If the API key is missing or invalid, the subtask suggestion feature will not work and an error will be displayed.

## Project Structure

```
src/
  app/
    api/suggest-subtasks/   # Next.js API route for Gemini integration
    ...
  components/
    task/                   # Task management and AI suggestion components
    ui/                     # UI primitives (button, card, etc.)
  hooks/                    # Custom React hooks
  lib/                      # Types and utility functions
```

## Challenges Faced

- **API Rate Limiting:** Gemini API may throttle or reject requests if quota is exceeded. Implemented retries and user feedback for these cases.
- **LocalStorage Persistence:** For demo simplicity, tasks are stored in localStorage. In production, a backend/database would be used.
- **Responsive UI:** Ensured all components work well on both mobile and desktop.

## How to Deploy

You can deploy this app to Vercel, Netlify, or any platform supporting Next.js 15+.

## License

MIT

---

**.env.example** (create this file in your project root):

```
GEMINI_API_KEY=your-gemini-api-key-here
```
