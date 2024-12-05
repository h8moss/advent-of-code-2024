#include <array>
#include <cmath>
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

using std::array;
using std::cout;
using std::endl;
using std::getline;
using std::ifstream;
using std::ios;
using std::string;
using std::stringstream;
using std::vector;

int main() {
  vector<array<int, 2>> rules{};
  vector<vector<int>> updates{};

  ifstream file{};
  file.open("input.txt", ios::in);

  string t{};
  bool addingRules{true};
  while (getline(file, t)) {
    if (t == "") {
      addingRules = false;
    }

    if (addingRules) {
      rules.push_back({std::stoi(t.substr(0, t.find('|'))),
                       std::stoi(t.substr(t.find('|') + 1, t.length() - 1))});

    } else {
      stringstream ss{t};
      string v{};
      vector<int> update{};
      while (getline(ss, v, ',')) {
        update.push_back(std::stoi(v));
      }
      updates.push_back(update);
    }
  }

  int sum{};
  for (vector<int> upd : updates) {
    bool isCorrect{true};
    cout << "(" << upd.size() << ") CHECKING: ";
    for (auto i : upd)
      cout << i << ',';
    cout << '\n';
    if (upd.size() < 2) {
      if (upd.size() == 1) {
        sum += upd[0];
      }
      continue;
    }
    for (int current{}; current < (upd.size() - 1); current++) {
      for (int next{current + 1}; next < upd.size(); next++) {
        for (array<int, 2> rule : rules) {
          if (rule[0] == upd[next] && rule[1] == upd[current]) {
            cout << "Rule " << rule[0] << '|' << rule[1] << " BROKEN\n";
            isCorrect = false;
            break;
          }
        }
        if (!isCorrect)
          break;
      }
      if (!isCorrect)
        break;
    }
    if (isCorrect) {
      sum += upd[std::floor(upd.size() / 2)];
    }
  }

  cout << "RESULT: " << sum << endl;

  return 0;
}
