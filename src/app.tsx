import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/layout'
import { CarDetails } from './pages/car'
import { Dashboard } from './pages/dashboard'
import { New } from './pages/dashboard/new'
import { Home } from './pages/home'
import { Login } from './pages/login'
import { Register } from './pages/register'
import { Private } from './routes/private'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/car/:id', element: <CarDetails /> },
      {
        element: <Private />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/dashboard/new', element: <New /> },
        ],
      },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
])

export { router }
