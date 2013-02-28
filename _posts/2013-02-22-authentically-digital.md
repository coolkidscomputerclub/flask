---
layout: post
title: Authentically Digital
authors: [Florian Brueckner]
twitter: [bloomingbridges]
---

It's offically set in blog - no take backs - we are making something physical happen, we are building a device of the bottle variety for collecting, storing and consuming data. Obvious problems concerning the production of the artifact aside, how does one design the look and feel of something normally invisible to the human eye?

## States of digital matter

![LED fluid simulation Processing sketch](http://sorakasumi.github.com/flask/img/ledsketch.png)

Given that our bottle pulls data in from the cloud and the air surrounding it, it is only safe to assume that data isn't solid matter, but either a gas or liquid. Thinking a step further: Let's say data was liquid for a second. If captured inside a glass container, would one still expect it to behave just like regular liquid when shaken? When poured? Will it blend? The answer is probably yes, but **what does liquid data even look like?**

The choice of some kind of liquid as physical manifestation of data seemed only appropriate in the context of a bottle, but rendered completely impractical when trying to add an Arduino plus batteries into the mix. And let's not forget that all that needs to go inside a bottle, preferably hidden away.

Emulating fluid through light seemed therefore to be the next best option, provided that we are able to obfuscate the glass somehow so that it doesn't just look like a grid of LEDs inside a bottle. We figured it would take at least 4 upright strips of 20 LEDs per side in order to replicate a fluid effect within the bottle. Why go through through the effort of stuffing the bottle with tech you ask? And how are you thinking of powering all this?

Well, comparable consumer electronics like a memory stick would just sit there on a desktop, yet regardless of how decorative it may be it doesn't tell anyone anything about its contents. The stick is hardly "aware" of what its function is. All it needs to know is that it can be plugged into a USB port and that's the end of the story. We felt strongly that Flask needed to fill that communicational void in an inobtrusive manner to become truly awe-inspring as well as functional.