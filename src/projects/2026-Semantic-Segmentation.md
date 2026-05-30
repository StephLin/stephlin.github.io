---
title: 2026 - Semantic Segmentation Using Scene Flow Estimation
date: 2026-05-15
icon: file-lines
categories:
  - Research
tags:
  - RA-L
---

You-Jun Li,
[Yu-Kai Lin](/),
[Bang-Shien Chen](https://dgbshien.com/),
[Chih-Wei Huang](https://sites.google.com/ce.ncu.edu.tw/cwhuang/),
[Jann-Long Chern](https://math.ntnu.edu.tw/~chern/),
[Ching-Cherng Sun](https://www.dop.ncu.edu.tw/en/Faculty/faculty_more/9),
**Open-Vocabulary Semantic Segmentation for Dynamic 3D Scenes Using Scene Flow Estimation**.
_IEEE Robotics and Automation Letters (RA-L)_, vol. 11, no. 7, pp. 8140 -- 8147, Jul. 2026.

![](/assets/images/projects/Semantic-Segmentation-Scene-Flow-Estimation-Banner.png)

3D open-vocabulary semantic segmentation has shown great potential in
applications such as autonomous driving and mixed reality. However, achieving
accurate segmentation in dynamic environments remains challenging due to
motion-induced inconsistencies. To address this issue, we incorporate scene
flow as temporal information into a static semantic backbone to enhance
semantic consistency and accuracy over time. Our method captures inter-frame
motion cues from point cloud sequences and leverages them, together with a
local clustering mechanism, to refine semantic label consistency in consecutive
frames. Furthermore, we introduce a two-way scene flow-based data augmentation
strategy that exploits both forward and backward motion to jointly train the
model in bidirectional temporal contexts. On the large-scale nuScenes
autonomous driving dataset, our method achieves a 0.4% overall improvement in
hIoU and a 2.37% gain under high-motion scenes. On the synthetic object-centric
dataset, it achieves a 4.53% overall hIoU improvement and a 6.09% gain in
high-motion scenes, while reducing the ID switch rate by 0.5%.

For more details, please refer to the following links:

- [<FontIcon icon="fa-solid fa-file-lines" /> Paper (IEEE)](https://doi.org/10.1109/LRA.2026.3693993)
