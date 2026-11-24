import { test } from 'node:test'
import assert from 'node:assert/strict'
import { arrowCandidates } from '../src/lib/sudoku/arrow-candidates.ts'

const row = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]] as const
const bent = [[1, 1], [2, 2], [3, 3], [3, 2], [2, 1]] as const

test('circle 8 permits a repeated 4 only when shaft cells do not see each other', () => {
  const straight = arrowCandidates(row.slice(0, 3), [8])
  assert.deepEqual(straight.combinations, [[1, 7], [2, 6], [3, 5]])
  assert.deepEqual(straight.shaft, [[1, 2, 3, 5, 6, 7], [1, 2, 3, 5, 6, 7]])
  const acrossBoxes = arrowCandidates(bent.slice(0, 3), [8])
  assert.deepEqual(acrossBoxes.combinations, [[1, 7], [2, 6], [3, 5], [4, 4]])
})

test('shaft length and geometry constrain an unknown circle', () => {
  assert.deepEqual(arrowCandidates(row.slice(0, 3)).circles, [3, 4, 5, 6, 7, 8, 9])
  assert.deepEqual(arrowCandidates(row.slice(0, 4)).circles, [6, 7, 8, 9])
  assert.equal(arrowCandidates(row).assignments.length, 0)
  assert.ok(arrowCandidates(bent).assignments.some(({ circle, shaft }) => circle === 6 && shaft.join(',') === '1,1,2,2'))
})

test('partial visibility is checked for every pair, not just adjacent cells', () => {
  for (const { circle, shaft } of arrowCandidates(bent).assignments) {
    assert.equal(shaft.reduce((a, b) => a + b, 0), circle)
    assert.notEqual(shaft[0], shaft[2]) // Same column.
    assert.notEqual(shaft[0], shaft[3]) // Same row and box.
    assert.notEqual(shaft[1], shaft[2]) // Same row.
  }
})

test('one-cell shafts must equal the circle without violating Sudoku', () => {
  assert.equal(arrowCandidates([[0, 0], [0, 1]]).assignments.length, 0)
  assert.equal(arrowCandidates([[2, 2], [3, 3]]).assignments.length, 9)
})

test('sum restrictions and empty paths are handled', () => {
  assert.equal(arrowCandidates(row.slice(0, 3), [1]).assignments.length, 0)
  assert.equal(arrowCandidates(row.slice(0, 3), []).assignments.length, 0)
  assert.deepEqual(arrowCandidates([]).circles, [])
})
