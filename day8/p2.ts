import { readFile } from 'fs/promises';

type Position = {
  x: number,
  y: number
};

(async () => {
  const text = await readFile("./input.txt", { encoding: 'utf8' });
  const split = text.split('\n').map(v => v.replace('\r', '')).filter(v => v.trim().length > 0);

  const w = split[0].length;
  const h = split.length;
  const antennaLocations: Record<string, Position[]> = {};

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if ('abcdefghijklmnopqrstuvwxyz0123456789'.includes(split[y][x].toLowerCase())) {
        if (antennaLocations[split[y][x]] !== undefined) {
          antennaLocations[split[y][x]].push({ x, y });
        } else {
          antennaLocations[split[y][x]] = [{ x, y }];
        }
      }
    }
  }

  let antiNodeLocations: Position[] = [];

  for (let antennaTypeIndex = 0; antennaTypeIndex < Object.keys(antennaLocations).length; antennaTypeIndex++) {
    let antennaType = Object.keys(antennaLocations)[antennaTypeIndex];
    const locations = antennaLocations[antennaType];
    console.log(`${antennaTypeIndex} / ${Object.keys(antennaLocations).length}`);
    for (let i1 = 0; i1 < locations.length; i1++) {
      for (let i2 = 0; i2 < locations.length; i2++) {
        if (i1 === i2) continue;

        const firstAntenna = locations[i1];
        const secondAntenna = locations[i2];

        const locationDifference = {
          x: firstAntenna.x - secondAntenna.x,
          y: firstAntenna.y - secondAntenna.y
        }

        for (let multiplier = 0; multiplier < 71; multiplier++) {

          const add = {
            x: firstAntenna.x + locationDifference.x * multiplier,
            y: firstAntenna.y + locationDifference.y * multiplier,
          };
          const sub = {
            x: firstAntenna.x - locationDifference.x * multiplier,
            y: firstAntenna.y - locationDifference.y * multiplier,
          };

          if (!antiNodeLocations.some(l => l.x === add.x && l.y === add.y)) {
            antiNodeLocations.push(add);
          }
          if (!antiNodeLocations.some(l => l.x === sub.x && l.y === sub.y)) {
            antiNodeLocations.push(sub);
          }
        }
      }
    }
  }

  antiNodeLocations = antiNodeLocations.filter(v => v.x >= 0 && v.x < w && v.y >= 0 && v.y < h);

  console.log(antiNodeLocations.length);
})();
