import { readFile } from 'fs/promises';

type Position = { x: number, y: number };
type Orientation = 'T' | 'R' | 'B' | 'L';

const nextOrientation = (o: Orientation): Orientation => {
  switch (o) {
    case 'T': return 'R';
    case 'R': return 'B';
    case 'B': return 'L';
    case 'L': return 'T';
  }
}


const orientationToMovement = (o: Orientation) => {
  switch (o) {
    case 'R':
      return { x: 1, y: 0 };
    case 'B':
      return { x: 0, y: 1 };
    case 'L':
      return { x: -1, y: 0 };
    case 'T':
      return { x: 0, y: -1 };
  }
}

class Board {
  width: number;
  height: number;
  obstacles: Position[];
  guardPosition: Position = { x: 0, y: 0 };
  guardOrientation: Orientation = 'T';
  initialPosition: Position = { x: 0, y: 0 };
  initialOrientation: Orientation = 'T';

  constructor(boardStr: string) {
    const split = boardStr.split('\n').map(v => v.replace('\r', '')).filter(v => v.trim().length > 0);
    this.width = split[0].length;
    this.height = split.length;
    this.obstacles = [];

    console.log(split)

    for (let y = 0; y < split.length; y++) {
      for (let x = 0; x < split[y].length; x++) {
        const c = split[y][x];
        if (c === '#') this.obstacles.push({ x, y });
        else if (c === '^' || c === 'v' || c === '>' || c === '<') {
          this.guardPosition = { x, y };
          switch (c) {
            case '>':
              this.guardOrientation = 'R';
              break;
            case 'v':
              this.guardOrientation = 'B';
              break;
            case '<':
              this.guardOrientation = 'L';
              break;
            case '^':
              this.guardOrientation = 'T';
              break;
          }
        }
      }
    }
    console.log({
      width: this.width, height: this.height, obstacles: this.obstacles, guardPos: this.guardPosition, guardOrientation: this.guardOrientation
    });
    this.initialPosition = structuredClone(this.guardPosition);
    this.initialOrientation = this.guardOrientation;
  }

  obstacleAt(pos: Position) {
    let index = -1;
    for (let i = 0; i < this.obstacles.length; i++) {
      let o = this.obstacles[i];
      if (o.x === pos.x && o.y === pos.y) {
        index = i;
        break;
      }
    }

    return index;
  }

  posExists(pos: Position) {
    return pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height;
  }

  printBoard(newObs: Position | null = null, path: Position[] = []) {
    for (let y = 0; y < this.height; y++) {
      let txt = ''
      for (let x = 0; x < this.width; x++) {
        if (newObs !== null && x === newObs.x && y === newObs.y) {
          txt += 'O';
        } else if (this.obstacleAt({ x, y }) !== -1) {
          txt += '#'
        } else if (x === this.guardPosition.x && y === this.guardPosition.y) {
          txt += this.guardOrientation;
        } else if (path.some(p => p.x === x && p.y === y)) {
          txt += '+'
        } else {
          txt += '.'
        }
      }
      console.log(txt);
    }
  }

  getGuardPath(extraObstacles: Position[]) {
    this.guardPosition = structuredClone(this.initialPosition);
    this.guardOrientation = this.initialOrientation;
    let path: {
      position: Position,
      orientation: Orientation,
      rotated: boolean,
      exits: boolean,
    }[] = [];

    let nextPos: Position = { x: 0, y: 0 };

    let loopCount = 0;

    while (true) {
      let movement = orientationToMovement(this.guardOrientation);
      nextPos = {
        x: this.guardPosition.x + movement.x,
        y: this.guardPosition.y + movement.y
      };
      if (!this.posExists(nextPos)) { // guard exits
        path.push({
          position: structuredClone(this.guardPosition),
          orientation: this.guardOrientation,
          exits: true,
          rotated: false,
        });
        break;
      } else if (path.some((v) => v.position.x === this.guardPosition.x && v.position.y === this.guardPosition.y && this.guardOrientation === v.orientation && v.rotated === false)) { // LOOPS
        path.push({
          position: structuredClone(this.guardPosition),
          orientation: this.guardOrientation,
          exits: false,
          rotated: false,
        });
        break;
      } else if (this.obstacleAt(nextPos) !== -1
        || extraObstacles.some(v => v.x === nextPos.x && v.y === nextPos.y)
      ) { // Obstacle found
        this.guardOrientation = nextOrientation(this.guardOrientation);
        path.push({
          position: structuredClone(this.guardPosition),
          orientation: this.guardOrientation,
          exits: false,
          rotated: true,
        });
      } else { // Guard advances
        path.push({
          position: structuredClone(this.guardPosition),
          orientation: this.guardOrientation,
          exits: false,
          rotated: false,
        });

        this.guardPosition = nextPos;
      }
      if (loopCount++ >= 10000) {
        console.error('Limit exceded!');
        break;
      }
    }

    return path;
  }

  calculatePossibleLoops() {
    let loopCount = 0;
    const guardPath = this.getGuardPath([]);
    for (let newObstacle of guardPath) {
      console.log(newObstacle);
      let result = this.getGuardPath([newObstacle.position]);
      const last = result[result.length - 1];
      if (!last.exits) { // Loops
        this.printBoard(last.position, result.map(v => v.position));
        loopCount++;
      }
    }

    return loopCount;
  }
}


(async () => {
  const txt = await readFile('./input.test.txt', { encoding: 'utf8' });

  const board = new Board(txt);
  console.log(board.calculatePossibleLoops());

})();
