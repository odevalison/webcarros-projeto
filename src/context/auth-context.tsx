import { type ReactNode, createContext, useEffect, useState } from 'react'
import supabase from '../services/supabase'

interface AuthProviderProps {
  children: ReactNode
}

interface UserProps {
  id: string
  name: string
  email: string
}

type AuthContextData = {
  user: UserProps | null
  isSigned: boolean
  loadingAuth: boolean
  handleInfoUser: ({ name, email, id }: UserProps) => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null)
        setLoadingAuth(false)
      } else {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.display_name,
          email: session.user.email as string,
        })

        setLoadingAuth(false)
      }
    })

    return () => data.subscription.unsubscribe()
  }, [])

  const handleInfoUser = ({ name, email, id }: UserProps) => {
    setUser({ name, email, id })
  }

  return (
    <AuthContext.Provider
      value={{ user, isSigned: !!user, loadingAuth, handleInfoUser }}
    >
      <>{children}</>
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
