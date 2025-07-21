
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // ✅ Tailwind styles + custom CSS
import { GoogleOAuthProvider } from '@react-oauth/google'

// Update 1.0 Added Google Login in main.jsx

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
<React.StrictMode>
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
)
