import { searchMinimumGreedy, searchPackings } from './optimizer'
import type { Point, Rectangle } from './geometry'

self.onmessage = (event: MessageEvent<{ points: Point[]; initial: Rectangle[]; seconds: number; objective: 'maximum' | 'minimum-greedy' }>) => {
  const search = event.data.objective === 'minimum-greedy' ? searchMinimumGreedy(event.data.points) : searchPackings(event.data.points, event.data.initial)
  const started = performance.now()
  let lastUpdate = 0
  for (;;) {
    const step = search.next()
    const progress = step.value
    const timedOut = performance.now() - started >= event.data.seconds * 1000
    if (step.done || timedOut || performance.now() - lastUpdate >= 150) {
      self.postMessage({ ...progress, done: !!step.done || timedOut })
      lastUpdate = performance.now()
    }
    if (step.done || timedOut) break
  }
}
