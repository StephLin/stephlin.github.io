---
title: 2024 - FracGM
date: 2024-10-22
icon: file-lines
categories:
  - Research
tags:
  - RA-L
---

[Bang-Shien Chen](https://dgbshien.com/),
[Yu-Kai Lin](/),
[Jian-Yu Chen](https://github.com/Jian-yu-chen),
[Chih-Wei Huang](https://sites.google.com/ce.ncu.edu.tw/cwhuang/),
[Jann-Long Chern](https://math.ntnu.edu.tw/~chern/),
[Ching-Cherng Sun](https://www.dop.ncu.edu.tw/en/Faculty/faculty_more/9),
**FracGM: A Fast Fractional Programming Technique for Geman-McClure Robust Estimator**.
_IEEE Robotics and Automation Letters (RA-L)_, vol. 9, no. 12, pp. 11666 -- 11673, Dec. 2024.

![](/assets/images/projects/FracGM-Banner.gif)

Robust estimation is essential in computer vision, robotics, and navigation,
aiming to minimize the impact of outlier measurements for improved accuracy. We
present a fast algorithm for Geman-McClure robust estimation, FracGM, leveraging
fractional programming techniques. This solver reformulates the original
non-convex fractional problem to a convex dual problem and a linear equation
system, iteratively solving them in an alternating optimization pattern.
Compared to graduated non-convexity approaches, this strategy exhibits a faster
convergence rate and better outlier rejection capability. In addition, the
global optimality of the proposed solver can be guaranteed under given
conditions. We demonstrate the proposed FracGM solver with Wahba's rotation
problem and 3-D point-cloud registration along with relaxation pre-processing
and projection post-processing. Compared to state-of-the-art algorithms, when
the outlier rates increase from 20% to 80%, FracGM shows 53% and 88% lower
rotation and translation increases. In real-world scenarios, FracGM achieves
better results in 13 out of 18 outcomes, while having a 19.43% improvement in
the computation time.

For more details, please refer to the following links:

- [<FontIcon icon="fa-solid fa-file-lines" /> Paper (IEEE)](https://doi.org/10.1109/LRA.2024.3495372)
- [<FontIcon icon="fa-solid fa-file-lines" /> Preprint (arXiv)](https://arxiv.org/pdf/2409.13978)
- [<FontIcon icon="fa-solid fa-code" /> Code (GitHub)](https://github.com/StephLin/FracGM)
