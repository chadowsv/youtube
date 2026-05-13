import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Home from './pages/Home'
import PlayerPage from './pages/PlayerPage'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import CreateVideo from './pages/CreateVideo'
import type { Video } from './types'

export default function App() {
  const [vista, setVista] = useState('home')
  const [videoActual, setVideoActual] = useState<Video | null>(null)
  const [busqueda, setBusqueda] = useState('')

  const verVideo = (video: Video) => {
    setVideoActual(video)
    setVista('player')
  }

  return (
    <AuthProvider>
      {/* Header siempre visible excepto en login/registro */}
      {vista !== 'login' && vista !== 'registro' && (
        <div className="bg-mist-950 px-3 pt-3 sticky top-0 z-10 border-b border-mist-900">
          <Header busqueda={busqueda} onBusqueda={setBusqueda} setVista={setVista} />
        </div>
      )}

      {vista === 'home' && (
        <Home busqueda={busqueda} setVista={setVista} setVideoActual={verVideo} />
      )}
      {vista === 'player' && videoActual && (
        <PlayerPage video={videoActual} setVista={setVista} setVideoActual={verVideo} />
      )}
      {vista === 'login' && (
        <Auth modo="login" setVista={setVista} />
      )}
      {vista === 'registro' && (
        <Auth modo="registro" setVista={setVista} />
      )}
      {vista === 'perfil' && (
        <Profile setVista={setVista} setVideoActual={verVideo} />
      )}
      {vista === 'crear' && <CreateVideo setVista={setVista} />}
    </AuthProvider>
  )
}