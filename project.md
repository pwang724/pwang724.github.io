---
layout: default
---

Our capacity to learn associations gives us a measure of control over our environment by enabling us to predict and act on future events. For instance, upon hearing blaring sirens, we stop what we are doing and scan our surroundings for imminent danger. I asked a simple question in my PhD: how do our brains learn to connect two stimuli together?

I needed to see how brain circuits change during the course of learning to infer the algorithm that our brains use to learn associations. This has been technically challenging until the recent development of two important technologies that allow me to image neural activity in cognitive brain regions lodged deep within the brain [<sup>1</sup>](https://www.nature.com/articles/nature12354)<sup>,</sup>[<sup>2</sup>](https://www.nature.com/articles/nn.3329).

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
Using this approach, I can track the neural activities (right) of a population of neurons in a brain region when mice are actively learning to associative an odor with a water reward (left). Mice gradually internalize this association and reveal this knowledge to us by licking in anticipation of the incoming water drop when odor is presented. I can then extract meaningful changes in neural activity to stages of learning to understand how the brain learns simple associations.

I found that different prefrontal areas performed unique value computations during learning. The orbitofrontal cortex (OFC) rapidly learned to signal positive value in response to cues that predicted reward. Its representation reflected knowledge of task structure, or "state space"[<sup>3</sup>](https://www.sciencedirect.com/science/article/pii/S0896627313010398), and further experiments using optogenetics[<sup>4</sup>](https://www.nature.com/articles/nn1525) (controlling neurons with light) to turn off the OFC revealed that it is indispensable for learning associations. After learning, this representation is transferred to the medial prefrontal cortex (mPFC), where it slowly learns to signal positive value to rewarded cues and also negative value to unrewarded cues.

We made an important observation: once the task has been learned with a single odor, the OFC becomes silent, and it remains silent even when mice encounter novel odors that haven't been previously learned. Why would a learned representation vanish? I think the brain may allocate a portion of its real estate to be a playground where experimentation and hypothesis testing can take place. Once it solves a task, it may unload what it has learned to storage units located elsewhere to free up space to learn new tasks. Otherwise, the gradual accumulation of information would overload its capacity to be cognitively flexible. Indeed, the time when OFC's representation degrades is exactly when other brain regions such as the mPFC takes over.

Finally, I trained a recurrent actor-critic (AC) network on our behavioral task and it was able to reproduce much of what was observed in the OFC in our imaging experiments. From this model, I realized that the critic network in AC learning actually serves no purpose after the optimal policy has already been learned. Therefore, its value representation can vanish without any effect on behavior. If OFC can be thought of as a critic network, then the brain is likely coming up with a solution that is more efficient at learning multiple tasks than current reinforcement learning models. I am finding constraints on network structure that would cause a network to segment itself into distinct playground and storage modules during training.

<!-- I then adapted this technology to

1. Genetically engineered calcium indicators that convert voltage into light. Instead of listening to waveforms, we directly visualize neural activity through changes in fluorescence. This allows us to track the neural activity of a large population of neurons across time.

2. Microendoscopic lenses. Brain regions thought to underlie associative learning are lodged deep within, and can't be imaged through any conventional methods that only scan the brain surface. But if we implant a lens through the cranium until it is directly on top of these regions, we can see what neurons below are doing. -->
