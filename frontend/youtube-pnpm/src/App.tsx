import { useState, useEffect } from 'react'
import Header from './components/Header'
import Player from './components/Player'
import Sidebar from './components/Sidebar'
import Comments from './components/Comments'

const API = 'http://localhost:8000/api'

export const FOTOS_PERFIL = [
  { url: 'https://aws-youtube-lis-contenidos.s3.us-west-1.amazonaws.com/perfil/Wi3.jpg', label: 'Default' },
  { url: 'https://aws-youtube-lis-contenidos.s3.us-west-1.amazonaws.com/perfil/Wi1.jpg', label: 'Chico' },
  { url: 'https://aws-youtube-lis-contenidos.s3.us-west-1.amazonaws.com/perfil/Wi2.jpg', label: 'Chica' },
]

const DEFAULT_THUMBNAIL = 'https://aws-youtube-lis-contenidos.s3.us-west-1.amazonaws.com/miniaturas/default.jpg'

export default function App() {
  const [videos, setVideos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [recomendaciones, setRecomendaciones] = useState([])
  const [videoActual, setVideoActual] = useState(null)
  const [categoriaFiltro, setCategoriaFiltro] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [vista, setVista] = useState('home')
  const [usuario, setUsuario] = useState(null)
  const [misVideos, setMisVideos] = useState([])
  const [formAuth, setFormAuth] = useState({
    username: '', email: '', password: '',
    profile_picture_url: FOTOS_PERFIL[0].url
  })
  const [formVideo, setFormVideo] = useState({
    title: '', description: '', video_url: '', thumbnail_url: '', category_id: 0
  })
  const [errorAuth, setErrorAuth] = useState('')

  useEffect(() => {
    fetch(`${API}/videos/`)
      .then(r => r.json())
      .then(setVideos)

    fetch(`${API}/categories/`)
      .then(r => r.json())
      .then(setCategorias)

    const uid = localStorage.getItem('user_id')
    const uname = localStorage.getItem('username')
    const uphoto = localStorage.getItem('profile_picture_url')
    if (uid && uname) setUsuario({
      id: uid,
      username: uname,
      profile_picture_url: uphoto || FOTOS_PERFIL[0].url
    })
  }, [])

  useEffect(() => {
    if (!videoActual) return
    fetch(`${API}/videos/category/${videoActual.category_id}`)
      .then(r => r.json())
      .then(data => {
        const otros = data.filter(v => v.id !== videoActual.id)
        const aleatorios = otros.sort(() => Math.random() - 0.5).slice(0, 10)
        setRecomendaciones(aleatorios)
      })
  }, [videoActual])

  useEffect(() => {
    if (vista === 'perfil' && usuario) {
      fetch(`${API}/videos/user/${usuario.id}`)
        .then(r => r.json())
        .then(setMisVideos)
    }
  }, [vista, usuario])

  const verVideo = (video) => {
    setVideoActual(video)
    setVista('player')
  }

  const handleLogin = () => {
    setErrorAuth('')
    fetch(`${API}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formAuth.email, password: formAuth.password })
    })
      .then(r => r.json())
      .then(data => {
        if (data.user_id) {
          localStorage.setItem('user_id', data.user_id)
          localStorage.setItem('username', data.username)
          localStorage.setItem('profile_picture_url', data.profile_picture_url || FOTOS_PERFIL[0].url)
          setUsuario({
            id: data.user_id,
            username: data.username,
            profile_picture_url: data.profile_picture_url || FOTOS_PERFIL[0].url
          })
          setVista('home')
        } else {
          setErrorAuth('Credenciales incorrectas')
        }
      })
  }

  const handleRegistro = () => {
    setErrorAuth('')
    fetch(`${API}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formAuth)
    })
      .then(r => r.json())
      .then(data => {
        if (data.id) {
          setVista('login')
          setFormAuth({ username: '', email: '', password: '', profile_picture_url: FOTOS_PERFIL[0].url })
        } else {
          setErrorAuth('Error al registrarse')
        }
      })
  }

  const handleLogout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('username')
    localStorage.removeItem('profile_picture_url')
    setUsuario(null)
    setVista('home')
  }

  const handleCrearVideo = () => {
    if (!formVideo.title || !formVideo.video_url || !formVideo.category_id) return
    fetch(`${API}/videos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formVideo, owner_id: Number(usuario.id) })
    })
      .then(r => r.json())
      .then(nuevo => {
        setVideos(prev => [nuevo, ...prev])
        setFormVideo({ title: '', description: '', video_url: '', thumbnail_url: '', category_id: 0 })
        setVista('home')
      })
  }

  const videosFiltrados = videos.filter(v => {
    const porCategoria = categoriaFiltro ? v.category_id === categoriaFiltro : true
    const porBusqueda = busqueda.trim()
      ? v.title.toLowerCase().includes(busqueda.toLowerCase())
      : true
    return porCategoria && porBusqueda
  })

  // LOGIN
  if (vista === 'login') return (
    <main className="min-h-screen bg-mist-950 flex items-center justify-center px-4">
      <section className="w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-white text-2xl font-bold text-center">Iniciar sesión</h1>
        <input type="email" placeholder="Correo"
          value={formAuth.email}
          onChange={e => setFormAuth(p => ({ ...p, email: e.target.value }))}
          className="bg-mist-900 border border-mist-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none"
        />
        <input type="password" placeholder="Contraseña"
          value={formAuth.password}
          onChange={e => setFormAuth(p => ({ ...p, password: e.target.value }))}
          className="bg-mist-900 border border-mist-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none"
        />
        {errorAuth && <p className="text-red-400 text-xs">{errorAuth}</p>}
        <button onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-sm font-medium">
          Entrar
        </button>
        <button onClick={() => setVista('registro')}
          className="text-mist-400 text-sm text-center hover:text-white">
          ¿No tienes cuenta? Regístrate
        </button>
      </section>
    </main>
  )

  // REGISTRO
  if (vista === 'registro') return (
    <main className="min-h-screen bg-mist-950 flex items-center justify-center px-4">
      <section className="w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-white text-2xl font-bold text-center">Crear cuenta</h1>

        <div className="flex flex-col gap-2">
          <p className="text-mist-400 text-xs">Elige tu foto de perfil</p>
          <div className="flex gap-3 justify-center">
            {FOTOS_PERFIL.map(foto => (
              <button
                key={foto.url}
                onClick={() => setFormAuth(p => ({ ...p, profile_picture_url: foto.url }))}
                className={`rounded-full overflow-hidden w-16 h-16 border-2 transition-all
                  ${formAuth.profile_picture_url === foto.url
                    ? 'border-blue-500 scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={foto.url} alt={foto.label} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <input type="text" placeholder="Nombre de usuario"
          value={formAuth.username}
          onChange={e => setFormAuth(p => ({ ...p, username: e.target.value }))}
          className="bg-mist-900 border border-mist-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none"
        />
        <input type="email" placeholder="Correo"
          value={formAuth.email}
          onChange={e => setFormAuth(p => ({ ...p, email: e.target.value }))}
          className="bg-mist-900 border border-mist-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none"
        />
        <input type="password" placeholder="Contraseña"
          value={formAuth.password}
          onChange={e => setFormAuth(p => ({ ...p, password: e.target.value }))}
          className="bg-mist-900 border border-mist-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none"
        />
        {errorAuth && <p className="text-red-400 text-xs">{errorAuth}</p>}
        <button onClick={handleRegistro}
          className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-sm font-medium">
          Crear cuenta
        </button>
        <button onClick={() => setVista('login')}
          className="text-mist-400 text-sm text-center hover:text-white">
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </section>
    </main>
  )

  // PERFIL
  if (vista === 'perfil') return (
    <main className="min-h-screen bg-mist-950 px-4 py-4">
      <Header
        usuario={usuario}
        onLogin={() => setVista('login')}
        onPerfil={() => setVista('perfil')}
        onCrear={() => setVista('crear')}
        onHome={() => setVista('home')}
        busqueda={busqueda}
        onBusqueda={setBusqueda}
      />
      <section className="max-w-7xl mx-auto mt-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={usuario?.profile_picture_url || FOTOS_PERFIL[0].url}
              alt={usuario?.username}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="text-white font-semibold text-lg">{usuario?.username}</p>
              <p className="text-mist-400 text-sm">{misVideos.length} videos</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="text-red-400 border border-red-800 px-4 py-1.5 rounded-full text-sm hover:bg-red-900">
            Cerrar sesión
          </button>
        </div>

        <h2 className="text-white font-medium">Mis videos</h2>
        {misVideos.length === 0 ? (
          <p className="text-mist-500 text-sm">No has subido videos aún</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {misVideos.map(video => (
              <article key={video.id} onClick={() => verVideo(video)}
                className="cursor-pointer group">
                <div className="aspect-video rounded-xl overflow-hidden bg-mist-800">
                  <img
                    src={video.thumbnail_url || DEFAULT_THUMBNAIL}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => e.currentTarget.src = DEFAULT_THUMBNAIL}
                  />
                </div>
                <p className="text-white text-sm font-medium mt-2 line-clamp-2">{video.title}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )

  // CREAR VIDEO
  if (vista === 'crear') return (
    <main className="min-h-screen bg-mist-950 px-4 py-4">
      <Header
        usuario={usuario}
        onLogin={() => setVista('login')}
        onPerfil={() => setVista('perfil')}
        onCrear={() => setVista('crear')}
        onHome={() => setVista('home')}
        busqueda={busqueda}
        onBusqueda={setBusqueda}
      />
      <section className="max-w-xl mx-auto mt-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setVista('home')}
            className="text-mist-400 hover:text-white text-sm">← Volver</button>
          <h1 className="text-white font-semibold text-lg">Subir video</h1>
        </div>
        <input type="text" placeholder="Título *"
          value={formVideo.title}
          onChange={e => setFormVideo(p => ({ ...p, title: e.target.value }))}
          className="bg-mist-900 border border-mist-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none"
        />
        <textarea placeholder="Descripción"
          value={formVideo.description}
          onChange={e => setFormVideo(p => ({ ...p, description: e.target.value }))}
          rows={3}
          className="bg-mist-900 border border-mist-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none resize-none"
        />
        <input type="text" placeholder="URL del video *"
          value={formVideo.video_url}
          onChange={e => setFormVideo(p => ({ ...p, video_url: e.target.value }))}
          className="bg-mist-900 border border-mist-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none"
        />
        <input type="text" placeholder="URL de miniatura"
          value={formVideo.thumbnail_url}
          onChange={e => setFormVideo(p => ({ ...p, thumbnail_url: e.target.value }))}
          className="bg-mist-900 border border-mist-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none"
        />
        <select
          value={formVideo.category_id}
          onChange={e => setFormVideo(p => ({ ...p, category_id: Number(e.target.value) }))}
          className="bg-mist-900 border border-mist-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none"
        >
          <option value={0} disabled>Selecciona categoría *</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.title}</option>
          ))}
        </select>
        <button onClick={handleCrearVideo}
          className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-sm font-medium">
          Subir video
        </button>
      </section>
    </main>
  )

  // PLAYER
  if (vista === 'player' && videoActual) return (
    <main className="min-h-screen bg-mist-950 px-3 py-3">
      <Header
        usuario={usuario}
        onLogin={() => setVista('login')}
        onPerfil={() => setVista('perfil')}
        onCrear={() => setVista('crear')}
        onHome={() => setVista('home')}
        busqueda={busqueda}
        onBusqueda={setBusqueda}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4 mt-4 max-w-[1400px] mx-auto">
        <section className="flex flex-col gap-4 min-w-0">
          <button onClick={() => setVista('home')}
            className="text-mist-400 text-xs hover:text-white w-fit">
            ← Volver
          </button>
          <Player video={videoActual} />
          <Comments
            videoId={videoActual.id}
            usuarioId={usuario ? Number(usuario.id) : null}
          />
        </section>
        <aside>
          <h2 className="text-white font-medium text-sm mb-3">Más videos</h2>
          <Sidebar videos={recomendaciones} onSelect={verVideo} />
        </aside>
      </div>
    </main>
  )

  // HOME
  return (
    <main className="min-h-screen bg-mist-950 px-3 py-3">
      <Header
        usuario={usuario}
        onLogin={() => setVista('login')}
        onPerfil={() => setVista('perfil')}
        onCrear={() => setVista('crear')}
        onHome={() => setVista('home')}
        busqueda={busqueda}
        onBusqueda={setBusqueda}
      />

      <div className="flex gap-2 overflow-x-auto pb-3 mt-3 -mx-3 px-3">
        <button
          onClick={() => setCategoriaFiltro(null)}
          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap flex-shrink-0 transition-colors
            ${!categoriaFiltro ? 'bg-white text-black font-medium' : 'bg-mist-800 text-white hover:bg-mist-700'}`}
        >
          Todos
        </button>
        {categorias.map(cat => (
          <button key={cat.id}
            onClick={() => setCategoriaFiltro(cat.id)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap flex-shrink-0 transition-colors
              ${categoriaFiltro === cat.id ? 'bg-white text-black font-medium' : 'bg-mist-800 text-white hover:bg-mist-700'}`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-2">
        {videosFiltrados.length === 0 ? (
          <p className="text-mist-500 text-sm col-span-4 text-center mt-10">
            No hay videos
          </p>
        ) : (
          videosFiltrados.map(video => (
            <article key={video.id} onClick={() => verVideo(video)}
              className="cursor-pointer group">
              <div className="aspect-video rounded-xl overflow-hidden bg-mist-800">
                <img
                  src={video.thumbnail_url || DEFAULT_THUMBNAIL}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => e.currentTarget.src = DEFAULT_THUMBNAIL}
                />
              </div>
              <div className="flex gap-2 mt-2 px-1">
                <div className="w-8 h-8 rounded-full bg-mist-700 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-medium line-clamp-2 leading-snug">
                    {video.title}
                  </p>
                  <p className="text-mist-400 text-xs mt-0.5">
                    {new Date(video.created_at).toLocaleDateString('es-EC', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  )
}