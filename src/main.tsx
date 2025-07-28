import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { RouterProvider } from 'react-router-dom'
import { register } from 'swiper/element-bundle'
import 'swiper/swiper-bundle.css'
import { router } from './app.tsx'
import { AuthProvider } from './context/auth-context.tsx'
import './index.css'

register()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position='top-right' />
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
