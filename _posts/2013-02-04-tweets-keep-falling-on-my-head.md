---
layout: post
title: Tweets Keep Falling on my Head
authors: [Ben Ashman]
twitter: [benashman]
---

One aspect of our last project, [Inhabit](http://vimeo.com/56106551), was the ability to approximately locate a user within a physical geographical space. However, we quickly came to realize that, being the über-nerds we are and considering we spend 16+ hours a day at a computer, maybe it would be more interesting to know where our peers were in cyberspace rather than physical.

## Sniff, sniff

Our initial thoughts were to sniff network traffic around the home, revealing all sorts of wondrous activities, ranging from questionable HTTP requests to file transfers and downloads. However, network traffic is pretty messy. Amongst the good, fun, *meaningful* stuff there usually lies a ton of nonsensical packets that hold no value in such a context.

The idea of making something from the traffic-riddled air that surrounds us seemed exciting at first, and we even began to brainstorm ways in which to physically manifest the harvested data. One idea that floated around for a while was to create an automated typewriter that would act in a Courtroom Scribe-like manner, continuously transcribing and printing all a permanent record of network activity that is occurring throughout the home.

![Typewriter]({{ site.baseurl }}/img/content/typewriter.png)

Ultimately, we decided against sniffing network traffic as it would prove to be an impractical method of valuable data harvesting; the ratio of signal vs. noise made the process impractical *at best*. There were better ways.

## Geotagged media

**Why focus on the polluted air that surrounds us when a pristine cloud lies above?**
Rather than filtering out the content we wanted, we decided to go straight to the source.

Acting as a digital sponge, Flask absorbs social media activity within a close proximity of itself. In order to achieve this, Flask needs access to geotagged data that we can effectively map to a geographical location. Luckily, [Twitter](https://dev.twitter.com/docs/streaming-apis) and [Instagram](http://instagram.com/developer/realtime/) both provide real-time streaming APIs that were perfect for this job — streaming geotagged media of varying formats **as it happens.**

By running Flask's back-end on Node.js, we were able to leverage the offerings of the vibrant Node community. After a little poke around [GitHub](http://github.com), we stumbled across a number of open-source wrapper libraries for the Twitter and Instagram APIs. Although both Twitter and Instagram provide unparalleled documentation for interacting with their respective services the hard way, using these libraries ([ntwitter](https://github.com/AvianFlu/ntwitter) and [Instagram-node-lib](https://github.com/mckelvey/instagram-node-lib)) helped us to retain a sensible code structure and save a bit of time!


After a bit of tinkering, we found ourselves with a stable stream of tweets and photographs that we could begin to fill our Flask with.
