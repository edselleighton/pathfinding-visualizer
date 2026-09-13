# Pathfinding Visualizer

An interactive pathfinding visualizer for exploring how search algorithms navigate a grid, compare routes, and respond to obstacles.

## Features

- Editable 25 × 15 grid with start/target, walls, weights, mouse/pen painting and touch tapping.
- BFS, DFS, Dijkstra, A*, and greedy best-first search.
- Animated visits and routes; Run, Pause/Resume, Step, Stop, and adjustable speed.
- Random walls and recursive-division mazes.
- Live statistics, keyboard grid navigation, light/dark themes and reduced-motion support.

## Controls

Choose a tool, then click or tap cells. Drag with a mouse or pen to paint walls/weights or erase. Starting on an existing wall or weight removes terrain for that stroke. Place start/target with a single click or tap; endpoints cannot overlap or be painted over.

Tab into the grid, navigate with arrow keys, and use Enter/Space to apply the tool. S and T identify endpoints; 5 identifies weighted cells.

Run searches the current board. Pause/Resume controls animation; Step advances one cell while paused. Stop retains partial results. Editing, algorithm changes and maze generation are locked during playback. Speed remains adjustable: Slow 80 ms, Normal 25 ms, Fast 5 ms per event. Reduced-motion preferences display results immediately.

Clear search preserves terrain/endpoints. Reset board restores the empty initial board. Selecting a maze does nothing until Generate is pressed; generation replaces terrain, clears results and preserves endpoints. Random walls use a 25% probability; either pattern may leave no route.

## Algorithms and statistics

| Algorithm | Strategy | Guarantee |
| --- | --- | --- |
| BFS | Search in layers; ignore weights | Fewest moves |
| DFS | Explore a branch, then backtrack; ignore weights | No shortest-route guarantee |
| Dijkstra | Lowest accumulated cost first | Minimum cost |
| A* | Accumulated cost plus Manhattan distance | Minimum cost |
| Greedy | Manhattan distance only; ignore weights and accumulated cost | No shortest-route guarantee |

Movement is four-directional. Entering a normal cell costs 1 and a weighted cell costs 5; the starting cell is excluded. Every algorithm reports its route's weighted cost, even when weights do not affect its search. Run different algorithms on the same board to compare their results.

Visited counts unique processed cells, including endpoints when processed. Path length counts moves. Computation time excludes playback. Unfinished or unreachable paths show “—” for length/cost.

## Development

```bash
npm ci
npm run dev
```

Use Node.js 24 LTS and open the localhost URL printed by Vite. In Windows PowerShell, use `npm.cmd` in place of `npm` if script execution is disabled.

```bash
npm test
npm run build
npm run preview
npx playwright install chromium
npm run test:e2e
```

`npm run test:watch` watches unit/component tests. Browser tests start their own server on port 5176; leave that port free. GitHub Actions runs installation, tests, build, and Chromium browser tests for PRs and pushes to main.

The app is local and client-only; there are no accounts or saved boards. Refreshing discards edits. See `docs/development-plan.md` for implementation history and deferred features.
