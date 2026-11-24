import { test } from 'node:test'
import assert from 'node:assert/strict'
import { pillBounds } from '../src/lib/sudoku/pill-bounds.ts'

test('two-cell shafts force a leading 1 and exclude repeated or zero pill digits', () => {
  assert.deepEqual(pillBounds(2, 2, false).totals, [12, 13, 14, 15, 16, 17, 18])
  assert.deepEqual(pillBounds(2, 2, true).totals, [12, 13, 14, 15, 16, 17])
  assert.deepEqual(pillBounds(2, 2, false).candidates[0], [1])
  assert.deepEqual(pillBounds(2, 3, true).candidates[0], [1, 2])
})

test('three-digit pills need at least 14 shaft cells even before geometry restrictions', () => {
  assert.deepEqual(pillBounds(3, 13, false).totals, [])
  assert.deepEqual(pillBounds(3, 14, false).totals, [123, 124, 125, 126])
  assert.deepEqual(pillBounds(3, 14, false).candidates, [[1], [2], [3, 4, 5, 6]])
  for (let length = 1; length <= 10; length++) assert.deepEqual(pillBounds(3, length, true).totals, [])
})

test('bounds match direct scanning of decimal numbers with distinct nonzero digits', () => {
  for (const size of [2, 3]) for (let length = 1; length <= 18; length++) for (const distinct of [false, true]) {
    const minimum = distinct ? length * (length + 1) / 2 : length
    const maximum = distinct ? length * (19 - length) / 2 : 9 * length
    const expected = []
    for (let value = 10 ** (size - 1); value < 10 ** size; value++) {
      const text = String(value)
      if (distinct && length > 9 || value < minimum || value > maximum || text.includes('0') || new Set(text).size !== size) continue
      expected.push(value)
    }
    assert.deepEqual(pillBounds(size, length, distinct).totals, expected)
  }
})
