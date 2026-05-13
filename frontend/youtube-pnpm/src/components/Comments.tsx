import { useState, useEffect } from 'react'

const API = 'http://localhost:8000/api'

export default function Comments({ videoId, usuarioId }) {
  const [comments, setComments] = useState([])
  const [texto, setTexto] = useState('')

  useEffect(() => {
    fetch(`${API}/comments/video/${videoId}`)
      .then(r => r.json())
      .then(setComments)
  }, [videoId])

  const enviar = () => {
    if (!texto.trim() || !usuarioId) return
    fetch(`${API}/comments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: texto, video_id: videoId, user_id: usuarioId })
    })
      .then(r => r.json())
      .then(nuevo => {
        const conUsername = {
          ...nuevo,
          username: localStorage.getItem('username') || `Usuario ${usuarioId}`
        }
        setComments(prev => [conUsername, ...prev])
        setTexto('')
      })
  }

  const eliminar = (id) => {
    fetch(`${API}/comments/${id}`, { method: 'DELETE' })
      .then(() => setComments(prev => prev.filter(c => c.id !== id)))
  }

  return (
    <section className="flex flex-col gap-4 mt-2">
      <h2 className="text-white font-medium text-sm">{comments.length} comentarios</h2>

      {usuarioId ? (
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={texto}
            onChange={e => setTexto(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && enviar()}
            placeholder="Agrega un comentario..."
            className="flex-1 bg-transparent border-b border-mist-700 text-white text-sm
                       pb-1 focus:outline-none focus:border-white placeholder:text-mist-500"
          />
          <button onClick={enviar}
            className="text-sm px-3 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-500 flex-shrink-0">
            Enviar
          </button>
        </div>
      ) : (
        <p className="text-mist-500 text-sm">Inicia sesión para comentar</p>
      )}

      <div className="flex flex-col gap-3">
        {comments.map(c => (
          <article key={c.id} className="flex gap-3 group">
            <div className="w-8 h-8 rounded-full bg-mist-700 flex-shrink-0" />
            <div className="flex flex-col gap-0.5 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-white text-xs font-medium">{c.username || `Usuario ${c.user_id}`}</p>
                {c.user_id === usuarioId && (
                  <button onClick={() => eliminar(c.id)}
                    className="text-xs text-mist-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Eliminar
                  </button>
                )}
              </div>
              <p className="text-mist-300 text-sm">{c.content}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}