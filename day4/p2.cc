#include <fstream>
#include <iostream>
#include <string>
#include <vector>

using std::vector;

using std::ifstream;
using std::ios;

using std::string;

using std::cout;
using std::endl;

bool crossExists(vector<vector<int>> v, int x, int y) {
  if (x <= 0 || y <= 0)
    return false;
  if (x >= v.size() - 1)
    return false;
  if (y >= v[x].size() - 1)
    return false;

  return true;
}

bool isMas(int m, int a, int s) { return m == 1 && a == 2 && s == 3; }

int main() {
  ifstream file{};
  file.open("input.txt", ios::in);

  string t{};
  vector<vector<int>> matrix{};
  while (getline(file, t)) {
    vector<int> v{};
    for (int i{}; i < t.length(); i++) {
      char c{t[i]};
      // MAS => 123
      if (c == 'M')
        v.push_back(1);
      else if (c == 'A')
        v.push_back(2);
      else if (c == 'S')
        v.push_back(3);
      else {
        v.push_back(5);
      }
    }
    matrix.push_back(v);
  }

  cout << "MATRIX: " << matrix.size() << " x " << matrix[0].size() << '\n';

  int xMasCount{};

  for (int x{}; x < matrix.size(); x++) {
    for (int y{}; y < matrix[x].size(); y++) {
      // if item == A
      if (matrix[x][y] == 2 && crossExists(matrix, x, y)) {
        // check both top to bottom
        if (isMas(matrix[x - 1][y - 1], matrix[x][y], matrix[x + 1][y + 1]) &&
            isMas(matrix[x + 1][y - 1], matrix[x][y], matrix[x - 1][y + 1])) {
          xMasCount++;
        }
        // check mixed, one top to bottom
        if (isMas(matrix[x - 1][y - 1], matrix[x][y], matrix[x + 1][y + 1]) &&
            isMas(matrix[x - 1][y + 1], matrix[x][y], matrix[x + 1][y - 1])) {
          xMasCount++;
        }
        // check mixed, the other one top to bottom
        if (isMas(matrix[x + 1][y + 1], matrix[x][y], matrix[x - 1][y - 1]) &&
            isMas(matrix[x + 1][y - 1], matrix[x][y], matrix[x - 1][y + 1])) {
          xMasCount++;
        }
        // check both bottom to top
        if (isMas(matrix[x - 1][y + 1], matrix[x][y], matrix[x + 1][y - 1]) &&
            isMas(matrix[x + 1][y + 1], matrix[x][y], matrix[x - 1][y - 1])) {
          xMasCount++;
        }
      }
    }
  }

  cout << "RESULT: " << xMasCount << endl;
  return 0;
}

/*
   M.M
   .A.
   S.S

   M.S
   .A.
   M.S

   S.M
   .A.
   S.M

   S.S
   .A.
   M.M
*/
