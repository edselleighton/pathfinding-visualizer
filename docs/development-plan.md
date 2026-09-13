# Two-day development plan

Dates use Asia/Manila. This continues PRs #1–#16 from commit f95e19f.

## September 9 — implemented

Branch: `feature/bfs-visualization`. Draft PR targets `main`; merging is a separate action.

- [x] Pure BFS with deterministic up/right/down/left traversal, wall avoidance and path reconstruction.
- [x] Separate board, search and playback state; visited cells animate before the path.
- [x] Run, Pause/Resume, Step, Stop, Clear search and Reset board.
- [x] Live visited count, final move count/cost, and computation time excluding animation.
- [x] Slow/Normal/Fast (80/25/5 ms per event), frame batching and cancellation.
- [x] Editing locks, clearing stale results, reduced-motion instant rendering.
- [x] Disabled future algorithms/mazes and explanation of BFS weight behavior.
- [x] 16 Vitest/React Testing Library tests pass; production build passes.
- [x] Browser smoke test: edit → run → pause → step → resume → result → clear → rerun → reset. No console warnings/errors.

## September 13–14 — follow-up implemented

Branch: `feature/complete-pathfinding-visualizer`.
PR #17 merged on September 9. This follow-up branches from the updated `main` and targets `main`.

1. [x] Dijkstra and A*: shared search/playback contract, stable priority queue and Manhattan heuristic. Weighted-route results verified against an independent relaxation oracle.
2. [x] DFS and greedy best-first search, with weight handling and optimality explanations for all algorithms.
3. [x] Explicit Generate action, random walls at 25% density and recursive division. Generation replaces terrain/results and preserves endpoints; randomness is injectable for tests.
4. [x] Mouse/pen stroke painting, click/tap placement, keyboard navigation, one grid tab stop and visible S/T/5 symbols. Browser checks cover mouse drawing, keyboard bounds and touch.
5. [x] README, in-app guide, GitHub Actions and Playwright tests.
6. [x] All algorithms, weighted detours, unreachable boards, maze invariants, playback, keyboard/drag/touch and narrow light/dark layouts verified.
7. [x] Fresh `npm.cmd ci`, 34 unit/component tests, production build and 5 browser scenarios passed. Browser tests check for console errors.

The local browser suite uses one worker to avoid Windows concurrent-browser launch failures. CI uses two workers. Merging the follow-up draft remains a separate action.

## Shared behavior and interfaces

- Keep React, Vite, JavaScript, current appearance and the 25 × 15 grid.
- `runSearch(board, algorithm)` returns `{ visitedOrder, path, found, cost }`.
- Paths include endpoints; unreachable results have an empty path and null cost.
- Move up/right/down/left without row wrapping or crossing walls.
- Cell entry costs: normal 1, weighted 5, excluding the starting cell. BFS selects fewest moves, ignoring weights, but reports weighted route cost.
- Count unique processed visits including endpoints. Path length counts moves. Path length/cost display “—” before completion or when unreachable.
- Clear search cancels playback and preserves terrain/endpoints. Reset also restores initial terrain/endpoints. Stop retains partial results; Step advances one event while paused. Each run takes a fresh snapshot.
- Defer backend/accounts/hosting, save/load, undo/redo, grid resizing, diagonal movement and side-by-side comparison.

## Local commands

Use `npm.cmd ci`, `npm.cmd run dev`, `npm.cmd test`, and `npm.cmd run build` on Windows. `npm.cmd run test:watch` starts the interactive test runner.
