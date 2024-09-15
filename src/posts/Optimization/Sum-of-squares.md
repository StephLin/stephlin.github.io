---
title: Checking Sum of Squares (SOS) Polynomials with CVXPY
icon: calculator
date: 2020-10-03
categories:
  - Optimization
tags:
  - Convex Optimization
  - Optimization
  - Sum of Squares
  - Semidefinite Programming
  - Python
---

This post aims at introducing a programming way to check if a polynomial is sum of squares.

## Background Knowledge of Sum of Squares Polynomials

Formally we say a polynomial $f\in\mathbb{R}[x]$ is sum of squares if
exist several polynomials $g\in\mathbb{R}[x]$ such that

$$
f(x) = \sum_i^N g^2_i(x).
$$

It is
[well-known](<https://en.wikipedia.org/wiki/Polynomial_SOS#Square_matricial_representation_(SMR)>)
that a polynomial $f$ of maximum total degree $2d$ is sum of squares if and only
if there is a positive semidefinite matrix $Q$ such that

$$
f(x) = z(x)^t Q z(x),
$$

where $z(x)$ is a vector of monomial basis with maximum total degree $d$.

This property allows us to check if an unknwon polynomial is sum of squares, by
performing a semidefinite programming.

## Semidefinite Programming by Python

From here we use [SymPy](https://www.sympy.org/en/index.html) for algebraic
calculation and [CVXPY](https://www.cvxpy.org) for semidefinite programming.

This program (in primal form) does not need any energy function since we only
check the feasibility under constraints $f(x) - z(x)^\top Q z(x) = 0$.

For example, if our testing funtion is

$$
f(x, y, z) = 2x^4 - 2.5 x^3y + x^2yz - 2xz^3 + 5y^4 + z^4,
$$

then firstly we construct the polynomial

```python
from collections import defaultdict

import sympy as smp
from sympy.abc import x, y, z

gens = [x, y, z]

f = 2 _ x**4 - 5 / 2 _ x**3 * y + x**2 _ y _ z - 2 _ x _ z**3 + 5 * y**4 + z**4
f = f.as_poly(gens)

# rewrite polynomial as defaultdict format
f_poly = defaultdict(int)
for monom, coeff in zip(f.monoms(), f.coeffs()):
    f_poly[monom] += coeff
```

and corresponding (expected) sum of squares representation

::: tip

$$
z^t Q z = \langle Q, z z^t \rangle
$$

:::

```python
import numpy as np
from sympy.polys.monomials import itermonomials
import cvxpy as cp

max_degree = np.max(np.sum(np.array(f.monoms()), axis=1))
total_degree = int(np.ceil(max_degree / 2))
monolist = list(itermonomials(gens, total_degree))
z = np.array(list(map(lambda x: x.as_poly(gens).monoms()[0], monolist)))
z_left = np.tile(z[:, np.newaxis, :], (1, z.shape[0], 1))
z_right = np.tile(z[np.newaxis, :, :], (z.shape[0], 1, 1))
gram = z_left + z_right

monom_degree = len(monolist)
matrix = cp.Variable((monom_degree, monom_degree), name='Q', PSD=True)

sos_poly = defaultdict(int)
for i in range(monom_degree):
    for j in range(monom_degree):
        monom = tuple(gram[i, j])
        sos_poly[monom] += matrix[i, j]
```

Now we would like to subtract the target polynomial by polynomial constructed by
a positive semidefinite matrix, and forced the result function to be zero.

```python
constraint_poly = sos_poly.copy()
for monom, coeff in f_poly.items():
    constraint_poly[monom] -= coeff

constraints = []
for coeff in constraint_poly.values():
    if not isinstance(coeff, int) and not isinstance(coeff, float):
        constraints.append(coeff == 0)
```

Finally we construct the corresponding problem and solve it.

```python
problem = cp.Problem(cp.Minimize(0), constraints=constraints)
problem.solve(solver='MOSEK', verbose=True)
```

For this example we obtain the following result:

```text {37-41}
Problem
Name :
Objective sense : min
Type : CONIC (conic optimization problem)
Constraints : 135
Cones : 0
Scalar variables : 55
Matrix variables : 1
Integer variables : 0

Optimizer - threads : 6
Optimizer - solved problem : the primal
Optimizer - Constraints : 100
Optimizer - Cones : 1
Optimizer - Scalar variables : 21 conic : 21
Optimizer - Semi-definite variables: 1 scalarized : 55
Factor - setup time : 0.00 dense det. time : 0.00
Factor - ML order time : 0.00 GP order time : 0.00
Factor - nonzeros before factor : 5050 after factor : 5050
Factor - dense dim. : 0 flops : 3.73e+05
ITE PFEAS DFEAS GFEAS PRSTATUS POBJ DOBJ MU TIME
0 4.0e+00 1.0e+00 1.0e+00 0.00e+00 0.000000000e+00 0.000000000e+00 1.0e+00 0.00
1 9.9e-01 2.5e-01 2.6e-01 -5.06e-01 0.000000000e+00 5.955154109e-01 2.5e-01 0.00
2 1.2e-01 3.1e-02 8.9e-03 6.55e-01 0.000000000e+00 1.786795893e-02 3.1e-02 0.00
3 2.4e-02 6.0e-03 6.4e-04 1.16e+00 0.000000000e+00 -1.171957303e-04 6.0e-03 0.00
4 4.8e-03 1.2e-03 6.3e-05 1.02e+00 0.000000000e+00 4.984738046e-04 1.2e-03 0.00
5 1.0e-03 2.6e-04 6.2e-06 1.22e+00 0.000000000e+00 1.448269790e-04 2.6e-04 0.00
6 2.5e-04 6.2e-05 7.6e-07 1.10e+00 0.000000000e+00 4.819535948e-05 6.2e-05 0.00
7 5.7e-05 1.4e-05 8.2e-08 1.12e+00 0.000000000e+00 1.182936817e-05 1.4e-05 0.01
8 1.2e-05 2.9e-06 7.3e-09 9.73e-01 0.000000000e+00 1.623429926e-06 2.9e-06 0.01
9 2.3e-06 5.7e-07 6.3e-10 8.44e-01 0.000000000e+00 2.578343391e-07 5.7e-07 0.01
10 5.6e-07 1.4e-07 7.0e-11 1.22e+00 0.000000000e+00 4.849970349e-08 1.4e-07 0.01
11 1.3e-07 3.2e-08 9.2e-12 7.81e-01 0.000000000e+00 2.734660260e-08 3.2e-08 0.01
12 2.3e-08 5.8e-09 5.5e-13 1.24e+00 0.000000000e+00 5.578862505e-10 5.8e-09 0.01
Optimizer terminated. Time: 0.01

Interior-point solution summary
Problem status : PRIMAL_AND_DUAL_FEASIBLE
Solution status : OPTIMAL
Primal. obj: 0.0000000000e+00 nrm: 5e+00 Viol. con: 3e-08 var: 0e+00 barvar: 0e+00
Dual. obj: 5.5788624960e-10 nrm: 4e+00 Viol. con: 0e+00 var: 3e-09 barvar: 9e-09
```

which is feasibile.

Now we consider another function $f(x, y, z) = x + y + z$. Obviously this is not
a sum of squares polynomial. In this case we follow the above procedure and we
can get the following result

```text{66-69}
Problem
Name :
Objective sense : min
Type : CONIC (conic optimization problem)
Constraints : 26
Cones : 0
Scalar variables : 10
Matrix variables : 1
Integer variables : 0

Optimizer - threads : 6
Optimizer - solved problem : the primal
Optimizer - Constraints : 16
Optimizer - Cones : 0
Optimizer - Scalar variables : 0 conic : 0
Optimizer - Semi-definite variables: 1 scalarized : 10
Factor - setup time : 0.00 dense det. time : 0.00
Factor - ML order time : 0.00 GP order time : 0.00
Factor - nonzeros before factor : 136 after factor : 136
Factor - dense dim. : 0 flops : 2.36e+03
ITE PFEAS DFEAS GFEAS PRSTATUS POBJ DOBJ MU TIME
0 1.0e+00 1.0e+00 1.0e+00 0.00e+00 0.000000000e+00 0.000000000e+00 1.0e+00 0.00
1 7.9e-02 7.9e-02 1.8e-01 -2.00e-01 0.000000000e+00 4.850239930e+00 7.9e-02 0.00
2 6.8e-05 6.8e-05 8.0e-03 -9.73e-01 0.000000000e+00 1.400490086e+04 6.8e-05 0.00
3 3.4e-14 3.4e-14 1.3e-07 -1.00e+00 0.000000000e+00 1.431945428e+13 3.4e-14 0.00
Optimizer terminated. Time: 0.00

MOSEK PRIMAL INFEASIBILITY REPORT.

Problem status: The problem is primal infeasible

The following constraints are involved in the primal infeasibility.

Index Name Lower bound Upper bound Dual lower Dual upper
0 0.000000e+00 0.000000e+00 0.000000e+00 1.143887e+00
1 1.000000e+00 1.000000e+00 2.374090e-01 0.000000e+00
2 1.000000e+00 1.000000e+00 2.374090e-01 0.000000e+00
3 1.000000e+00 1.000000e+00 2.374090e-01 0.000000e+00
4 0.000000e+00 0.000000e+00 0.000000e+00 1.047962e+00
5 0.000000e+00 0.000000e+00 0.000000e+00 4.796219e-02
6 0.000000e+00 0.000000e+00 0.000000e+00 4.796219e-02
7 0.000000e+00 0.000000e+00 0.000000e+00 1.047962e+00
8 0.000000e+00 0.000000e+00 0.000000e+00 4.796219e-02
9 0.000000e+00 0.000000e+00 0.000000e+00 1.047962e+00
10 0.000000e+00 0.000000e+00 0.000000e+00 1.143887e+00
11 0.000000e+00 0.000000e+00 4.500538e-01 0.000000e+00
12 0.000000e+00 0.000000e+00 4.500596e-01 0.000000e+00
13 0.000000e+00 0.000000e+00 4.500537e-01 0.000000e+00
14 0.000000e+00 0.000000e+00 2.476412e-02 0.000000e+00
15 0.000000e+00 0.000000e+00 0.000000e+00 1.047962e+00
16 0.000000e+00 0.000000e+00 0.000000e+00 8.414647e-02
17 0.000000e+00 0.000000e+00 0.000000e+00 8.412991e-02
18 0.000000e+00 0.000000e+00 2.475832e-02 0.000000e+00
19 0.000000e+00 0.000000e+00 0.000000e+00 1.177790e-02
20 0.000000e+00 0.000000e+00 0.000000e+00 1.047962e+00
21 0.000000e+00 0.000000e+00 0.000000e+00 8.416118e-02
22 0.000000e+00 0.000000e+00 2.476425e-02 0.000000e+00
23 0.000000e+00 0.000000e+00 0.000000e+00 1.179446e-02
24 0.000000e+00 0.000000e+00 0.000000e+00 1.176319e-02
25 0.000000e+00 0.000000e+00 0.000000e+00 1.047962e+00

The following bound constraints are involved in the infeasibility.

Index Name Lower bound Upper bound Dual lower Dual upper Dual cone

Interior-point solution summary
Problem status : PRIMAL_INFEASIBLE
Solution status : PRIMAL_INFEASIBLE_CER
Dual. obj: 7.1222688931e-01 nrm: 1e+00 Viol. con: 0e+00 var: 0e+00 barvar: 3e-14
```

which is infeasible.

## Conclusion

From this post we are able to check if a function is a sum of squares polynomial
by performing a corresponding semidefinite programming. It means that we do not
need to find such polynomials manually but just simply run some optimization
algorithm (e.g. interior-point method). However we note that the matrix space
complexity w.r.t. total degree is exponential.

## References

- [Sum-of-squares programming - YALMIP](https://yalmip.github.io/tutorial/sumofsquaresprogramming)
- [SymPy](https://www.sympy.org/en/index.html)
- [CVXPY](https://www.cvxpy.org/)
