import { test } from 'node:test'
import assert from 'node:assert/strict'
import { killerCageFacts, killerCombinations } from '../src/lib/sudoku/killer-combinations.ts'

test('cage combinations match every subset of digits 1–9, grouped by size and sum', () => {
  for (let size = 1; size <= 9; size++) {
    const expected = new Map<number, string[]>()
    for (let mask = 1; mask < 512; mask++) {
      const digits = Array.from({ length: 9 }, (_, i) => i + 1).filter(digit => mask & (1 << (digit - 1)))
      if (digits.length !== size) continue
      const sum = digits.reduce((a, b) => a + b, 0)
      expected.set(sum, [...(expected.get(sum) ?? []), digits.join(',')])
    }
    const actual = killerCombinations(size)
    assert.deepEqual(actual.map(row => row.sum), [...expected.keys()].sort((a, b) => a - b))
    for (const row of actual) {
      assert.deepEqual(row.combinations.map(combo => combo.join(',')).sort(), expected.get(row.sum)!.sort())
    }
  }
})

test('reference examples distinguish unique combinations from forced digits', () => {
  assert.deepEqual(killerCombinations(3).find(row => row.sum === 6)?.combinations, [[1, 2, 3]])
  assert.deepEqual(killerCombinations(3).find(row => row.sum === 8)?.combinations, [[1, 2, 5], [1, 3, 4]])
  assert.deepEqual(killerCombinations(4).find(row => row.sum === 30)?.combinations, [[6, 7, 8, 9]])
  assert.deepEqual(killerCombinations(8).find(row => row.sum === 40)?.combinations, [[1, 2, 3, 4, 6, 7, 8, 9]])
})

test('invalid cage sizes have no combinations', () => {
  for (const size of [0, 10, -1, 2.5, NaN, Infinity]) assert.deepEqual(killerCombinations(size), [])
})

test('Killer playground distinguishes forced inside and outside digits', () => {
  const eight = killerCageFacts(3, 8)!
  assert.deepEqual(eight.required, [1])
  assert.deepEqual(eight.possible, [1, 2, 3, 4, 5])
  assert.deepEqual(eight.avoided, [6, 7, 8, 9])
  assert.deepEqual(killerCageFacts(3, 9)!.avoided, [7, 8, 9])
  assert.deepEqual(killerCageFacts(8, 40)!.avoided, [5])
  assert.deepEqual(killerCageFacts(9, 45)!.required, [1, 2, 3, 4, 5, 6, 7, 8, 9])
  assert.equal(killerCageFacts(3, 2), null)
})

test('outside deductions agree with all complementary digit sets in one box', () => {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  for (let size = 1; size <= 8; size++) {
    for (const row of killerCombinations(size)) {
      const facts = killerCageFacts(size, row.sum)!
      const outside = killerCombinations(9 - size).find(other => other.sum === 45 - row.sum)!.combinations
      assert.deepEqual(digits.filter(digit => outside.every(combo => combo.includes(digit))), facts.avoided)
      assert.deepEqual(digits.filter(digit => !outside.some(combo => combo.includes(digit))), facts.required)
    }
  }
})
