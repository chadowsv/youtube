export default function Sidebar({ videos, onSelect }) {
  if (videos.length === 0) return (
    <p className="text-mist-500 text-xs px-1">Sin recomendaciones</p>
  )

  return (
    <aside className="flex flex-col gap-2">
      {videos.map(video => (
        <button key={video.id} onClick={() => onSelect(video)}
          className="flex gap-2 hover:bg-mist-800 rounded-lg p-1.5 text-left w-full">
          <img
            src={video.thumbnail_url || `https://aws-youtube-lis-contenidos.s3.us-west-1.amazonaws.com/miniaturas/default.jpg`}
            alt={video.title}
            className="w-[168px] h-[94px] object-cover rounded-lg flex-shrink-0"
            onError={e => e.currentTarget.src = `https://aws-youtube-lis-contenidos.s3.us-west-1.amazonaws.com/miniaturas/default.jpg`}
          />
          <p className="text-white text-xs font-medium line-clamp-3 flex-1 leading-snug">
            {video.title}
          </p>
        </button>
      ))}
    </aside>
  )
}