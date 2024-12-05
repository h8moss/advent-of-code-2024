#include <algorithm>
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

  vector<int> changedUpdateIndexes{};
  for (int updateIndex{}; updateIndex < updates.size(); updateIndex++) {
    auto upd = updates[updateIndex];
    bool isCorrect{true};
    cout << "CHECKING: ";
    for (auto i : upd)
      cout << i << ',';
    cout << '\n';
    if (upd.size() < 2) {
      continue;
    }
    for (int current{}; current < (upd.size() - 1); current++) {
      for (int next{current + 1}; next < upd.size(); next++) {
        for (array<int, 2> rule : rules) {
          if (rule[0] == upd[next] && rule[1] == upd[current]) {
            cout << "ERROR BY " << rule[0] << '|' << rule[1] << " -- Swapping "
                 << upd[current] << " and " << upd[next] << '\n';

            int temp{upd[current]};
            upd[current] = upd[next];
            upd[next] = temp;
            updates[updateIndex][current] = updates[updateIndex][next];
            updates[updateIndex][next] = temp;

            if (std::count(changedUpdateIndexes.begin(),
                           changedUpdateIndexes.end(), updateIndex) == 0) {
              changedUpdateIndexes.push_back(updateIndex);
            }

            current = 0;
            next = 1;
          }
        }
      }
    }
  }

  int sum{};
  for (int i : changedUpdateIndexes) {
    int mid{(int)std::floor(updates[i].size() / 2)};

    for (int x{}; x < updates[i].size(); x++) {
      auto v{updates[i][x]};
      if (x == mid) {
        cout << "**" << v << "**, ";
      } else {
        cout << v << ", ";
      }
    }

    cout << '\n';

    sum += updates[i][mid];
  }

  cout << "RESULT: " << sum << endl;

  return 0;
}
