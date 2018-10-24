---
layout: default
---

## PhD Research

Our capacity to learn associations gives us a measure of control over our environment by enabling us to predict and act on future events. For instance, upon hearing blaring sirens, we stop what we are doing and scan our surroundings for imminent danger. I asked a simple question: how do our brains learn to connect two stimuli together?

To do this, I needed to see how brain circuits change during the course of learning. This was technically challenging until the recent development of two important technologies[<sup>1</sup>](https://www.nature.com/articles/nature12354)<sup>,</sup>[<sup>2</sup>](https://www.nature.com/articles/nn.3329). I adapted them to track neural activity in a population of neurons (right) when mice were actively learning to associate an odor with a water reward (left).

<div id="wrapper">
    <video id="home1" width="320" height="200" autoplay loop>
      <source src="/assets/movies/behavior.mp4" type="video/mp4" />
    </video>

    <video id="home2" width="320" height="200" autoplay loop>
      <source src="/assets/movies/gcamp6s.mp4" type="video/mp4" />
    </video>
    <div class="clear"></div>
</div>

<br/>

I found that different prefrontal areas performed unique value computations during learning. The orbitofrontal cortex (OFC) rapidly learned to signal positive value in response to cues that predicted reward. Its representation reflected knowledge of task structure, or "state space"[<sup>3</sup>](https://www.sciencedirect.com/science/article/pii/S0896627313010398), and further experiments using optogenetics[<sup>4</sup>](https://www.nature.com/articles/nn1525) (controlling neurons with light) to turn off the OFC revealed it to be indispensable for learning. After learning, it transfered what it has learned to the medial prefrontal cortex (mPFC), where it is further processed and then stored long-term.

We made an important observation: once the task has been learned with a single odor, the OFC turns silent, and it remains silent even when mice encounter novel odors they haven't previously experienced within the same task. Why would a learned representation vanish? The process of forgetting may allow the OFC to start again as a clean slate to learn new tasks. Otherwise, the gradual accumulation of information from the past would overload its capacity to be cognitively flexible in the present. The OFC may therefore function as a playground within a wider learning network to experiment and test hypothesis. Once it solves a task, it unloads its knowledge to long-term storage units to free up space. Indeed, the time when OFC's representation degrades is exactly when other brain regions such as the mPFC take over.

The OFC computes value and likely informs downstream areas to take appropriate actions to get reward. This framework transfers quite naturally to reinforcement learning (RL) algorithms such as actor-critic (AC) learning, where the critic network also computes value and informs the actor network which action to take next. What can the critic network in AC learning teach us about the OFC, and vice versa?

After training a recurrent AC network on our behavioral task, I found that the critic network reproduced much of the neural dynamics that we observe in the OFC. However, while the critic network served no purpose after the actor has learned an optimal policy, it was still pumping out value estimates. By turning itself off after an optimal policy has been learned, the OFC may have implemented a solution that may be more efficient at learning than current RL algorithms. I am currently interested in finding constraints on network structure that would cause a network to segment itself into distinct "playground" and "storage" modules during training.

<!-- I then adapted this technology to

1. Genetically engineered calcium indicators that convert voltage into light. Instead of listening to waveforms, we directly visualize neural activity through changes in fluorescence. This allows us to track the neural activity of a large population of neurons across time.

2. Microendoscopic lenses. Brain regions thought to underlie associative learning are lodged deep within, and can't be imaged through any conventional methods that only scan the brain surface. But if we implant a lens through the cranium until it is directly on top of these regions, we can see what neurons below are doing. -->
