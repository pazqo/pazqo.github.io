interface SubProps {
  /** Base text */
  children: React.ReactNode
  /** Subscript text */
  s: string | number
}

export default function Sub({ children, s }: SubProps) {
  return (
    <span>
      {children}<sub>{s}</sub>
    </span>
  )
}
