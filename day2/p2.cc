#include <cmath>
#include <cstdlib>
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

using std::cout, std::endl;
using std::ifstream, std::ios;
using std::string;
using std::vector;

bool isVectorValid(vector<int> set) {
  bool isIncreasing{};
  int lastVal{};

  for (int i{}; i < set.size(); i++) {
    int value{set[i]};
    if (i > 0) {
      if (i == 1) {
        isIncreasing = lastVal < value;
      }
      if ((isIncreasing && lastVal > value) ||
          (!isIncreasing && lastVal < value)) {
        cout << "!! increase failure" << i << "-" << value;
        return false;
      }
      if (lastVal == value) {
        cout << "!! equal failure" << i << "-" << value;
        return false;
      }
      if (std::abs(value - lastVal) > 3) {
        cout << "!! too great shit" << i << "-" << value;
        return false;
      }
    }
    lastVal = value;
  }

  return true;
}

int main() {
  ifstream file{};
  file.open("input.txt", ios::in);

  string t{};
  vector<vector<int>> lines{};
  while (getline(file, t, '\n')) {
    vector<int> v{};
    string u{};
    std::stringstream ss{t};
    while (getline(ss, u, ' ')) {
      v.push_back(std::stoi(u));
    }

    lines.push_back(v);
  }

  int safeCount{};

  for (vector<int> set : lines) {
    for (auto i : set)
      cout << i << ' ';
    cout << '\n';

    bool isSafe{isVectorValid(set)};

    if (!isSafe) {
      for (int skip{}; skip < set.size(); skip++) {
        cout << "UNSAFE - trying: ";
        vector<int> afterSkip{};
        for (int i{}; i < set.size(); i++) {
          if (i != skip)
            afterSkip.push_back(set[i]);
        }

        for (auto i : afterSkip)
          cout << i << ' ';
        cout << '\n';

        if (isVectorValid(afterSkip)) {
          cout << "FOUND safe combination" << '\n';
          isSafe = true;
          break;
        }
      }
    } else {
      cout << "SAFE!!" << '\n';
    }

    safeCount += isSafe;
  }

  cout << "RESULT: " << safeCount << endl;

  return 0;
}
