#include <fstream>
#include <iostream>
#include <map>
#include <vector>

using std::cout, std::endl;

using std::ifstream, std::ios;

using std::vector;

using std::map;

int main() {
  ifstream file{};
  file.open("input.txt", ios::in);

  int a{};
  int b{};

  map<int, int> appearances{};
  vector<int> leftValues{};

  while (file >> a >> b) {
    if (appearances.count(b)) {
      appearances[b]++;
    } else {
      appearances[b] = 1;
    }

    leftValues.push_back(a);
  }

  int sum{};
  for (int item : leftValues) {
    if (appearances.count(item)) {
      sum += item * appearances[item];
    }
  }

  cout << "RESULT: " << sum << endl;

  file.close();
  return 0;
}
