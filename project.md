---
layout: default
---

## Main PhD Project

[*bioRXIV preprint*](https://www.biorxiv.org/content/10.1101/753426v1)

Our capacity to learn associations gives us a measure of control over our environment by enabling us to predict and act on future events. For instance, upon hearing blaring sirens, we stop what we are doing and scan our surroundings for imminent danger. How do our brains learn to connect two stimuli together?

I adapted two recent technologies [<sup>1</sup>](https://www.nature.com/articles/nature12354)<sup>,</sup>[<sup>2</sup>](https://www.nature.com/articles/nn.3329) to track neural activity in a population of neurons in mice when they were actively learning an association. Neural activity is converted into fluorescence, and the flashes of light on the right video correspond to bursts of activity of individual neurons. Imaging a population of neurons allowed me to see how neural activity supports learning when mice were actively associating an odor with a water reward (left).

<div id="wrapper">
    <video id="home1" width="320" height="200" autoplay loop controls muted="">
      <source src="/assets/movies/behavior.mp4" type="video/mp4" />
    </video>

    <video id="home2" width="320" height="200" autoplay loop controls muted="">
      <source src="/assets/movies/gcamp6s.mp4" type="video/mp4" />
    </video>
    <div class="clear"></div>
</div>

<br/>

Using this approach, I found that different prefrontal areas performed unique value computations during learning. The orbitofrontal cortex (OFC) rapidly learned to signal positive value in response to cues that predicted reward. Further experiments using optogenetics[<sup>4</sup>](https://www.nature.com/articles/nn1525) (controlling neurons with light) to turn off the OFC revealed that the OFC is indispensable for learning. After learning, the OFC appears to transfer what it has learned to the medial prefrontal cortex (mPFC), where it is consolidated into a stable representation of value.

We made an important observation: once the task has been learned, the representation of value in the OFC dissipates. Why would a learned representation vanish? The process of forgetting may 'refresh' the OFC so it can learn new tasks. In other words, the gradual accumulation of information from the past may overload its capacity to be cognitively flexible in the present. Once the OFC solves a task, it appears to unload what it has learned to the mPFC to free up space. Indeed, the time when OFC's representation degrades is exactly when other brain regions such as the mPFC take over.

The OFC computes value and likely informs downstream areas to take appropriate actions to get reward. This framework transfers quite naturally to reinforcement learning (RL) algorithms such as actor-critic (AC) learning, where the critic network also computes value and informs the actor network which action to take next. What can the critic network in AC learning teach us about the OFC, and vice versa?

After training a recurrent AC network on our behavioral task, I found that the machine critic reproduces much of the neural dynamics that we observe in the OFC. However, while the machine critic served no purpose after the actor has learned an optimal policy, it was still pumping out value estimates. In contrast, the OFC turns itself off after an optimal policy has been learned. Refreshing its memory once it has finished learning a task may allow it to learn new tasks without interference. This could potentially solve the problem of catastrophic forgetting when neural networks are trained on multiple tasks. I am currently working on finding constraints on network structure that would cause a network to segment itself into distinct "acquisition" and "consolidation" modules during training.
