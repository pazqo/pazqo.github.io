# Rectangle Lab: packing bounds and puzzle generation

Research notes, 10 November 2026.

## Problem and terminology

The unit square contains a set of `n` anchor points, including `(0,0)`. Each point anchors the bottom-left corner of an axis-aligned rectangle inside the square. Rectangle interiors must be disjoint, and no rectangle may contain another anchor in its interior. Shared sides and anchors on rectangle boundaries are allowed.

The point count **includes the origin**: there are `n−1` additional points.

- **Maximal rectangle:** cannot grow in width or height without violating a constraint, with previous placements fixed.
- **Maximum-area rectangle:** the valid rectangle of greatest area for one anchor, with previous placements fixed. Several choices may tie.
- **Optimal packing:** maximizes the total covered area for a fixed point set.
- **Worst configuration:** a point set whose optimal packing has as little area as possible.

A rectangle can be maximal without having maximum area. A bad greedy packing is not evidence that its point set has a low optimal coverage.

## Small-point-count bounds

Let `OPT(P)` be the optimal coverage for a point set `P`. Define

```text
m(n) = inf OPT(P), over all n-point sets P containing (0,0).
```

Vincent Bian's *Special Configurations in Anchored Rectangle Packings* gives the following bounds in §10.1. Percentages are rounded from the paper's reported values; these are bounds from that paper, not a claim that no later improvements exist.

| Total points n | Proven lower bound for m(n) | Upper bound from an explicit configuration |
| ---: | ---: | ---: |
| 1 | 100% | 100% |
| 2 | 75% | 75% |
| 3 | 66.67% | 66.67% |
| 4 | 62.50% | 62.50% |
| 5 | approximately 58.33% | 60% |
| 6 | approximately 56.15% | 58.33% |
| 7 | approximately 53.74% | 57.14% |
| 8 | approximately 52.11% | 56.25% |
| 9 | approximately 50.80% | 55.56% |

For `n=1,2,3,4`, the lower and upper bounds coincide, giving exact values. For `n=5,…,9`, the table gives intervals, not exact values.

Interpretation:

- A lower bound guarantees that **every** point set of that size admits at least that much coverage, using suitable rectangle choices.
- An upper bound supplies **some** point set on which no packing can exceed that coverage.
- Neither statement guarantees that every point ordering or every greedy run attains the bound.
- With only three points, it is already possible to make 70% coverage impossible.

