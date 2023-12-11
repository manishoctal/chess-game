import './App.css'
import './assets/css/style.css'
import 'react-quill/dist/quill.snow.css'
import { BrowserRouter } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import { ToastContextProvider } from './context/ToastContext'
import CombineRoutes from 'routes/CombineRoutes'
import 'react-phone-input-2/lib/style.css'

function App () {
  return (
    <BrowserRouter>
      <ToastContextProvider>
        <AuthProvider>
          <CombineRoutes />
        </AuthProvider>
      </ToastContextProvider>
    </BrowserRouter>
  )
}

export default App
