export default function Player({ video }) {
  return (
    <section className="flex flex-col gap-2">
      <video key={video.id} controls className="w-full rounded-xl bg-black aspect-video">
        <source src={video.video_url} type="video/mp4" />
      </video>
      <h1 className="text-white font-semibold text-lg leading-snug">{video.title}</h1>
      {video.description && (
        <p className="text-mist-400 text-sm leading-relaxed">{video.description}</p>
      )}
      <p className="text-mist-500 text-xs">
        {new Date(video.created_at).toLocaleDateString('es-EC', {
          year: 'numeric', month: 'long', day: 'numeric'
        })}
      </p>
    </section>
  )
}