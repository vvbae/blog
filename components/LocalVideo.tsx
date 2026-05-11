export default function LocalVideo({ src, title = 'Video' }: { src: string; title?: string }) {
  return (
    <video
      src={src}
      title={title}
      controls
      playsInline
      className="w-full rounded-[2px]"
    />
  )
}
