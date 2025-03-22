---
author: Kevin Brennan
title: Projectile Prediction
date: 2022-10-16
summary: The math behind projectile prediction. Using initial conditions to determine launch angle.

math: true
---

This article tackles the problem of projectile prediction, as in, where one should aim a projectile if they
want it to hit a moving target. The general idea is that if we are able to model the target's movement with
a function of \( t \), then we should be able to solve for a way to intercept its path with our own
projectile's.

## Problem Setup
Let's start with some definitions:
* \( \vec{p}(t) \) is the position vector of the target relative to the shooter at time \( t \)
* \( \vec{b}(t) \) is the position vector of the projectile relative to the shooter at time \( t \)
* \( \vec{r} \) is the direction we must shoot our projectile in to hit the target

Finding the form that \( \vec{p}(t) \) and \( \vec{b}(t) \) take is part of the challenge of setting up the
problem. Factors such as initial position, gravity, velocity and any other source of acceleration must be
included. Here are some common examples for target position:

* Target standing still: \( \vec{p}(t) = \vec{p}_0 \)
* Target moving in a line: \( \vec{p}(t) = \vec{p}_0 + \vec{v}t \)
* Target with initial velocity and acceleration: \( \vec{p}(t) = \vec{p}_0 + \vec{v}t + \frac{1}{2}\vec{a}t^2 \)

## Rearranging Equations
For this tutorial, I will be assuming the target is moving in a parabola (affected by gravity with initial
velocity) and the projectile moves at a constant velocity from the origin. Once we have the forms of
\( \vec{p}(t) \) and \( \vec{b}(t) \), we can equate them. This is because we want them to be equal at some
time \( t \) in order for the projectile to hit the target. **Note:** I am not equating these
functions for all time, but rather for a specific unknown time \( t \).

$$
    \begin{align}
    \vec{b}(t) &= \vec{p}(t) \\\
    \vec{r}t &= \vec{p}_0 + \vec{v}t + \frac{1}{2}\vec{a}t^2 \\\
    \vec{r} &= \frac{\vec{p}_0 + \vec{v}t + \frac{1}{2}\vec{a}t^2}{t}
    \end{align}
$$

Now we have \( \vec{r} \) (the direction we need to aim in) isolated, but we don't know what \(t\) (the time
of impact) is. We can't easily find a solution in this form since the equation involves vectors, but we
have a trick that will make this easier to solve &mdash; we can dot product both sides by themselves:

$$
    \vec{r} \cdot \vec{r} = \left(\frac{\vec{p}_0 + \vec{v}t + \frac{1}{2}\vec{a}t^2}{t}\right) \cdot \left(\frac{\vec{p}_0 + \vec{v}t + \frac{1}{2}\vec{a}t^2}{t}\right)
$$

$$
    \vec{r} \cdot \vec{r} =
    \frac{
    \vec{p}_0 \cdot \vec{p}_0
    + 2\vec{p}_0 \cdot \vec{v}t
    + \vec{p}_0 \cdot \vec{a}t^2
    + \vec{v} \cdot \vec{v}t^2
    + \vec{v} \cdot \vec{a}t^3
    + \frac{1}{4}\vec{a} \cdot \vec{a}t^4
    }{t^2}
$$

Rearranging, and grouping by power of \(t\), we get:

$$
    \frac{1}{4}\left(\|\vec{a}\|^2\right)t^4
    + \left(\vec{a} \cdot \vec{v}\right)t^3
    + \left(\vec{p}_0 \cdot \vec{a} + \|\vec{v}\|^2 - \|\vec{r}\|^2\right)t^2
    + 2\left(\vec{p}_0 \cdot \vec{v}\right)t
    + \|\vec{p}_0\|^2 = 0
$$

## Solving the Problem
Now we have a quartic equation whose roots are the times at which the projectile will hit the target. The
roots are not necessarily positive or real, which nicely highlights the fact that not all situations have a
real (useful) solution that we can use. Such as a situation where the target is moving away from us faster
than our projectile moves, making it impossible for us to ever hit it.

Taking our quartic coefficients, and using a quartic solver library, we can find the roots of the equation.
These roots allow us to finally solve the problem completely. Taking the real, positive roots, we can do
the following:
1. Choose one of the roots, \( t^* \), which is the time at which the projectile will hit the target
2. Use our \( \vec{p}(t) \) function with that root value to find the position of the target at that time, \( \vec{p}(t^*) \)
3. Use our \( \vec{b}(t) \) function to figure out the launch angle, \( \vec{r} \), that results in \( \vec{b}(t^*)=\vec{p}(t^*) \)
4. Shoot the projectile in the direction of \( \vec{r} \)

## Conclusion
Now you should know how to solve for where to shoot a projectile in order to hit a moving target. This can
be useful for games where you want to have a computer controlled character shoot at a moving target or to
provide aiming indicators to players using projectile weapons.

Adding more complexity to the problem, such as wind, or a projectile that accelerates, may make the
problem more difficult to solve. It might require more sophisticated numerical methods for solving for
roots since the problem may increase to a quintic or even higher-order function. However, the general
idea of equating the projectile and target position functions and solving for the time of impact remains
the same.

## Further reading:
* [Monkey and hunter (Wikipedia)](https://en.wikipedia.org/wiki/Monkey_and_hunter)
* [Projectile Aim Prediction with Acceleration (Stack Exchange)](https://gamedev.stackexchange.com/a/149612)
