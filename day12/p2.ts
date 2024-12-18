import { readFile } from 'fs/promises';

type Position = {
  x: number, y: number
}

const posEq = (a: Position, b: Position) => {
  return a.x === b.x && a.y === b.y;
}

(async () => {
  const input = await readFile('./input.txt', { encoding: 'utf8' });
  const matrix = input
    .replace('\r', '')
    .split('\n');

  const h = matrix.length;
  const w = matrix[0].length;

  const areas: Record<number, number> = {}
  const corners: Record<number, number> = {}
  const visited: Position[] = []

  let currentID = 0;

  const positionExists = (position: Position) => {
    return position.x >= 0 && position.y >= 0 && position.x < w && position.y < h
  }

  const valueOrNull = (p: Position) => {
    if (positionExists(p)) return matrix[p.y][p.x];
    return null;
  }

  const getNeighbours = (p: Position) => {
    return {
      tl: valueOrNull({ x: p.x - 1, y: p.y - 1 }),
      tm: valueOrNull({ x: p.x, y: p.y - 1 }),
      tr: valueOrNull({ x: p.x + 1, y: p.y - 1 }),
      ml: valueOrNull({ x: p.x - 1, y: p.y }),
      mr: valueOrNull({ x: p.x + 1, y: p.y }),
      bl: valueOrNull({ x: p.x - 1, y: p.y + 1 }),
      bm: valueOrNull({ x: p.x, y: p.y + 1 }),
      br: valueOrNull({ x: p.x + 1, y: p.y + 1 }),
    }
  }

  const checkPosition = (pos: Position, id: number) => {
    if (!positionExists(pos)) return;
    if (visited.findIndex((p) => posEq(p, pos)) !== -1) { return; }
    visited.push(pos);

    const value = valueOrNull(pos);
    areas[id] += 1
    const neighbourLocations = getNeighbours(pos);
    const neighbours = Object.fromEntries(
      Object.entries(neighbourLocations).map(([k, v]) => [k, v === value])
    );

    let cornerCount = 0;
    // TL
    if ((!neighbours.tl && neighbours.tm && neighbours.ml) || (!neighbours.ml && !neighbours.tm)) cornerCount++;
    // TR
    if ((!neighbours.tr && neighbours.tm && neighbours.mr) || (!neighbours.mr && !neighbours.tm)) cornerCount++;
    // BL
    if ((!neighbours.bl && neighbours.bm && neighbours.ml) || (!neighbours.ml && !neighbours.bm)) cornerCount++;
    // BR
    if ((!neighbours.br && neighbours.bm && neighbours.mr) || (!neighbours.mr && !neighbours.bm)) cornerCount++;

    if (cornerCount > 0) console.log({ cornerCount, pos, id });

    corners[id] += cornerCount;

    const { x, y } = pos;
    for (let dPos of [
      { x: x + 1, y: y },
      { x: x - 1, y: y },
      { x: x, y: y + 1 },
      { x: x, y: y - 1 },
    ]) {
      if (valueOrNull(dPos) === value) checkPosition(dPos, id);
    }
  }

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[0].length; x++) {
      if (visited.findIndex((p) => posEq(p, { x, y })) !== -1) { continue; }
      areas[currentID] = 0;
      corners[currentID] = 0;
      checkPosition({ x, y }, currentID);

      currentID++;
    }
  }
  let sum = 0

  for (let id = 0; id < currentID; id++) {
    console.log({
      area: areas[id],
      corner: corners[id],
      sum
    });
    sum += areas[id] * corners[id];
  }

  console.log('==================================')
  console.log(sum);
  console.log('==================================')
})();
