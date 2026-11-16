import { test } from 'node:test'
import assert from 'node:assert/strict'
import { area, contains, overlaps, maximalRectangles, randomPoints, generatePoints } from '../src/lib/rectangle-packing/geometry.ts'
import type { Point, Rectangle } from '../src/lib/rectangle-packing/geometry.ts'

test('one anchor grows to the upper-right corner of the square', () => {
  const p = { id: 1, x: .2, y: .3 }
  const options = maximalRectangles(p, [p], [])
  assert.equal(options.length, 1)
  assert.ok(Math.abs(area(options[0]) - .56) < 1e-10)
})

test('an obstructing point gives two incomparable maximal choices', () => {
  const p = { id: 1, x: .1, y: .1 }, q = { id: 2, x: .5, y: .6 }
  const options = maximalRectangles(p, [p, q], [])
  assert.equal(options.length, 2)
  assert.ok(options.every(r => !contains(r, q)))
  assert.ok(area(options[0]) >= area(options[1]))
})

test('shared sides are allowed; overlapping interiors and enclosed points are not', () => {
  const a = { pointId: 1, x: 0, y: 0, width: .5, height: .5 }
  assert.equal(overlaps(a, { ...a, x: .5 }), false)
  assert.equal(overlaps(a, { ...a, x: .49 }), true)
  assert.equal(contains(a, { id: 2, x: .5, y: .2 }), false)
  assert.equal(contains(a, { id: 2, x: .2, y: .2 }), true)
  assert.equal(maximalRectangles({ id: 1, x: 0, y: 0 }, [], [a]).length, 0)
  assert.equal(maximalRectangles({ id: 2, x: 0, y: .25 }, [], [a]).length, 0)
})

test('random sequential packings preserve all constraints and cannot grow', () => {
  // Deterministic layouts, including near-edge anchors.
  let seed = 20261110
  const rand = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 2 ** 32 }
  for (let trial = 0; trial < 100; trial++) {
    const points: Point[] = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, x: .001 + rand() * .998, y: .001 + rand() * .998 }))
    const placed: Rectangle[] = []
    for (const p of points) {
      const options = maximalRectangles(p, points, placed)
      const valid = (r: Rectangle) => r.x + r.width <= 1 + 1e-10 && r.y + r.height <= 1 + 1e-10 && !points.some(q => q.id !== p.id && contains(r, q)) && !placed.some(other => overlaps(r, other))
      for (const r of options) {
        assert.ok(valid(r))
        assert.ok(!valid({ ...r, width: r.width + 1e-6 }))
        assert.ok(!valid({ ...r, height: r.height + 1e-6 }))
      }
      if (options.length) placed.push(options[Math.floor(rand() * options.length)])
    }
    assert.ok(placed.reduce((sum, r) => sum + area(r), 0) <= 1 + 1e-10)
  }
})

test('the origin is fixed, with n-1 distinct interior points', () => {
  const points = randomPoints(40)
  assert.equal(points.length, 40)
  assert.equal(new Set(points.map(p => p.x)).size, 40)
  assert.equal(new Set(points.map(p => p.y)).size, 40)
  assert.deepEqual(points[0], { id: 1, x: 0, y: 0 })
  assert.deepEqual(randomPoints(1), [{ id: 1, x: 0, y: 0 }])
  assert.equal(area(maximalRectangles(points[0], [points[0]], [])[0]), 1)
  assert.ok(points.slice(1).every(p => p.x > 0 && p.x < 1 && p.y > 0 && p.y < 1))
})

test('special layouts retain the origin and satisfy their coordinate constraints', () => {
  for (const layout of ['diagonal', 'anti-diagonal', 'increasing'] as const) {
    const points = generatePoints(20, layout)
    assert.equal(points.length, 20)
    assert.deepEqual(points[0], { id: 1, x: 0, y: 0 })
    assert.deepEqual(generatePoints(1, layout), [{ id: 1, x: 0, y: 0 }])
    const interior = points.slice(1)
    assert.ok(interior.every(p => p.x > 0 && p.x < 1 && p.y > 0 && p.y < 1))
    if (layout === 'diagonal') assert.ok(interior.every(p => p.x === p.y))
    if (layout === 'anti-diagonal') assert.ok(interior.every(p => Math.abs(p.x + p.y - 1) < 1e-10))
    if (layout === 'increasing') assert.ok(points.every((p, i) => i === 0 || (p.x > points[i - 1].x && p.y > points[i - 1].y)))
    const placed: Rectangle[] = []
    for (const p of points) {
      const options = maximalRectangles(p, points, placed)
      assert.ok(options.every(r => !points.some(q => q.id !== p.id && contains(r, q)) && !placed.some(other => overlaps(r, other))))
      if (options.length) placed.push(options[0])
    }
    assert.ok(placed.reduce((sum, r) => sum + area(r), 0) <= 1 + 1e-10)
  }
})


