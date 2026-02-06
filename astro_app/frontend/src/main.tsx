import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
const clientId = rawClientId && rawClientId !== 'YOUR_GOOGLE_CLIENT_ID_HERE' ? rawClientId : ''

const root = (
  <React.StrictMode>
    {clientId ? (
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>
)

ReactDOM.createRoot(document.getElementById('root')!).render(root)
