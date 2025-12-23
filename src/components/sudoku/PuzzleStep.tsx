import { useTheme } from '../../context/ThemeContext'

interface PuzzleStepProps {
  /** Path to the puzzle image */
  src: string
  /** Optional caption explaining this step */
  caption?: string
  /** Size: 'sm' (200px), 'md' (300px), 'lg' (400px), 'full' (100%) */
  size?: 'sm' | 'md' | 'lg' | 'full'
  /** Optional alt text for accessibility */
  alt?: string
}

const sizeMap = {
  sm: 'max-w-[200px]',
  md: 'max-w-[300px]',
  lg: 'max-w-[400px]',
  full: 'max-w-full',
}

export default function PuzzleStep({ src, caption, size = 'md', alt }: PuzzleStepProps) {
  const { theme } = useTheme()

  return (
    <div className="flex justify-center">
      <figure className={`${sizeMap[size]} my-4`}>
      <div className="rounded-lg overflow-hidden shadow-md">
        <img
          src={src}
          alt={alt || caption || 'Puzzle step'}
          className="w-full h-auto"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption
          className={`text-center text-fs-8 mt-2 ${
            theme === 'dark' ? 'text-light-gray-70' : 'text-light-muted'
          }`}
        >
          {caption}
        </figcaption>
      )}
    </figure>
    </div>
  )
}
