import { useState, useEffect } from 'react'
import type { Comment } from '../types'
import { useAuth } from '../context/AuthContext'
import { getCommentsByVideo, createComment, deleteComment, editComment } from '../services/api'

interface CommentsProps {
  videoId: number
}

export default function Comments({ videoId }: CommentsProps) {
  const { usuario } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [texto, setTexto] = useState('')
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [textoEdicion, setTextoEdicion] = useState('')

  useEffect(() => {
    getCommentsByVideo(videoId).then(setComments)
  }, [videoId])

  const enviar = () => {
    if (!texto.trim() || !usuario) return
    createComment({ content: texto, video_id: videoId, user_id: usuario.id })
      .then(nuevo => {
        setComments(prev => [{ ...nuevo, username: usuario.username }, ...prev])
        setTexto('')
      })
  }

  const eliminar = (id: number) => {
    deleteComment(id).then(() =>
      setComments(prev => prev.filter(c => c.id !== id))
    )
  }

  const guardarEdicion = (id: number) => {
    if (!textoEdicion.trim()) return
    editComment(id, textoEdicion).then(actualizado => {
      setComments(prev =>
        prev.map(c => (c.id === id ? { ...actualizado, username: c.username } : c))
      )
      setEditandoId(null)
      setTextoEdicion('')
    })
  }

  return (
    <section className="flex flex-col gap-4 mt-2">
      <h2 className="text-white font-medium text-sm">{comments.length} comentarios</h2>

      {usuario ? (
        <div className="flex gap-3 items-center">
          {/* Avatar del usuario que comenta */}
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            {usuario.profile_picture_url ? (
              <img
                src={usuario.profile_picture_url}
                alt={usuario.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {usuario.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <input
            type="text"
            value={texto}
            onChange={e => setTexto(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && enviar()}
            placeholder="Agrega un comentario..."
            className="flex-1 bg-transparent border-b border-mist-700 text-white text-sm
                       pb-1 focus:outline-none focus:border-white placeholder:text-mist-500"
          />
          <button
            onClick={enviar}
            className="text-sm px-3 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-500 flex-shrink-0"
          >
            Enviar
          </button>
        </div>
      ) : (
        <p className="text-mist-500 text-sm">Inicia sesión para comentar</p>
      )}

      <div className="flex flex-col gap-3">
        {comments.map(c => (
          <article key={c.id} className="flex gap-3 group">
            {/* Avatar del comentarista — placeholder genérico */}
            <div className="w-8 h-8 rounded-full bg-mist-700 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
              {c.username ? c.username.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="flex flex-col gap-0.5 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-white text-xs font-medium">
                  {c.username || `Usuario ${c.user_id}`}
                </p>
                {c.user_id === usuario?.id && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditandoId(c.id)
                        setTextoEdicion(c.content)
                      }}
                      className="text-xs text-mist-400 hover:text-blue-400"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminar(c.id)}
                      className="text-xs text-mist-400 hover:text-red-400"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>

              {editandoId === c.id ? (
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={textoEdicion}
                    onChange={e => setTextoEdicion(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && guardarEdicion(c.id)}
                    className="flex-1 bg-transparent border-b border-mist-600 text-white text-sm pb-1 focus:outline-none focus:border-white"
                  />
                  <button
                    onClick={() => guardarEdicion(c.id)}
                    className="text-xs px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-500"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditandoId(null)}
                    className="text-xs text-mist-400 hover:text-white px-2"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <p className="text-mist-300 text-sm">{c.content}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}