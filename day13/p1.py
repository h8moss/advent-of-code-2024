import math
import re
import solve_model

def isInt(n):
    return math.fabs(math.floor(n) - n) < 0.000000001

def main():
    txt: list[str] = []
    with open('./input.txt', 'r') as f:
        txt = f.readlines()

    problems = []
    currentProblem = []
    for line in txt:
        if line.startswith('Button'):
            resX = re.search(r'X\+(\d+)', line)
            resY = re.search(r'Y\+(\d+)', line)
            currentProblem.append((int(resX[1]), int(resY[1])))
        elif line.startswith('Prize'):
            resX = re.search(r'X=(\d+)', line)
            resY = re.search(r'Y=(\d+)', line)
            currentProblem.append((int(resX[1]), int(resY[1])))
        else:
            problems.append(currentProblem)
            currentProblem = []

    # solve_model.solve((94,34), (22,67), (8400, 5400))
    added = 0
    for problem in problems:
        print(problem)
        result = solve_model.solve(problem[0], problem[1], problem[2])
        if (isInt(result[2])):
            added += math.floor(result[2])

    print('=================')
    print(added)
    print('=================')

if __name__ == '__main__':
    main()
