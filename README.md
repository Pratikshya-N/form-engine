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

- ## 🛠 Tech Stack
- 
- React
- TypeScript
- React Hook Form
- Vercel (Deployment)

- ## ⚙️ How It Works

1. Builder creates a schema (JSON structure of fields)
2. Schema is passed to the Form Renderer
3. Renderer dynamically generates UI
4. Conditional logic controls field visibility
5. Multi-step navigation handled via step-based schema
