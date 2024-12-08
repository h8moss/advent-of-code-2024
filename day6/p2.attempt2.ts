import { readFile } from 'fs/promises';
import internal from 'stream';

type Position = {
  x: number,
  y: number,
}

type Orientation = 'T' | 'B' | 'R' | 'L';

type Guard = {
  position: Position,
  orientation: Orientation
}

const getNextPosition = (guard: Guard) => {
  let addX = 0;
  let addY = 0;
  switch (guard.orientation) {
    case 'T':
      addY = -1;
      break;
    case 'B':
      addY = 1;
      break;
    case 'R':
      addX = 1;
      break;
    case 'L':
      addX = -1;
      break;
  }
  return {
    x: guard.position.x + addX,
    y: guard.position.y + addY
  }
}

const nextOrientation = (o: Orientation): Orientation => {
  switch (o) {
    case 'T': return 'R';
    case 'R': return 'B';
    case 'B': return 'L';
    case 'L': return 'T';
  }
}

const checkLoops = (w: number, h: number, obstacles: Position[], trueGuard: Guard) => {
  let guardPositions: Guard[] = [];
  let guard = structuredClone(trueGuard);
  while (true) {
    // if guard is outside of bounds, return false
    if (guard.position.x < 0 || guard.position.x >= w || guard.position.y < 0 || guard.position.y >= h) return false;
    // if guard is somewhere he's been in, return true
    if (guardPositions.some(pos =>
      pos.position.x === guard.position.x
      && pos.position.y === guard.position.y
      && pos.orientation === guard.orientation
    )) return true;
    // add guard to list
    guardPositions.push(structuredClone(guard));
    // move guard
    const nextPos = getNextPosition(guard)
    if (obstacles.some(o => o.x === nextPos.x && o.y === nextPos.y)) {
      guard.orientation = nextOrientation(guard.orientation);
    } else {
      guard.position = nextPos;
    }
  }
}

const printProgress = (current: number, total: number) => {
  const progressSize = 50;
  const progress = current / total;
  const filled = progressSize * progress;
  process.stdout.write("\r[");
  for (let i = 0; i < progressSize; i++) {
    if (i <= filled) {
      process.stdout.write('*');
    } else {
      process.stdout.write(' ');
    }
  }
  process.stdout.write("] - " + (progress * 100).toFixed(2) + '%');
}

(async () => {
  const txt = await readFile('./input.txt', { encoding: 'utf8' });
  const split = txt.split('\n').map(v => v.replace('\r', '')).filter(v => v.trim().length > 0);

  const w = split[0].length;
  const h = split.length;
  let trueObstacles = [];
  let guard: Guard = {
    position: { x: 0, y: 0 },
    orientation: 'T'
  }

  for (let y = 0; y < split.length; y++) {
    for (let x = 0; x < split[y].length; x++) {
      const c = split[y][x];
      if (c === '#') trueObstacles.push({ x, y });
      else if (c === '^' || c === 'v' || c === '>' || c === '<') {
        guard.position = { x, y };
        switch (c) {
          case '>':
            guard.orientation = 'R';
            break;
          case 'v':
            guard.orientation = 'B';
            break;
          case '<':
            guard.orientation = 'L';
            break;
          case '^':
            guard.orientation = 'T';
            break;
        }
      }
    }
  }


  let loopCount = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      printProgress(x + y * h, w * h);
      if (trueObstacles.some(v => v.x === x && v.y === y)) continue;
      if (guard.position.x === x && guard.position.y === y) continue;
      let obstacles = [
        ...trueObstacles,
        { x, y }
      ];

      loopCount += (
        checkLoops(w, h, obstacles, guard)
          ? 1
          : 0
      );
    }
  }

  console.log('\n---\n');
  console.log(loopCount);
})();
