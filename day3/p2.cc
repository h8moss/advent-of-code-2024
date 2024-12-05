#include <fstream>
#include <iostream>
#include <regex>
#include <sstream>
#include <string>

std::string slurp(std::ifstream &in) {
  std::ostringstream sstr;
  sstr << in.rdbuf();
  return sstr.str();
}

int main() {
  std::ifstream file{};
  file.open("input.txt", std::ios::in);

  std::string input{slurp(file)};

  std::regex regex(
      "(?:mul\\((\\d{1,3}),(\\d{1,3})\\))|(?:do\\(\\))|(?:don't\\(\\))");

  std::smatch match;

  std::string::const_iterator searchStart{input.cbegin()};

  int sum{};
  bool shouldDo{true};

  while (std::regex_search(searchStart, input.cend(), match, regex)) {
    auto fullMatch{match.str()};
    if (fullMatch == "do()") {
      shouldDo = true;
    } else if (fullMatch == "don't()") {
      shouldDo = false;
    } else if (shouldDo) {
      int a{std::stoi(match.str(1))};
      int b{std::stoi(match.str(2))};

      std::cout << a << " * " << b << " = " << a * b << '\n';
      sum += a * b;
    }
    searchStart = match.suffix().first;
  }

  std::cout << "Result: " << sum << std::endl;

  return 0;
}
