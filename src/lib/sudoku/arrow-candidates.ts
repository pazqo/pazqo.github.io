type Position = readonly [number, number]
const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const sees = ([r1, c1]: Position, [r2, c2]: Position) => r1 === r2 || c1 === c2
  || Math.floor(r1 / 3) === Math.floor(r2 / 3) && Math.floor(c1 / 3) === Math.floor(c2 / 3)

// Enumerate local arrow assignments, respecting the actual row/column/box geometry.
// The circle is path[0]; only path.slice(1) contributes to the sum.
export function arrowCandidates(path: readonly Position[], totals: readonly number[] = digits) {
  const assignments: { circle: number; shaft: number[] }[] = []
  const length = path.length - 1
  const allowed = new Set(totals.filter(digit => Number.isInteger(digit) && digit >= 1 && digit <= 9))
  function visit(shaft: number[], sum: number) {
    if (shaft.length === length) {
      if (allowed.has(sum) && shaft.every((digit, index) => digit !== sum || !sees(path[0], path[index + 1]))) {
        assignments.push({ circle: sum, shaft })
      }
      return
    }
    for (const digit of digits) {
      if (sum + digit + length - shaft.length - 1 > 9) break
      if (shaft.some((previous, index) => previous === digit && sees(path[index + 1], path[shaft.length + 1]))) continue
      visit([...shaft, digit], sum + digit)
    }
  }
  if (length >= 1 && length <= 9) visit([], 0)
  const combinations = new Map<string, number[]>()
  for (const { shaft } of assignments) {
    const sorted = [...shaft].sort((a, b) => a - b)
    combinations.set(sorted.join(','), sorted)
  }
  return {
    assignments,
    circles: digits.filter(digit => assignments.some(assignment => assignment.circle === digit)),
    shaft: Array.from({ length: Math.max(0, length) }, (_, index) => digits.filter(digit => assignments.some(assignment => assignment.shaft[index] === digit))),
    combinations: [...combinations.values()].sort((a, b) => a.reduce((sum, d) => sum + d, 0) - b.reduce((sum, d) => sum + d, 0) || a.join('').localeCompare(b.join(''))),
  }
}
