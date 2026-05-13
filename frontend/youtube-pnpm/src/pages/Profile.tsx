import { useState, useEffect } from 'react'
import type { Video } from '../types'
import { useAuth } from '../context/AuthContext'
import { getVideosByUser, deleteVideo, updateThumbnail } from '../services/api'

const DEFAULT_THUMBNAIL = 'https://aws-youtube-lis-contenidos.s3.us-west-1.amazonaws.com/miniaturas/default.jpg'

interface ProfileProps {
  setVista: (v: string) => void
  setVideoActual: (v: Video) => void
}

export default function Profile({ setVista, setVideoActual }: ProfileProps) {
  const { usuario, logout } = useAuth()
  const [misVideos, setMisVideos] = useState<Video[]>([])
  const [editandoThumbnail, setEditandoThumbnail] = useState<number | null>(null)
  const [nuevoThumbnail, setNuevoThumbnail] = useState('')

  useEffect(() => {
    if (!usuario) return
    getVideosByUser(usuario.id).then(setMisVideos)
  }, [usuario])

  const handleEliminar = (videoId: number) => {
    if (!confirm('¿Eliminar este video?')) return
    deleteVideo(videoId).then(() =>
      setMisVideos(prev => prev.filter(v => v.id !== videoId))
    )
  }

  const handleActualizarThumbnail = (videoId: number) => {
    updateThumbnail(videoId, nuevoThumbnail).then(actualizado => {
      setMisVideos(prev => prev.map(v => (v.id === videoId ? actualizado : v)))
      setEditandoThumbnail(null)
    })
  }

  if (!usuario) return null

  return (
    <main className="min-h-screen bg-mist-950 px-4 py-4">
      <section className="max-w-7xl mx-auto mt-6 flex flex-col gap-6">

        {/* Cabecera del perfil */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              {usuario.profile_picture_url ? (
                <img
                  src={usuario.profile_picture_url}
                  alt={usuario.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {usuario.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-white font-semibold text-lg">{usuario.username}</p>
              <p className="text-mist-400 text-sm">{misVideos.length} videos</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); setVista('home') }}
            className="text-red-400 border border-red-800 px-4 py-1.5 rounded-full text-sm hover:bg-red-900"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Grid de mis videos */}
        <h2 className="text-white font-medium">Mis videos</h2>
        {misVideos.length === 0 ? (
          <p className="text-mist-500 text-sm">No has subido videos aún</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {misVideos.map(video => (
              <article key={video.id} className="flex flex-col gap-2">
                <div
                  onClick={() => { setVideoActual(video); setVista('player') }}
                  className="aspect-video rounded-xl overflow-hidden bg-mist-800 cursor-pointer group"
                >
                  <img
                    src={video.thumbnail_url || DEFAULT_THUMBNAIL}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => (e.currentTarget.src = DEFAULT_THUMBNAIL)}
                  />
                </div>
                <p className="text-white text-sm font-medium line-clamp-2">{video.title}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditandoThumbnail(video.id); setNuevoThumbnail(video.thumbnail_url || '') }}
                    className="flex-1 text-xs text-mist-400 border border-mist-700 rounded-lg py-1.5 hover:bg-mist-800"
                  >
                    Cambiar miniatura
                  </button>
                  <button
                    onClick={() => handleEliminar(video.id)}
                    className="text-xs text-red-400 border border-red-800 rounded-lg px-3 py-1.5 hover:bg-red-900"
                  >
                    Eliminar
                  </button>
                </div>
                {editandoThumbnail === video.id && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={nuevoThumbnail}
                      onChange={e => setNuevoThumbnail(e.target.value)}
                      placeholder="Nueva URL de miniatura"
                      className="flex-1 bg-mist-900 border border-mist-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none"
                    />
                    <button
                      onClick={() => handleActualizarThumbnail(video.id)}
                      className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditandoThumbnail(null)}
                      className="text-xs text-mist-400 hover:text-white px-2"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}