test('optimizer matches exhaustive combinations and dominates sequential maximal choices', async () => {
  const { searchPackings, gridRectangles } = await import('../src/lib/rectangle-packing/optimizer.ts')
  const points = [{ id: 1, x: 0, y: 0 }, { id: 2, x: .25, y: .7 }, { id: 3, x: .6, y: .3 }]
  function brute(placed: Rectangle[]): number {
    const options = points.flatMap(p => maximalRectangles(p, points, placed))
    return Math.max(placed.reduce((s, r) => s + area(r), 0), ...options.map(r => brute([...placed, r])))
  }
  const search = searchPackings(points)
  let step = search.next()
  while (!step.done) step = search.next()
  assert.ok(step.value.complete)
  assert.ok(step.value.covered >= brute([]) - 1e-10)
  function combinations(index: number, placed: Rectangle[]): number {
    if (index === points.length) return placed.reduce((sum, r) => sum + area(r), 0)
    const choices = gridRectangles(points[index], points).filter(r => !placed.some(other => overlaps(r, other)))
    return Math.max(combinations(index + 1, placed), ...choices.map(r => combinations(index + 1, [...placed, r])))
  }
  assert.ok(Math.abs(step.value.covered - combinations(0, [])) < 1e-10)
  assert.ok(step.value.rectangles.every((r, i, all) => !all.slice(0, i).some(other => overlaps(r, other))))
  const single = searchPackings([{ id: 1, x: 0, y: 0 }])
  let one = single.next()
  while (!one.done) one = single.next()
  assert.equal(one.value.covered, 1)
  assert.equal(one.value.complete, true)
})

test('optimizer finds the analytic optimum for the origin plus one point', async () => {
  const { searchPackings } = await import('../src/lib/rectangle-packing/optimizer.ts')
  for (const [x, y] of [[.2, .7], [.8, .15], [.5, .5]]) {
    const search = searchPackings([{ id: 1, x: 0, y: 0 }, { id: 2, x, y }])
    let result = search.next()
    while (!result.done) result = search.next()
    assert.ok(Math.abs(result.value.covered - (Math.max(x, y) + (1 - x) * (1 - y))) < 1e-10)
    assert.equal(result.value.complete, true)
  }
})

test('minimum greedy search matches exhaustive orders and tied maximum-area choices', async () => {
  const { searchMinimumGreedy } = await import('../src/lib/rectangle-packing/optimizer.ts')
  for (const points of [
    [{ id: 1, x: 0, y: 0 }],
    [{ id: 1, x: 0, y: 0 }, { id: 2, x: .5, y: .5 }],
    [{ id: 1, x: 0, y: 0 }, { id: 2, x: .2, y: .7 }, { id: 3, x: .6, y: .3 }, { id: 4, x: .8, y: .9 }],
    [{ id: 1, x: 0, y: 0 }, { id: 2, x: .25, y: .25 }, { id: 3, x: .5, y: .5 }, { id: 4, x: .75, y: .75 }],
  ]) {
    function brute(placed: Rectangle[]): number {
      const choices = points.flatMap(p => {
        const options = maximalRectangles(p, points, placed)
        return options.filter(r => Math.abs(area(r) - area(options[0])) <= 1e-12)
      })
      return choices.length ? Math.min(...choices.map(r => brute([...placed, r]))) : placed.reduce((sum, r) => sum + area(r), 0)
    }
    const search = searchMinimumGreedy(points)
    let step = search.next()
    for (;;) {
      const placed: Rectangle[] = []
      for (const r of step.value.rectangles) {
        const point = points.find(p => p.id === r.pointId)!
        const choices = maximalRectangles(point, points, placed)
        assert.ok(choices.some(c => Math.abs(c.width - r.width) < 1e-10 && Math.abs(c.height - r.height) < 1e-10))
        assert.ok(Math.abs(area(r) - area(choices[0])) < 1e-10)
        placed.push(r)
      }
      assert.ok(points.every(p => !maximalRectangles(p, points, placed).length), 'every reported incumbent is a finished run')
      if (step.done) break
      step = search.next()
    }
    assert.equal(step.value.complete, true)
    assert.ok(Math.abs(step.value.covered - brute([])) < 1e-10)
  }
})

test('staircase challenge is reproducible, its demonstration is greedy and can be beaten', async () => {
  const { staircaseChallenge } = await import('../src/lib/rectangle-packing/staircase.ts')
  const challenge = staircaseChallenge()
  assert.deepEqual(challenge, staircaseChallenge())
  assert.equal(challenge.points.length, 37)
  assert.equal(new Set(challenge.order).size, 37)
  assert.deepEqual(challenge.points[0], { id: 1, x: 0, y: 0 })
  assert.ok(challenge.points.every(p => p.x >= 0 && p.x < 1 && p.y >= 0 && p.y < 1))
  assert.deepEqual(generatePoints(8, 'staircase'), challenge.points)
  function replay(ids: number[]) {
    const placed: Rectangle[] = []
    for (const id of ids) {
      const p = challenge.points.find(p => p.id === id)!
      const options = maximalRectangles(p, challenge.points, placed)
      assert.ok(options.length, 'every demonstration anchor gets positive area')
      const r = options[0]
      assert.ok(!challenge.points.some(q => q.id !== id && contains(r, q)))
      assert.ok(!placed.some(other => overlaps(r, other)))
      placed.push(r)
    }
    return placed.reduce((s, r) => s + area(r), 0)
  }
  const demonstration = replay(challenge.order)
  assert.ok(demonstration > .8 && demonstration < .85)
  const better = replay([...challenge.points].sort((a, b) => b.x + b.y - a.x - a.y).map(p => p.id))
  assert.ok(better > demonstration + .04, 'a different order beats the demonstration')
})

