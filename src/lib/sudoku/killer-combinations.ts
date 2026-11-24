export interface CageSum {
  sum: number
  combinations: number[][]
}

// Increasing digits enumerate unordered combinations without repeated digits.
export function killerCombinations(size: number): CageSum[] {
  if (!Number.isInteger(size) || size < 1 || size > 9) return []
  const sums = new Map<number, number[][]>()
  function visit(digits: number[], next: number, sum: number) {
    if (digits.length === size) {
      const combinations = sums.get(sum) ?? []
      combinations.push(digits)
      sums.set(sum, combinations)
      return
    }
    for (let digit = next; digit <= 9 - (size - digits.length - 1); digit++) {
      visit([...digits, digit], digit + 1, sum + digit)
    }
  }
  visit([], 1, 0)
  return [...sums].sort(([a], [b]) => a - b).map(([sum, combinations]) => ({ sum, combinations }))
}

export function killerCageFacts(size: number, sum: number) {
  const combinations = killerCombinations(size).find(row => row.sum === sum)?.combinations
  if (!combinations) return null
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  const possible = digits.filter(digit => combinations.some(combo => combo.includes(digit)))
  const required = possible.filter(digit => combinations.every(combo => combo.includes(digit)))
  const avoided = digits.filter(digit => !possible.includes(digit))
  return { combinations, possible, required, avoided }
}
