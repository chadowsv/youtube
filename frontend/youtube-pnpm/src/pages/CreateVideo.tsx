import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { createVideo, getCategories } from '../services/api'
import type { Category } from '../types'

interface CreateVideoProps {
  setVista: (v: string) => void
}

export default function CreateVideo({ setVista }: CreateVideoProps) {
  const { usuario } = useAuth()
  const [categorias, setCategorias] = useState<Category[]>([])
  const [formVideo, setFormVideo] = useState({
    title: '', description: '', video_url: '', thumbnail_url: '', category_id: 0,
  })

  useEffect(() => {
    getCategories().then(setCategorias)
  }, [])

  const handleCrear = () => {
    if (!formVideo.title || !formVideo.video_url || !formVideo.category_id || !usuario) return
    createVideo({ ...formVideo, owner_id: usuario.id }).then(() => {
      setVista('home')
    })
  }

  return (
    <main className="min-h-screen bg-mist-950 px-4 pt-4">
        <section className="max-w-xl mx-auto flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setVista('home')} className="text-mist-400 hover:text-white text-sm">
            ← Volver
          </button>
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
        <button onClick={handleCrear}
          className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-sm font-medium">
          Subir video
        </button>
      </section>
    </main>
  )
}