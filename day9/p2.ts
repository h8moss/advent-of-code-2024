import { readFile, writeFile } from 'fs/promises';

const logDisk = (disk: (number | null)[]) => {
  let txt = '';
  for (let item of disk) {
    txt += item === null ? '.' : item.toString();
  }
  txt += '\n';
  return txt;
}

(async () => {
  let txt = await readFile('./input.txt', { encoding: 'utf8' });
  txt = txt.replace(/\n|\r/g, '').trim();

  let diskItems: (number | null)[] = [];
  let addingNull = false;
  let currentId = 0;

  const idLocations: Record<number, { start: number, length: number }> = {};
  const emptySpaces = [];

  for (let i = 0; i < txt.length; i++) {
    const n = Number.parseInt(txt[i]);
    if (!addingNull) {
      idLocations[currentId] = {
        start: diskItems.length,
        length: n,
      }
    } else {
      emptySpaces.push({
        start: diskItems.length,
        length: n,
      });
    }
    for (let _ = 0; _ < n; _++) diskItems.push(addingNull ? null : currentId);

    if (!addingNull) currentId++;
    addingNull = !addingNull;
  }

  for (let id = currentId - 1; id >= 0; id--) {
    const location = idLocations[id];
    for (let emptyI = 0; emptyI < emptySpaces.length; emptyI++) {
      const empty = emptySpaces[emptyI];
      if (empty.start > location.start) break;
      if (empty.length >= location.length) {
        let removed = 0;
        for (let i = 0; i < location.length; i++) {
          const temp = diskItems[location.start + i];
          diskItems[location.start + i] = null;
          diskItems[empty.start + i] = temp;
          removed++;
        }

        emptySpaces[emptyI].start += removed;
        emptySpaces[emptyI].length -= removed;
        break;
      }
    }
    /*     
     * await writeFile(`./logs/${id}.log`, logDisk(diskItems));
     */
  }

  console.log(diskItems.reduce<number>((sum, val, index) => sum + ((val ?? 0) * index), 0));
})();
