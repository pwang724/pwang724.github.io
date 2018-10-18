---
git layout: default
---

Our capacity to learn associations enables us to predict future events and so informs us of appropriate actions to take. For instance, upon hearing blaring sirens, we stop what we are doing and scan our surroundings for imminent danger. In my PhD, I asked a simple question: how do our brains learn to connect two stimuli together?

I needed to see how brain circuits are changing during the course of learning to infer the algorithm that our brains use to learn associations. This has been technically challenging until the recent development of two important technologies by others[<sup>1</sup>](https://www.nature.com/articles/nature12354)<sup>,</sup>[<sup>2</sup>](https://www.nature.com/articles/nmeth.1339):

1. Genetically engineered calcium indicators. These proteins convert voltage into light. Instead of listening to waveforms, we directly visualize neural activity through changes in fluorescence. This allows us to track the neural activity of neurons across time.

2. Microendoscopic lenses. Brain regions thought to underlie associative learning are lodged deep within, and can't be imaged through any conventional methods that only scan the brain surface. But if we shove a lens through the brain and directly on top of these regions, we can see what neurons below are doing.

<video width="320" height="200" autoplay loop>
  <source src="/assets/movies/behavior.mp4" type="video/mp4" />
</video><video width="320" height="200" autoplay loop>
  <source src="/assets/movies/gcamp6s.mp4" type="video/mp4" />
</video>

<!-- <video width="320" height="200" autoplay controls loop onplaying="this.controls=false">
  <source src="/assets/movies/behavior.mp4" type="video/mp4" />
</video><video width="320" height="200" autoplay controls loop onplaying="this.controls=false">
  <source src="/assets/movies/gcamp6s.mp4" type="video/mp4" />
</video> -->

Using this method, I was able to image

Using this new method, I found that different prefrontal areas performed unique value computations during learning. The orbitofrontal cortex signaled positive value and was optimized for fast learning. This ‘quick and dirty’ representation is then used by the medial prefrontal cortex to slowly learn a stable representation of positive and negative value.

Finally, I used deep reinforcement learning models to understand how these complex computations can arise from networks of neurons.
