const DEFAULT_THUMBNAIL = 'https://aws-youtube-lis-contenidos.s3.us-west-1.amazonaws.com/miniaturas/default.jpg'

export default function Sidebar({ videos, onSelect }) {
  if (videos.length === 0) return (
    <p className="text-mist-500 text-xs px-1">Sin recomendaciones</p>
  )

  return (
    <aside className="flex flex-col gap-3">
      {videos.map(video => (
        <button key={video.id} onClick={() => onSelect(video)}
          className="flex gap-2 hover:bg-mist-800 rounded-lg p-2 text-left w-full">

          <img
            src={video.thumbnail_url || DEFAULT_THUMBNAIL}
            alt={video.title}
            className="w-[168px] h-[94px] object-cover rounded-lg flex-shrink-0"
            onError={e => e.currentTarget.src = DEFAULT_THUMBNAIL}
          />

          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className="text-white text-xs font-medium line-clamp-2 leading-snug">
              {video.title}
            </p>
            {video.description && (
              <p className="text-mist-500 text-xs line-clamp-2 leading-snug">
                {video.description}
              </p>
            )}
          </div>
        </button>
      ))}
    </aside>
  )
}