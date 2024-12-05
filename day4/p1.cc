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

bool itemsExist(vector<vector<int>> v, int x, int y) {
  if (x < 0 || y < 0)
    return false;
  if (x >= v.size() || y >= v[x].size())
    return false;

  return true;
}

bool isXmas(int x, int m, int a, int s) {
  return x == 0 && m == 1 && a == 2 && s == 3;
}

int main() {
  ifstream file{};
  file.open("input.txt", ios::in);

  string t{};
  vector<vector<int>> matrix{};
  while (getline(file, t)) {
    vector<int> v{};
    for (int i{}; i < t.length(); i++) {
      char c{t[i]};
      // XMAS => 0123
      if (c == 'X')
        v.push_back(0);
      else if (c == 'M')
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

  int xMasCount{};

  for (int x{}; x < matrix.size(); x++) {
    for (int y{}; y < matrix[x].size(); y++) {
      if (matrix[x][y] == 0) {
        // check TL
        if (itemsExist(matrix, x - 3, y - 3)) {
          xMasCount += isXmas(matrix[x][y], matrix[x - 1][y - 1],
                              matrix[x - 2][y - 2], matrix[x - 3][y - 3]);
        }
        // check TM
        if (itemsExist(matrix, x, y - 3)) {
          xMasCount += isXmas(matrix[x][y], matrix[x][y - 1], matrix[x][y - 2],
                              matrix[x][y - 3]);
        }
        // check TR
        if (itemsExist(matrix, x + 3, y - 3)) {
          xMasCount += isXmas(matrix[x][y], matrix[x + 1][y - 1],
                              matrix[x + 2][y - 2], matrix[x + 3][y - 3]);
        }
        // check ML
        if (itemsExist(matrix, x - 3, y)) {
          xMasCount += isXmas(matrix[x][y], matrix[x - 1][y], matrix[x - 2][y],
                              matrix[x - 3][y]);
        }
        // check MR
        if (itemsExist(matrix, x + 3, y)) {
          xMasCount += isXmas(matrix[x][y], matrix[x + 1][y], matrix[x + 2][y],
                              matrix[x + 3][y]);
        }
        // check BL
        if (itemsExist(matrix, x - 3, y + 3)) {
          xMasCount += isXmas(matrix[x][y], matrix[x - 1][y + 1],
                              matrix[x - 2][y + 2], matrix[x - 3][y + 3]);
        }
        // check BM
        if (itemsExist(matrix, x, y + 3)) {
          xMasCount += isXmas(matrix[x][y], matrix[x][y + 1], matrix[x][y + 2],
                              matrix[x][y + 3]);
        }
        // check BR
        if (itemsExist(matrix, x + 3, y + 3)) {
          xMasCount += isXmas(matrix[x][y], matrix[x + 1][y + 1],
                              matrix[x + 2][y + 2], matrix[x + 3][y + 3]);
        }
      }
    }
  }

  cout << "RESULT: " << xMasCount << endl;
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
