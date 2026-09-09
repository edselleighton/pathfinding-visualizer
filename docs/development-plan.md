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

## September 10 — saved backlog, not automatically scheduled

Branch: `feature/complete-pathfinding-visualizer`.
If today's PR is unmerged, branch from it and target it with tomorrow's PR.
After today's merge, retarget tomorrow's PR to `main`.

1. [ ] Dijkstra and A*: reuse the search contract/playback controller; stable priority queue and Manhattan heuristic for A*. Test longer-but-cheaper weighted routes and agreement on minimum cost.
2. [ ] DFS and greedy best-first search: greedy uses Manhattan distance without accumulated cost. Explain weight handling and optimality guarantees for all algorithms.
3. [ ] Maze generation: explicit Generate button, random walls at 25% density and recursive division with passages. Replace terrain/results, preserve open endpoints, permit unsolvable boards. Inject randomness for reproducible tests. Disable Generate for None.
4. [ ] Editing/accessibility: mouse/pen drag painting with a fixed paint/remove mode per stroke; click/tap endpoint placement; one keyboard grid entry point with arrow navigation and Enter/Space editing; visible endpoint/weight symbols. Verify live announcements and narrow layouts.
5. [ ] Finish README and in-app guide; add GitHub Actions for locked dependency installation, tests and build; add Playwright smoke tests.
6. [ ] Verify all five algorithms terminate, paths are valid, weighted algorithms minimize cost, maze invariants hold, and keyboard/drag/touch, themes, reduced motion and narrow layouts work.
7. [ ] Verify fresh install/build and complete user flow without browser errors; publish tomorrow's draft PR with actual validation results.

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
