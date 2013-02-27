---
layout: post
title: Liquid Data
author: Florian Brueckner
twitter: bloomingbridges
---

**We figured, that one achievable way to add an element of magic to Flask is by incorporating something we won't ever fully fathom ourselves**.

For the tablet interface end of Flask we had to ask ourselves, what is the digital equivalent to an atom when it comes to visual building blocks? Is it the pixel? The vertex? The tetramino? In any case it was clear that what the visualisation needed was a decent amount of particles!

From particle physics it was then only a small step towards low-level graphics programming, an area which I meant to develop skills in for a while, so I thought why not pick up [openFrameworks](http://www.openframeworks.cc/) (the widely proclaimed *Processing* of the C++ world) for a bit of a taster. The reasoning being that if I don't get to learn how to blow glass during this project, I want to at least leave as a better programmer.

## Of vertex shaders and forgotten behemoths

![GLSL shader programming](http://sorakasumi.github.com/flask/img/sep_vertices.jpg)

The initial attraction of using openFrameworks did not solely stem from the fact that most critically acclaimed digital artwork produced was built with it, but Memo Akten's [MSAFluid solver library](http://www.memo.tv/msafluid/), which promised to make 2D fluid simulations a piece of cake. If the mention of openFrameworks alone would have made the bottle look more professional by just 10%, it was worth taking the risk.

Your average instagram photo has the dimensions of 612 pixels square. Naïvely I assumed that I could just turn every pixel into a particle without having to make sacrifices in terms of speed,  but only if you start considering every second pixel value you're starting to get smooth results. And we're just talking about a single image here. 

My next approach was to map the image to a plane mesh and just push its vertices around. This way you'd end up with a more rigid-looking fluid effect, however nobody said that liquid data was high in viscosity anyway. By week five I was knees-deep in shader programming with GLSL to squeeze some more performance out of the piece (by writing little programmes that would compute vertex positions in parallel on the GPU) and everything seemed fine in Nodeland, too.

Problems didn't occur until we've realised that we hadn't tested the application on the intended   hardware (i.e. iOS or Android). Turns out that whenever you're trying to make a senior language play nicely with a rather young piece of technology you better know what you are doing. I couldn't manage to compile the third party library we used for the WebSocket communication (libwebsocket) for iOS and since rethinking our setup this late in the game was out of the question, I had to jump ship and go back to good young HTML5 canvas.

<!--
## Like oil and water

![Drip drop](http://sorakasumi.github.com/flask/img/sep_drips.jpg)-->

