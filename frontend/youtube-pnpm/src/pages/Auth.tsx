import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { login, register, getUserById } from '../services/api'

const FOTOS_REGISTRO = [
  { url: 'https://aws-youtube-lis-contenidos.s3.us-west-1.amazonaws.com/perfil/Wi3.jpg', label: 'Default' },
  { url: 'https://aws-youtube-lis-contenidos.s3.us-west-1.amazonaws.com/perfil/Wi1.jpg', label: 'Chico' },
  { url: 'https://aws-youtube-lis-contenidos.s3.us-west-1.amazonaws.com/perfil/Wi2.jpg', label: 'Chica' },
]

interface AuthProps {
  modo: 'login' | 'registro'
  setVista: (v: string) => void
}

export default function Auth({ modo, setVista }: AuthProps) {
  const { setUsuario } = useAuth()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    profile_picture_url: FOTOS_REGISTRO[0].url,
  })
  const [error, setError] = useState('')

  // pages/Auth.tsx — reemplaza todo el handleLogin
    const handleLogin = () => {
    setError('')
    login(form.email, form.password).then(data => {
        if (data.user_id) {
        // Trae el perfil completo desde la BD para obtener la foto real
        getUserById(data.user_id).then(perfil => {
            setUsuario({
            id: perfil.id,
            username: perfil.username,
            email: perfil.email,
            profile_picture_url: perfil.profile_picture_url,
            })
            setVista('home')
        })
        } else {
        setError('Credenciales incorrectas')
        }
    })
    }

  const handleRegistro = () => {
    setError('')
    register(form).then(data => {
      if (data.id) {
        setVista('login')
        setForm({ username: '', email: '', password: '', profile_picture_url: FOTOS_REGISTRO[0].url })
      } else {
        setError(data.detail || 'Error al registrarse')
      }
    })
  }

  if (modo === 'login') return (
    <main className="min-h-screen bg-mist-950 flex items-center justify-center px-4">
      <section className="w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-white text-2xl font-bold text-center">Iniciar sesión</h1>
        <input
          type="email"
          placeholder="Correo"
          value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          className="bg-mist-900 border border-mist-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          className="bg-mist-900 border border-mist-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none"
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-sm font-medium"
        >
          Entrar
        </button>
        <button
          onClick={() => setVista('registro')}
          className="text-mist-400 text-sm text-center hover:text-white"
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </section>
    </main>
  )

  return (
    <main className="min-h-screen bg-mist-950 flex items-center justify-center px-4">
      <section className="w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-white text-2xl font-bold text-center">Crear cuenta</h1>

        {/* Selector de foto */}
        <div className="flex flex-col gap-2">
          <p className="text-mist-400 text-xs">Elige tu foto de perfil</p>
          <div className="flex gap-3 justify-center">
            {FOTOS_REGISTRO.map(foto => (
              <button
                key={foto.url}
                onClick={() => setForm(p => ({ ...p, profile_picture_url: foto.url }))}
                className={`rounded-full overflow-hidden w-16 h-16 border-2 transition-all
                  ${form.profile_picture_url === foto.url
                    ? 'border-blue-500 scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={foto.url} alt={foto.label} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          placeholder="Nombre de usuario"
          value={form.username}
          onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
          className="bg-mist-900 border border-mist-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none"
        />
        <input
          type="email"
          placeholder="Correo"
          value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          className="bg-mist-900 border border-mist-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          className="bg-mist-900 border border-mist-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none"
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          onClick={handleRegistro}
          className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-sm font-medium"
        >
          Crear cuenta
        </button>
        <button
          onClick={() => setVista('login')}
          className="text-mist-400 text-sm text-center hover:text-white"
        >
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </section>
    </main>
  )
}