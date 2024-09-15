---
title: 2024 - AI-Enhanced GNSS/INS
date: 2024-09-30
icon: file-lines
categories:
  - MediaTek
tags:
  - ION GNSS+
---

An-Lin Tao,
[Yu-Kai Lin](/),
Hau-Hsiang Chan,
Li-Min Lin,
Pei-Shan Kao,
**AI-Enhanced Smartphone-Based GNSS/INS Integration: Improved Vehicular/Pedestrian Navigation in Challenging Scenarios Using Machine Learning**.
_ION GNSS+ 2024 (Session C4: Positioning Technologies and Machine Learning)_, Sep. 2024.

<!-- more -->

![](/assets/images/projects/MTK.png =200x)

The utilization of mobile phone positioning for navigation has become a
fundamental aspect of modern life. However, enabling mobile phones to provide
positioning in urban areas presents greater challenges due to the need to
minimize hardware size and costs, in contrast to traditional GNSS receivers. The
effective integration of inertial navigation units (IMU) and GNSS has emerged as
a critical issue.

MediaTek, as a provider of a wide range of mobile products, has collected data
on challenging scenarios worldwide through customer feedback. Leveraging a
substantial volume of data, the appropriate integration of artificial
intelligence (AI) and the utilization of machine learning (ML) technology have
the potential to enhance positioning accuracy across diverse scenarios. Several
years ago, MediaTek integrated various machine learning techniques to fuse GNSS
with multiple IMU sensors. However, integrating GNSS with IMU across different
usage scenarios presents four primary challenges:

- Requiring sensor calibration.
- Determining the relationship between the user's mobile phone and the carrier (such as a vehicle or pedestrian, etc.).
- Classifying the accuracy of GNSS observations in challenging environments.
- Adjusting the parameters of GNSS and IMU through EKF in different scenarios.

This paper will provide a method to use machine learning in real-time to solve
the above-mentioned problems with limited platform computing capacity. The
specific contributions are delineated as follows:

1. Static identification using machine learning: Overcoming disparities among
   various usage scenarios and diverse sensors to furnish users with consistent
   positioning results while simultaneously conducting sensor calibration.
2. State identification using machine learning: Identifying whether the user is
   driving, walking, or running, and integrating distinct algorithms to optimize
   sensor integration with GNSS based on varying usage states.
3. Observation filtering using machine learning: Training on a comprehensive
   dataset to predict accurate GNSS observation quality, selecting high-quality
   observations, excluding abnormal ones, and furnishing accuracy indicators
   integrated with sensors.
4. Adjusting key parameters of the integrated system using machine learning:
   Automatically optimizing the numerous parameters of sensors and GNSS within a
   tightly-coupled Kalman filter, rapidly achieving equilibrium upon the
   introduction of new sensors or GNSS signals.

Ultimately, this paper will present the performance disparities before and after
applying the proposed method:

- The average accuracy of static detection can be increased by 23%.
- For high-vibration scenes, the improvement can reach up to 87%;
- The accuracy of state recognition can achieve 98%;
- The accuracy of GNSS observation selection can be boosted by 30%.
- Finally, the user positioning accuracy is enhanced by 10%.

By leveraging the techniques expounded in this paper, MediaTek's products can
furnish mobile phone users with more precise navigation services across various
environments.

For more information, please refer to the following link:

- [<FontIcon icon="fa-solid fa-file-lines" /> Abstract (ION)](https://www.ion.org/gnss/abstracts.cfm?paperID=13666)
