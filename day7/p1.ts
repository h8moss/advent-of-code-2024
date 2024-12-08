import { readFile } from 'fs/promises';

type TreeNode = {
  value: number,
  sum?: TreeNode,
  mul?: TreeNode,
  leaf: boolean,
};

const flattenTree = (tree: TreeNode): number[] => {
  if (tree.leaf) {
    return [tree.value];
  } else {
    return [
      ...flattenTree(tree.mul!).map(v => v * tree.value),
      ...flattenTree(tree.sum!).map(v => v + tree.value)
    ]
  }
}

const createTree = (ogList: number[]): TreeNode | undefined => {
  const list = [...ogList];

  if (list.length === 0) return undefined;
  const head = list.shift();
  if (list.length < 1) {
    return {
      value: head ?? 0,
      leaf: true,
    }
  } else {
    const c = createTree(list);
    return {
      value: head ?? 0,
      leaf: false,
      sum: c,
      mul: c
    };
  }
};

(async () => {
  const txt = await readFile('./input.txt', { encoding: 'utf8' });

  let sum = 0;
  let equations = txt.split('\n');

  for (const equation of equations) {
    console.log(equation);
    const result = Number.parseInt(equation.split(':')[0]);
    const parts = equation.split(' ').filter((_, i) => i !== 0).map(v => Number.parseInt(v));
    parts.reverse(); // reverse so it evaluates Left to Right
    const tree = createTree(parts);
    if (tree) {
      for (const value of flattenTree(tree)) {
        console.log('ATTEMPTING: ', value);
        if (value === result) {
          sum += value;
          console.log("Found 'er")
          break;
        }
      }
    }
  }

  console.log('RESULT: ', sum);
})();

