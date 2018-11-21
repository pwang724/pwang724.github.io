---
layout: default
---

## Evolving a Neural Circuit that Supports Angular Integration

Close your eyes and now turn your head. Despite not having feedback from your surroundings, you still have a good idea of where your head is facing. How do our brains know where our head is? The neural circuit that supports this sense of self-knowledge must do two things. The circuit must generate an estimate of head direction and hold that estimate through time. Second, it must change its estimate in accordance with the speed and duration of a head turn.

A simple realization of such a circuit was proposed more than 20 years ago[<sup>1</sup>](https://papers.nips.cc/paper/890-a-model-of-the-neural-basis-of-the-rats-sense-of-direction). This schematic has two modular components. First, a 'ring attractor' circuit maintains head direction in the absence of input (image below). Every neuron within the ring encodes a different angle in space. A collection of adjacent neurons are generally co-active, and is called a bump. If the top-most bump is active, then this circuit is telling you that your head is facing north. A connectivity profile of local excitation and global inhibition for every neuron ensures that a singular bump remain persistently active without external input.

<p align="center">
  <img src="/assets/img/bump_attractor.png" alt="Logo" width="250" align="middle"/>
</p>

How does this circuit update position using turning input? Another circuit is built on top of the attractor and shifts the bumps left or right depending on whether the head is turning left or right, respectively (image below, taken from [here](https://www.nature.com/articles/nature22343)). The blue ring of neurons in the center represents the ring attractor, and each blue neuron can be thought of as a bump. When the head is turning right, this rightward turn activates the orange neuron above the bump more so than the orange neuron below. This asymmetry in activation drives the activation of the bump immediately to the right, which causes a shift in bump position. This will repeat again and again as long as there is an external input. The set of orange neurons within the ring attractor likewise shifts the bump left when the head is turning left. This is how a neural can integrate angular velocity to update position.

<p align="center">
  <img src="/assets/img/head_direction_schematic.png" alt="Logo" width="600" align="middle"/>
</p>

Quite amazingly, two research groups [<sup>2</sup>](https://www.nature.com/articles/nature22343)<sup>,</sup>[<sup>3</sup>](https://elifesciences.org/articles/23496) independently uncovered a physical instantiation of such a circuit within the fruit fly nervous system for tracking head direction. There is a literal ring of neurons within the fly brain that functions like a ring attractor. Moreover, two different sets of neurons are set up to shift bump activity left and right, much like what was originally theorized.

What does the machine build to solve the task of head direction integration? Is it similar to the biological solution, and if so, will it reveal missing circuit components that haven’t been found yet but is necessary for tracking head direction? We built a recurrent neural network and trained it to update head direction in response to turning velocity. The machine indeed learns to integrate turning motion to produce an accurate estimate of its current head orientation. Through this process, it produces a ring attractor! Shown below is the connection weight matrix from ring neurons to ring neurons. Ring neurons send strong excitatory connections to immediate neighbors (2-3 neurons apart) but inhibit neighbors that are about 45 degrees away (4-6 neurons apart). Therefore, there is local excitation and global inhibition. It differs from theoretical models in that ring neurons do not much care to inhibit far away neighbors that are 180 degrees away (~10 neurons apart).

<p align="center">
  <img src="/assets/img/W_h_aa.png" alt="Logo" width="400" align="middle"/>
</p>

How does the machine learn to respond to turning input? It also learns to produce two sets of neurons, one that shifts weights leftwards and another rightwards (figure below). One set of neurons (dotted red neurons) are activated by the concomitant activity of a turn right command and a ring neuron, and shifts the ring attractor bump (in black) rightwards. Another set of neurons are activated by a turn left command (dotted blue neurons) and shift the ring neurons leftwards through the same mechanism. These neurons also inhibit ring neurons that are in the direction opposite of the turning motion. While this has not been revealed by experiments thus far, it may be an essential component for stable angular integration.

<p align="center">
  <img src="/assets/img/head_direction_machine.png" alt="Logo" width="600" align="middle"/>
</p>

Interestingly, this mechanism only emerges if we impose within the machine a penalty for making lots of connections and for having lots of active neurons. Such a cost is metabolic in nature. Putting in such a penalty forces the circuit to come up with a lean solution that is stripped bare of non-essentials, which is what we observe, and which is also what exists in biology. The machine therefore has evolved the same structural principles as biology in solving a dynamic task. Such a circuit is likely fed into a broader circuit that is used for path integration, and we are currently investigating the architecture that a machine builds to determine its own position within 2-D space.
