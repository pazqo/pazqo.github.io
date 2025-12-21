import { useTheme } from '../../context/ThemeContext'

interface YouTubeEmbedProps {
  /** YouTube video ID or full URL */
  video: string
  /** Optional title */
  title?: string
  /** Start time in seconds */
  start?: number
  /** Aspect ratio: '16:9' (default) or '4:3' */
  aspect?: '16:9' | '4:3'
}

function extractVideoId(input: string): string {
  const trimmed = input.trim()

  // Already just an ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }

  // Full URL formats
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = trimmed.match(pattern)
    if (match) return match[1]
  }

  return trimmed
}

export default function YouTubeEmbed({ video, title, start, aspect = '16:9' }: YouTubeEmbedProps) {
  const { theme } = useTheme()
  const videoId = extractVideoId(video)

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}${start ? `?start=${start}` : ''}`
  const aspectClass = aspect === '4:3' ? 'aspect-[4/3]' : 'aspect-video'

  return (
    <figure className="my-6">
      <div
        className={`w-full ${aspectClass} rounded-lg overflow-hidden shadow-shadow-2 ${
          theme === 'dark' ? 'bg-jet' : 'bg-gray-200'
        }`}
      >
        <iframe
          src={embedUrl}
          title={title || 'YouTube video'}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {title && (
        <figcaption
          className={`text-center text-fs-8 mt-2 ${
            theme === 'dark' ? 'text-light-gray-70' : 'text-light-muted'
          }`}
        >
          {title}
        </figcaption>
      )}
    </figure>
  )
}
