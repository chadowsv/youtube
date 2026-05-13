import { useState, useEffect } from 'react'
import Player from '../components/Player'
import Sidebar from '../components/Sidebar'
import Comments from '../components/Comments'
import type { Video } from '../types'
import { getVideosByCategory } from '../services/api'

interface PlayerPageProps {
  video: Video
  setVista: (v: string) => void
  setVideoActual: (v: Video) => void
}

export default function PlayerPage({ video, setVista, setVideoActual }: PlayerPageProps) {
  const [recomendaciones, setRecomendaciones] = useState<Video[]>([])

  useEffect(() => {
    getVideosByCategory(video.category_id).then(data => {
      const otros = data.filter((v: Video) => v.id !== video.id)
      const aleatorios = otros.sort(() => Math.random() - 0.5).slice(0, 10)
      setRecomendaciones(aleatorios)
    })
  }, [video])

  const verVideo = (v: Video) => {
    setVideoActual(v)
    // Fuerza re-render del player subiendo y bajando la vista
    setVista('player')
  }

  return (
    <main className="min-h-screen bg-mist-950 px-3 py-3">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4 mt-4 max-w-[1400px] mx-auto">
        <section className="flex flex-col gap-4 min-w-0">
          <button
            onClick={() => setVista('home')}
            className="text-mist-400 text-xs hover:text-white w-fit"
          >
            ← Volver
          </button>
          <Player video={video} />
          <Comments videoId={video.id} />
        </section>
        <aside>
          <h2 className="text-white font-medium text-sm mb-3">Más videos</h2>
          <Sidebar videos={recomendaciones} onSelect={verVideo} />
        </aside>
      </div>
    </main>
  )
}