test('seeded staircase puzzles vary and retain valid greedy demonstrations', async () => {
  const { staircaseChallenge } = await import('../src/lib/rectangle-packing/staircase.ts')
  const { seededRandom } = await import('../src/lib/rectangle-packing/puzzles.ts')
  let previous = ''
  for (const seed of [1, 12345, 9999999, 2147483647, 4294967295]) {
    const puzzle = staircaseChallenge(seededRandom(seed))
    assert.deepEqual(puzzle, staircaseChallenge(seededRandom(seed)))
    assert.notEqual(JSON.stringify(puzzle), previous)
    previous = JSON.stringify(puzzle)
    assert.ok(puzzle.points.length >= 10 && puzzle.points.length <= 40)
    assert.equal(new Set(puzzle.order).size, puzzle.points.length)
    const placed: Rectangle[] = []
    for (const id of puzzle.order) {
      const point = puzzle.points.find(p => p.id === id)!
      const rectangle = maximalRectangles(point, puzzle.points, placed)[0]
      assert.ok(rectangle)
      assert.ok(!puzzle.points.some(p => p.id !== id && contains(rectangle, p)))
      assert.ok(!placed.some(other => overlaps(rectangle, other)))
      placed.push(rectangle)
    }
    assert.ok(placed.reduce((s, r) => s + area(r), 0) <= 1 + 1e-10)
    assert.equal(generatePoints(8, 'random-staircase', seed).length, 8)
  }
})

test('50% puzzle certificates bound an attainable valid packing tightly', async () => {
  const { tightPuzzle, chainCertificate } = await import('../src/lib/rectangle-packing/puzzles.ts')
  for (const count of [12, 24, 40]) for (let seed = 0; seed < 20; seed++) {
    const points = tightPuzzle(count, seed)
    assert.deepEqual(points, tightPuzzle(count, seed))
    assert.equal(points.length, count)
    assert.deepEqual(points[0], { id: 1, x: 0, y: 0 })
    const proof = chainCertificate(points)!
    assert.ok(proof)
    assert.ok(proof.lower > .5)
    assert.ok(proof.upper >= proof.lower - 1e-10)
    assert.ok(proof.upper < .56)
    if (count === 40) assert.ok(proof.upper < .52)
    assert.equal(proof.solution.length, count)
    assert.ok(proof.solution.every((r, i) => !points.some(p => p.id !== r.pointId && contains(r, p)) && !proof.solution.slice(0, i).some(other => overlaps(r, other))))
    assert.ok(Math.abs(proof.solution.reduce((s, r) => s + area(r), 0) - proof.lower) < 1e-10)
  }
  assert.equal(chainCertificate([{ id: 1, x: 0, y: 0 }, { id: 2, x: .2, y: .8 }, { id: 3, x: .8, y: .2 }]), null)
})

test('coverage certificates enclose exact optimizer results', async () => {
  const { tightPuzzle, chainCertificate } = await import('../src/lib/rectangle-packing/puzzles.ts')
  const { searchPackings } = await import('../src/lib/rectangle-packing/optimizer.ts')
  for (let seed = 0; seed < 10; seed++) {
    const points = tightPuzzle(4, seed), proof = chainCertificate(points)!
    const search = searchPackings(points)
    let result = search.next()
    while (!result.done) result = search.next()
    assert.ok(result.value.covered <= proof.upper + 1e-10)
    assert.ok(result.value.covered >= proof.lower - 1e-10)
  }
})


test('random staircases honor every requested count and retain valid replay', async () => {
  const { randomStaircase } = await import('../src/lib/rectangle-packing/staircase.ts')
  const { seededRandom } = await import('../src/lib/rectangle-packing/puzzles.ts')
  for (let count = 1; count <= 40; count++) for (const seed of [1, 12345, 2147483647]) {
    const puzzle = randomStaircase(count, seededRandom(seed))
    assert.equal(puzzle.points.length, count)
    assert.equal(new Set(puzzle.order).size, count)
    assert.deepEqual(puzzle, randomStaircase(count, seededRandom(seed)))
    assert.deepEqual(generatePoints(count, 'random-staircase', seed), puzzle.points)
    const placed: Rectangle[] = []
    for (const id of puzzle.order) {
      const p = puzzle.points.find(p => p.id === id)!
      assert.ok(p.x >= 0 && p.x < 1 && p.y >= 0 && p.y < 1)
      const r = maximalRectangles(p, puzzle.points, placed)[0]
      assert.ok(r, `positive-area replay for count=${count}, seed=${seed}, point=${id}`)
      assert.ok(!puzzle.points.some(q => q.id !== id && contains(r, q)))
      assert.ok(!placed.some(other => overlaps(r, other)))
      placed.push(r)
    }
  }
})
