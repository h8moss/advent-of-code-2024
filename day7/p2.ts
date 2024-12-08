import { readFile } from 'fs/promises';

type TreeNode = {
  value: number,
  sum?: TreeNode,
  mul?: TreeNode,
  concat?: TreeNode,
  leaf: boolean,
};

const flattenTree = (tree: TreeNode, target: number): number[] => {
  if (tree.leaf) {
    return [tree.value];
  } else {
    return [
      ...flattenTree(tree.mul!, target).map(v => v * tree.value),
      ...flattenTree(tree.sum!, target).map(v => v + tree.value),
      ...flattenTree(tree.concat!, target).map(v => Number.parseInt(`${v}${tree.value}`))
    ];
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
      mul: c,
      concat: c,
    };
  }
};

const showProgress = (current: number, total: number, message: string) => {
  const totalItems = 50;
  const progress = current / total;
  const coloredItems = totalItems * progress;
  process.stdout.write('\r[');
  for (let i = 0; i < totalItems; i++) {
    if (i < coloredItems) {
      process.stdout.write('*');
    } else {
      process.stdout.write(' ');
    }
  }
  process.stdout.write(`] ${(progress * 100).toFixed(2)}% ${message}`);
}

(async () => {
  const txt = await readFile('./input.txt', { encoding: 'utf8' });

  let sum = 0;
  let equations = txt.split('\n');

  for (let eqIndex = 0; eqIndex < equations.length; eqIndex++) {
    let equation = equations[eqIndex];
    console.log(`(${eqIndex} / ${equations.length}) ${equation}`);
    const result = Number.parseInt(equation.split(':')[0]);
    const parts = equation.split(' ').filter((_, i) => i !== 0).map(v => Number.parseInt(v));
    parts.reverse(); // reverse so it evaluates Left to Right
    const tree = createTree(parts);
    if (tree) {
      const flattened = flattenTree(tree, result);
      for (let i = 0; i < flattened.length; i++) {
        const value = flattened[i];
        if (value === result) {
          sum += value;
          console.log('Found result');
          break;
        }
      }
    }
  }

  console.log('\nRESULT: ', sum);
})();


/*
 * Optimization: You don't need to check all multiplication and addition, if a number is too high, it is not the correct answer.
 *
 * ALSO THE REAL RESULT IS BIGGER THAN: 18218362189384
 */
