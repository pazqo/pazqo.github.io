interface CellProps {
  /** Row index */
  r: number | string
  /** Column index */
  c: number | string
}

export default function Cell({ r, c }: CellProps) {
  return (
    <span>
      c<sub>{r}{c}</sub>
    </span>
  )
}