Sources: [Bian, §10.1, PDF page 39](https://arxiv.org/pdf/1809.01769#page=39), [paper abstract](https://arxiv.org/abs/1809.01769).

## Equally spaced diagonal configurations

For

```text
P = { (i/n, i/n) : i = 0,…,n−1 },
```

the optimal coverage is exactly

```text
OPT(P) = 1/2 + 1/(2n).
```

These configurations give the upper-bound column above. Examples:

| n | Exact optimal coverage |
| ---: | ---: |
| 3 | 66.67% |
| 4 | 62.50% |
| 10 | 55% |
| 20 | 52.50% |
| 40 | 51.25% |

Equal spacing matters: random diagonal points can leave larger gaps and allow greater coverage. Bian proves the same lower bound for increasing configurations (x-order and y-order agree), with equality at equally spaced diagonal points. Its extension to all point configurations is presented as a conjecture, not a theorem.

Sources: [Bian, Corollary 8, PDF page 15](https://arxiv.org/pdf/1809.01769#page=15), [Dumitrescu–Tóth, introduction](https://adriandumitrescu.org/anchored.pdf#page=1).

## The general 50% question

Freedman's conjecture asks whether every finite point set containing the origin admits a packing covering at least half the square. The sources reviewed treat the general statement as open. Bian proves it for all sets of at most nine points and for several structural classes.

A general 39% guarantee is proved by Damerius, Kaaser, Kling, and Schneider in *On Greedily Packing Anchored Rectangles* (2021). Their results about a particular algorithm's limitations must not be interpreted as upper bounds on optimal coverage.

Sources: [Bian, Theorem 28](https://arxiv.org/pdf/1809.01769#page=39), [Damerius et al.](https://arxiv.org/abs/2102.08181).

Experiments on finitely many point sets cannot prove the universal 50% claim. A completed exact optimization establishes the optimum for that particular instance, subject to the implementation's numerical tolerance.

## Greedy orderings and staircase traps

Dumitrescu–Tóth's Lemma 10 shows that every Pareto-optimal packing can be reproduced by a greedy maximum-area strategy for some point ordering and suitable tie-breaking. Consequently, exploring all orderings and all tied maximum-area choices can recover an optimal packing. Our earlier suggestion that this necessarily misses an optimum was incorrect.

An arbitrary ordering need not perform well. The paper's staircase-and-fence construction produces bad greedy sequences: staircases approximate hyperbolas, while nearby fence points block later access to unfilled regions. Recursion makes particular greedy runs perform badly. This is different from making the point set's **optimal** packing poor.

Sources: [Dumitrescu–Tóth, Theorem 9 and construction, PDF pages 14–15](https://adriandumitrescu.org/anchored.pdf#page=14), [Lemma 10, PDF page 16](https://adriandumitrescu.org/anchored.pdf#page=16).

## Current app experiments

- Manual placement lists valid maximal rectangles for a selected anchor and tracks total coverage.
- The maximum-coverage optimizer searches empty rectangles on the grid of anchor coordinates and square boundaries. An optimum exists on this grid: expanding a rectangle stops its right or top edge at another point coordinate or the square boundary.
- The minimum-greedy optimizer minimizes final coverage over point orderings, allowing only maximum-area rectangles at each step and exploring ties. It compares finished runs, not low-area partial packings.
- Interrupted searches report only the best or lowest result found; they do not prove an extremum.
- Saved configurations retain point coordinates, placements, layout, and, where applicable, the generator seed.
- The original fixed staircase challenge has 37 points and a verified greedy demonstration covering approximately 82.50%. It is a finite example inspired by the paper, not its full asymptotic construction.
- Randomized staircase puzzles now honor the requested point count, including the origin. They vary the recursive geometry and fence placement. They do **not** certify that reaching 50% is difficult.
- The seeded 50% puzzle generator makes perturbed near-diagonal configurations, with shuffled labels and explicit upper/lower coverage certificates. A tight ceiling measures available coverage, not human solving difficulty.

For an increasing chain `(x_i,y_i)`, the app's coverage ceiling sums

```text
max((x_(i+1) − x_i) * (1 − y_i),
    (1 − x_i) * (y_(i+1) − y_i)),
```

using `(1,1)` as a sentinel after the last anchor. Each rectangle must stop before the next anchor in at least one direction. This bounds its area even when overlap is ignored. Valid vertical-strip and horizontal-strip packings provide achievable lower bounds. The ceiling is not generally the exact optimum.

## Direction for stronger puzzles

Randomly varying staircase parameters does not directly minimize optimal coverage. A more targeted generator needs an outer search:

1. Generate or mutate a candidate point set, retaining the origin.
2. Evaluate its optimized coverage using the packing solver.
3. Prefer point sets with lower optimal coverage.
4. Keep reproducible coordinates and a valid witness packing.
5. Use exact completion or a rigorous upper-bound certificate before claiming that higher coverage is impossible.

A time-limited maximum search only supplies an achievable **lower bound** on the optimum. A low incumbent may mean the solver has not found a good packing; it does not certify a hard configuration. The outer search must account for that distinction.

For human puzzle difficulty, additional evaluation is needed: a small optimal coverage does not establish that finding a 50% packing is difficult. Possible experimental metrics include greedy success rate over sampled orders, the gap between an initial greedy run and the optimum, and sensitivity to early placements. These would be heuristic difficulty indicators, not mathematical guarantees.
