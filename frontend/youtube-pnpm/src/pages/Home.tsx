import { useState, useEffect } from 'react'
import VideoCard from '../components/VideoCard'
import type { Video, Category } from '../types'
import { getVideos, getCategories } from '../services/api'

interface HomeProps {
  busqueda: string
  setVista: (v: string) => void
  setVideoActual: (v: Video) => void
}

export default function Home({ busqueda, setVista, setVideoActual }: HomeProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [categorias, setCategorias] = useState<Category[]>([])
  const [categoriaFiltro, setCategoriaFiltro] = useState<number | null>(null)

  useEffect(() => {
    getVideos().then(setVideos)
    getCategories().then(setCategorias)
  }, [])

  const verVideo = (video: Video) => {
    setVideoActual(video)
    setVista('player')
  }

  const videosFiltrados = videos.filter(v => {
    const porCategoria = categoriaFiltro ? v.category_id === categoriaFiltro : true
    const porBusqueda = busqueda.trim()
      ? v.title.toLowerCase().includes(busqueda.toLowerCase())
      : true
    return porCategoria && porBusqueda
  })

  return (
    <main className="min-h-screen bg-mist-950 px-3 py-3">
      {/* Filtro de categorías */}
      <div className="flex gap-2 overflow-x-auto pb-3 mt-3 -mx-3 px-3">
        <button
          onClick={() => setCategoriaFiltro(null)}
          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap flex-shrink-0 transition-colors
            ${!categoriaFiltro ? 'bg-white text-black font-medium' : 'bg-mist-800 text-white hover:bg-mist-700'}`}
        >
          Todos
        </button>
        {categorias.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoriaFiltro(cat.id)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap flex-shrink-0 transition-colors
              ${categoriaFiltro === cat.id
                ? 'bg-white text-black font-medium'
                : 'bg-mist-800 text-white hover:bg-mist-700'}`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Grid de videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-2">
        {videosFiltrados.length === 0 ? (
          <p className="text-mist-500 text-sm col-span-4 text-center mt-10">
            No hay videos
          </p>
        ) : (
          videosFiltrados.map(video => (
            <VideoCard key={video.id} video={video} onClick={verVideo} />
          ))
        )}
      </div>
    </main>
  )
}