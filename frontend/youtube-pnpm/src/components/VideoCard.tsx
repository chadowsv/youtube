import type { Video } from '../types'

const DEFAULT_THUMBNAIL = 'https://aws-youtube-lis-contenidos.s3.us-west-1.amazonaws.com/miniaturas/default.jpg'

interface VideoCardProps {
  video: Video
  onClick: (v: Video) => void
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <article onClick={() => onClick(video)} className="cursor-pointer group">
      <div className="aspect-video rounded-xl overflow-hidden bg-mist-800">
        <img
          src={video.thumbnail_url || DEFAULT_THUMBNAIL}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => (e.currentTarget.src = DEFAULT_THUMBNAIL)}
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
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </article>
  )
}