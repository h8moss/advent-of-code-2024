import { readFile } from 'fs/promises';

const logDisk = (disk: (number | null)[]) => {
  let txt = '';
  for (let item of disk) {
    txt += item === null ? '.' : item.toString();
  }
  console.log(txt);
}

(async () => {
  let txt = await readFile('./input.txt', { encoding: 'utf8' });
  txt = txt.replace(/\n|\r/g, '').trim();

  let diskItems: (number | null)[] = [];
  let addingNull = false;
  let currentId = 0;
  for (let i = 0; i < txt.length; i++) {
    const n = Number.parseInt(txt[i]);
    for (let _ = 0; _ < n; _++) {
      if (addingNull) diskItems.push(null);
      else diskItems.push(currentId);
    }

    if (!addingNull) currentId++;
    addingNull = !addingNull;
  }

  for (let moveIndex = diskItems.length - 1; moveIndex >= 0; moveIndex--) {
    if (diskItems[moveIndex] !== null) {
      for (let targetIndex = 0; targetIndex < moveIndex; targetIndex++) {
        if (diskItems[targetIndex] === null) {
          let temp = diskItems[moveIndex];
          diskItems[moveIndex] = diskItems[targetIndex];
          diskItems[targetIndex] = temp;

          break;
        }
      }
    }
  }

  console.log(diskItems.reduce<number>((sum, val, index) => sum + ((val ?? 0) * index), 0));
})();
