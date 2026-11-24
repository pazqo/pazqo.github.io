import { test } from 'node:test'
import assert from 'node:assert/strict'
import { thermoCandidates } from '../src/lib/sudoku/thermo-candidates.ts'
import { killerCombinations } from '../src/lib/sudoku/killer-combinations.ts'

const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]

test('unrestricted thermos have the length-based ranges', () => {
  for (let length = 2; length <= 9; length++) {
    assert.deepEqual(thermoCandidates(Array.from({ length }, () => digits)),
      Array.from({ length }, (_, index) => Array.from({ length: 10 - length }, (_, digit) => index + digit + 1)))
  }
})

test('restrictions propagate in both directions and restore without stale deductions', () => {
  assert.deepEqual(thermoCandidates([[2, 5], [3, 4]]), [[2], [3, 4]])
  assert.deepEqual(thermoCandidates([digits, digits, [4], digits, digits]), [[1, 2], [2, 3], [4], [5, 6, 7, 8], [6, 7, 8, 9]])
  assert.deepEqual(thermoCandidates([[1, 2], [2, 3], [3]]), [[1], [2], [3]])
  assert.deepEqual(thermoCandidates([[1, 2], [2, 3], [3, 4]]), [[1, 2], [2, 3], [3, 4]])
})

test('contradictions leave no supported candidates anywhere', () => {
  assert.deepEqual(thermoCandidates([[5], [3, 4]]), [[], []])
  assert.deepEqual(thermoCandidates([digits, [], digits]), [[], [], []])
  assert.deepEqual(thermoCandidates([]), [])
})

test('propagation agrees with exhaustive sequences for varied candidate restrictions', () => {
  let seed = 12345
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2 ** 32 }
  for (let length = 2; length <= 9; length++) {
    const sequences = killerCombinations(length).flatMap(row => row.combinations)
    for (let attempt = 0; attempt < 100; attempt++) {
      const domains = Array.from({ length }, () => digits.filter(() => random() > .25))
      const valid = sequences.filter(sequence => sequence.every((digit, index) => domains[index].includes(digit)))
      const expected = domains.map((_, index) => [...new Set(valid.map(sequence => sequence[index]))].sort((a, b) => a - b))
      assert.deepEqual(thermoCandidates(domains), expected)
    }
  }
})
