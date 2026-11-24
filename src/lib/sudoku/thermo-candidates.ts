// Keep exactly the digits that belong to a complete strictly increasing sequence.
// Recompute from the user's restrictions so restoring a digit restores deductions too.
export function thermoCandidates(domains: readonly (readonly number[])[]): number[][] {
  if (!domains.length) return []
  const forward: number[][] = []
  for (const [index, domain] of domains.entries()) {
    forward.push([...new Set(domain)].filter(digit => Number.isInteger(digit) && digit >= 1 && digit <= 9
      && (index === 0 || forward[index - 1].some(previous => previous < digit))).sort((a, b) => a - b))
  }
  const supported = forward.map(domain => [...domain])
  for (let index = supported.length - 2; index >= 0; index--) {
    supported[index] = forward[index].filter(digit => supported[index + 1].some(next => next > digit))
  }
  return supported
}
