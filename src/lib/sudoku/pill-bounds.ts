// Arithmetic bounds for straight pills. Their digits share a house and are distinct.
// These are necessary conditions, not a solution of a particular arrow geometry.
export function pillBounds(pillSize: number, shaftLength: number, distinctShaft: boolean) {
  const valid = [2, 3].includes(pillSize) && Number.isInteger(shaftLength) && shaftLength >= 1 && shaftLength <= 81
  const minimum = distinctShaft ? shaftLength * (shaftLength + 1) / 2 : shaftLength
  const maximum = distinctShaft ? shaftLength * (19 - shaftLength) / 2 : 9 * shaftLength
  const totals: number[] = []
  function visit(digits: number[], value: number) {
    if (digits.length === pillSize) {
      if (value >= minimum && value <= maximum) totals.push(value)
      return
    }
    for (let digit = 1; digit <= 9; digit++) {
      if (!digits.includes(digit)) visit([...digits, digit], value * 10 + digit)
    }
  }
  if (valid && (!distinctShaft || shaftLength <= 9)) visit([], 0)
  const candidates = Array.from({ length: [2, 3].includes(pillSize) ? pillSize : 0 }, (_, index) =>
    [...new Set(totals.map(total => Number(String(total)[index])))].sort((a, b) => a - b))
  return { minimum, maximum, totals, candidates }
}
