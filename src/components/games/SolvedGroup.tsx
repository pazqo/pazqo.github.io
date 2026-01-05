import type { PuzzleGroup } from '../../data/connectwords/puzzles'

interface SolvedGroupProps {
  group: PuzzleGroup & { groupIndex?: number }
}

export default function SolvedGroup({ group }: SolvedGroupProps) {
  return (
    <div
      className="cw-solved-group"
      style={{ backgroundColor: group.color || '#a0c35a' }}
    >
      <div className="cw-solved-group-name">{group.name}</div>
      <div className="cw-solved-group-words">
        {group.words.join(', ')}
      </div>
    </div>
  )
}
