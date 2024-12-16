import { readFile } from "fs/promises";

type Position = {
  x: number,
  y: number,
}

const moveAlong = (matrix: number[][], { x, y }: Position): Position[] => {
  const value = matrix[y][x]
  if (value === 9) return [{ x, y }]
  else {
    let result: Position[] = []
    if (matrix[y][x + 1] === value + 1) result = [...result, ...moveAlong(matrix, { x: x + 1, y })];
    if (matrix[y][x - 1] === value + 1) result = [...result, ...moveAlong(matrix, { x: x - 1, y })];
    if (matrix[y - 1] !== undefined && matrix[y - 1][x] === value + 1) result = [...result, ...moveAlong(matrix, { x, y: y - 1 })];
    if (matrix[y + 1] !== undefined && matrix[y + 1][x] === value + 1) result = [...result, ...moveAlong(matrix, { x, y: y + 1 })];

    return result;
  }
}

const getTrailHeads = (matrix: number[][]) => {
  const trailHeads: {
    score?: number,
    pos: Position
  }[] = [];
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const trail = matrix[y][x];
      if (trail === 0) {
        trailHeads.push({ pos: { x, y } });
      }
    }
  }

  for (const trailhead of trailHeads) {
    const { x, y } = trailhead.pos;

    trailhead.score =
      moveAlong(matrix, { x, y })
        .filter((pos, index, array) => array.findIndex(item => item.x === pos.x && item.y === pos.y) === index)
        .length;
  }

  return trailHeads;
}

(async () => {
  const txt = await readFile('./input.txt', { encoding: 'utf8' });
  const lines = txt.split('\n');

  const matrix: number[][] = lines.map(l => l.split('').map(v => Number.parseInt(v)));
  const trailHeads = getTrailHeads(matrix);
  console.log(trailHeads.reduce<number>((prev, curr) => prev + (curr.score ?? 0), 0));
})();
