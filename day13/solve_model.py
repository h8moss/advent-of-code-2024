from scipy.optimize import linprog

def solve(buttonA, buttonB, target):
    x1_bounds = (0, None)
    x2_bounds = (0, None)

    obj = [3,1]
    constrains = [ [buttonA[0], buttonB[0]], [buttonA[1], buttonB[1]], [-buttonA[0], -buttonB[0]], [-buttonA[1], -buttonB[1]] ]

    b = [target[0], target[1], -target[0], -target[1]]

    results = linprog(c=obj, A_ub=constrains, b_ub=b, bounds=[x1_bounds, x2_bounds], method='highs-ds')
    if results.status == 0: 
        print('The solution is optimal')
        print(f'Objective value: z* = {results.fun}')
        print(f'Solution: x1* = {results.x[0]}, x2* = {results.x[1]}')

        return [results.x[0], results.x[1], results.fun]
    return [0,0,0]
