---
title: 2023 - LIO-SEGMOT
date: 2023-03-31
icon: file-lines
categories:
  - Research
tags:
  - ICRA
---

[**Yu-Kai Lin**](/),
[Wen-Chieh Lin](https://www.cs.nycu.edu.tw/members/detail/wclin),
[Chieh-Chih Wang](https://sites.google.com/site/chiehchihbobwang),
**Asynchronous State Estimation of Simultaneous Ego-motion Estimation and Multiple Object Tracking for LiDAR-Inertial Odometry**.
_2023 International Conference on Robotics and Automation (ICRA)_, pp. 10616--10622, May 2023.

<!-- more -->

![](/assets/images/projects/LIO-SEGMOT-Banner.gif)

We propose LiDAR-Inertial Odometry via Simultaneous EGo-motion estimation and
Multiple Object Tracking (LIO-SEGMOT), an optimization-based odometry approach
targeted for dynamic environments. LIO-SEGMOT is formulated as a state
estimation approach with asynchronous state update of the odometry and the
object tracking. That is, LIO-SEGMOT can provide continuous object tracking
results while preserving the keyframe selection mechanism in the odometry
system. Meanwhile, a hierarchical criterion is designed to properly couple
odometry and object tracking, preventing system instability due to poor
detections. We compare LIO-SEGMOT against the baseline model LIO-SAM, a
state-of-the-art LIO approach, under dynamic environments of the KITTI raw
dataset and the self-collected Hsinchu dataset. The former experiment shows that
LIO-SEGMOT obtains an average improvement 1.61% and 5.41% of odometry accuracy
in terms of absolute translational and rotational trajectory errors. The latter
experiment also indicates that LIO-SEGMOT obtains an average improvement 6.97%
and 4.21% of odometry accuracy.

For more information, please refer to the following links:

- [<FontIcon icon="fa-solid fa-file-lines" /> Paper (IEEE)](https://doi.org/10.1109/ICRA48891.2023.10161269)
- [<FontIcon icon="fa-solid fa-file-lines" /> Preprint](/assets/preprints/2023-ICRA-LIO-SEGMOT.pdf)
- [<FontIcon icon="fa-solid fa-code" /> Code (GitHub)](https://github.com/StephLin/LIO-SEGMOT)
- [<FontIcon icon="fa-solid fa-video" /> Video (YouTube)](https://youtu.be/5HtnDFPerVo)
