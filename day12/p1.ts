import { readFile } from 'fs/promises'

type Position = { x: number, y: number };

(async () => {
  let input = await readFile('./input.txt', { encoding: 'utf8' });
  const matrix = input
    .replace('\r', '')
    .split('\n');

  const h = matrix.length;
  const w = matrix[0].length;
  const processedPositions: Position[] = [];


})();
