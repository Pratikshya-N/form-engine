# Dynamic Form Engine

🚀 Live Demo: https://form-engine-orpin.vercel.app/

A dynamic form builder and renderer built with React and TypeScript. 
Users can create forms using a builder UI, preview them in real-time, 
and render forms dynamically with conditional fields and multi-step logic.

## ✨ Features

- Dynamic form builder (add/edit/delete fields)
- Multi-step form rendering
- Conditional fields (based on user input)
- Real-time form preview (Test Mode)
- Import / Export JSON schema
- Validation handling (required fields, errors)
- Disabled submit in test mode
- Responsive UI with scrollable layout

## 🛠 Tech Stack

- React
- TypeScript
- React Hook Form
- Vercel (Deployment)

## ⚙️ How It Works

1. Builder creates a schema (JSON structure of fields)
2. Schema is passed to the Form Renderer
3. Renderer dynamically generates UI
4. Conditional logic controls field visibility
5. Multi-step navigation handled via step-based schema

## 📁 Project Structure

- public/
  Contains static assets like the HTML template and any public files.
- src/
  Main application source code.
- components/
  Reusable UI components used across the application.
  Includes:
  1. FormRenderer – renders the dynamic form based on schema
  2. FieldRenderer – renders individual form fields
  3. StepProgress – shows step navigation UI
- builder/
  Handles the form builder functionality.
  Includes:
  1. FormBuilder – main builder container (edit/test modes, import/export, save)
  2. FieldEditor – UI for adding/editing individual fields
- hooks/
  Custom React hooks for managing logic.
  1. useFormEngine – core logic for form state, validation, submission, and schema handling
- context/
  Global state management using React Context.
  1. SnackbarContext – handles global messages/notifications
- styles/
  Centralized styling objects.
  1. formStyles – styles for form, builder, buttons, layout
- types/
  TypeScript type definitions.
  1. formTypes – defines the structure of fields and schema
- App.tsx
  Root component that switches between Form View and Builder View
- main.tsx
  Entry point of the React application
- package.json
  Project dependencies and scripts
- tsconfig.json
  TypeScript configuration
- README.md
  Project documentation

## 💻 Run Locally

- git clone <repo-url>
- cd form-engine
- npm install
- npm run dev
