import { createContext, useContext, useState, useEffect} from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'
import { getUserById } from '../services/api'

interface AuthContextType {
  usuario: User | null
  setUsuario: (u: User | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuarioState] = useState<User | null>(null)

  // Al montar, si hay sesión guardada, trae el perfil actualizado del backend
  useEffect(() => {
    const uid = localStorage.getItem('user_id')
    if (!uid) return
    getUserById(Number(uid))
      .then((data: User) => {
        if (data?.id) {
          // Guarda la foto que venga del backend (siempre fresca)
          localStorage.setItem('profile_picture_url', data.profile_picture_url || '')
          setUsuarioState(data)
        }
      })
      .catch(() => {
        // Si falla el endpoint, usa lo que hay en localStorage como fallback
        const username = localStorage.getItem('username')
        const profile_picture_url = localStorage.getItem('profile_picture_url') || undefined
        if (username) {
          setUsuarioState({ id: Number(uid), username, email: '', profile_picture_url })
        }
      })
  }, [])

  const setUsuario = (u: User | null) => {
    if (u) {
      localStorage.setItem('user_id', String(u.id))
      localStorage.setItem('username', u.username)
      localStorage.setItem('profile_picture_url', u.profile_picture_url || '')
    }
    setUsuarioState(u)
  }

  const logout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('username')
    localStorage.removeItem('profile_picture_url')
    setUsuarioState(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}