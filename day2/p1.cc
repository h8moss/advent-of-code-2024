#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

using std::cout, std::endl;
using std::ifstream, std::ios;
using std::string;
using std::vector;

int main() {
  ifstream file{};
  file.open("input.txt", ios::in);

  string t{};
  vector<string> split{};
  while (getline(file, t, '\n')) {
    split.push_back(t);
  }

  int safeCount{};

  for (string set : split) {
    bool isSafe{true};
    bool isIncreasing{};

    cout << set << endl;

    int lastVal{};
    int val{};
    std::stringstream ss{set};
    string s{};

    int i{};

    while (getline(ss, s, ' ')) {
      val = std::stoi(s);
      if (i > 0) {
        if (i == 1) {
          isIncreasing = lastVal < val;
        }
        if ((isIncreasing && lastVal > val) ||
            (!isIncreasing && lastVal < val)) {
          cout << (isIncreasing ? " - Not increasing" : " - Not decreasing");
          isSafe = false;
          break;
        }
        if (lastVal == val) {
          cout << " - Identical values";
          isSafe = false;
          break;
        }
        if (isIncreasing && val - lastVal > 3 ||
            !isIncreasing && lastVal - val > 3) {
          cout << " - Too great difference";
          isSafe = false;
          break;
        }
      }
      lastVal = val;
      i++;
    }

    cout << endl;
    safeCount += isSafe;
  }

  cout << "RESULT: " << safeCount << endl;

  return 0;
}
