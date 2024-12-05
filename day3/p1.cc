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
  file.open("input.test.txt", std::ios::in);

  std::string input{slurp(file)};

  std::regex regex("mul\\((\\d{1,3}),(\\d{1,3})\\)");

  std::smatch match;

  std::string::const_iterator searchStart{input.cbegin()};

  int sum{};

  while (std::regex_search(searchStart, input.cend(), match, regex)) {
    int a{std::stoi(match.str(1))};
    int b{std::stoi(match.str(2))};

    std::cout << a << " * " << b << " = " << a * b << '\n';
    sum += a * b;

    searchStart = match.suffix().first;
  }

  std::cout << "Result: " << sum << std::endl;

  return 0;
}
