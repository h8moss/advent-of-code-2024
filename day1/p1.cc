#include <fstream>
#include <iostream>
#include <vector>

using std::cout, std::endl;

using std::ifstream, std::ios;

using std::vector;

class TreeNode {
public:
  TreeNode *left{NULL};
  TreeNode *right{NULL};

  int value{};

  void print() {
    if (left != NULL)
      left->print();
    cout << value << " ";
    if (right != NULL)
      right->print();
  }

  int size() {
    return 1 + (left == NULL ? 0 : left->size()) +
           (right == NULL ? 0 : right->size());
  }

  vector<int> flat() {
    vector<int> result{};
    result.reserve(size());

    if (left != NULL) {
      auto l = left->flat();
      for (int item : l) {
        result.push_back(item);
      }
    }
    result.push_back(value);
    if (right != NULL) {
      auto r = right->flat();
      for (int item : r) {
        result.push_back(item);
      }
    }

    return result;
  }
};

TreeNode *insertToTree(TreeNode *t, int item) {
  if (t == NULL) {
    auto node = new TreeNode();
    node->value = item;
    return node;
  } else {
    if (t->value > item) {
      t->left = insertToTree(t->left, item);
    } else {
      t->right = insertToTree(t->right, item);
    }
    return t;
  }
}

int main() {
  ifstream file{};
  file.open("input.txt", ios::in);

  int a{};
  int b{};

  TreeNode *aTree{};
  TreeNode *bTree{};

  while (file >> a >> b) {
    aTree = insertToTree(aTree, a);
    bTree = insertToTree(bTree, b);
  }

  aTree->print();
  cout << endl;
  bTree->print();
  cout << '\n';

  vector<int> vA{aTree->flat()};
  vector<int> vB{bTree->flat()};

  int sum{};

  for (int i{}; i < vA.size(); i++) {
    int diff{};
    if (vA[i] < vB[i]) {
      diff = vB[i] - vA[i];

      cout << vB[i] << " - " << vA[i] << " = " << diff << '\n';
    } else {
      diff = vA[i] - vB[i];

      cout << vA[i] << " - " << vB[i] << " = " << diff << '\n';
    }
    sum += diff;
  }
  cout << '\n';
  cout << "RESULT: " << sum;
  cout << endl;

  file.close();

  return 0;
}
