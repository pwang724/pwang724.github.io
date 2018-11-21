---
layout: default
---

## Evolving a Neural Circuit that Supports Angular Integration

Close your eyes and now turn your head. Despite not having feedback from your surroundings, you still have a good idea of where your head is facing. How do our brains compute head direction, with and without movement? The neural circuit that supports this sense of self-knowledge must do two things. You can't think that your head is somewhere else if it hasn't moved. So, without any motion, the circuit must generate an estimate of head direction that is persistently maintained and is relatively insensitive to noise. Second, this circuit must change its estimate of head direction in accordance with the speed and duration of a head turn.

A simple realization of such a circuit[<sup>1</sup>](https://papers.nips.cc/paper/890-a-model-of-the-neural-basis-of-the-rats-sense-of-direction) was proposed almost 20 years ago. This schematic has two modular components. First, a 'ring attractor' circuit maintains head direction in the absence of input (as shown below). Every neuron within the ring encodes a different angle in space. If the top-most bump of neurons are active, then this circuit is telling you that your head is facing north. A profile of local excitation and global inhibition ensures that a singular bump remain active without external input, so that your estimate doesn't change over time. Moreover, you can't have two different estimates at the same time: in other words, such a circuit should not be telling you that your head is facing eastward and westward at the same time, because that wouldn't make any sense. The connectivity profile of a bump attractor also ensures that one bump will outcompete all other bumps so that two bumps can never co-exist in the same ring.

<p align="center">
  <img src="/assets/img/bump_attractor.png" alt="Logo" width="250" align="middle"/>
</p>

How does this circuit deal with turning signals? Another circuit is piled on top of the attractor and shifts the bumps left or right depending on whether the head is turning left or right, respectively (image below, taken from [here](https://www.nature.com/articles/nature22343)). The center ring of blue neurons is the bump attractor circuit, and each blue neuron can be thought of as a bump. Let's look at the neurons outside of the ring: the head is turning right, and this right-ward turn activates the orange neuron above the bump more so than that below. This asymmetry in activation drives a right-ward turn by activating the rightward bump more than the left. This repeats again and again as long as there is an external input activating these set of shifter neurons, and current position is thus updated according to motion.

<p align="center">
  <img src="/assets/img/head_direction_schematic.png" alt="Logo" width="600" align="middle"/>
</p>

Quite amazingly, two research groups [<sup>2</sup>](https://www.nature.com/articles/nature22343)<sup>,</sup>[<sup>3</sup>](https://elifesciences.org/articles/23496) independently uncovered a physical instantiation of such a circuit within the fruit fly nervous system for tracking head direction. There is quite literally a ring of neurons within the fly brain that functions like a bump attractor. Moreover, two different sets of neurons are set up to shift bump activity left and right, much like what was originally theorized.

What does the machine build to solve the task of head direction integration? Is it similar to the solution that biology has came up with, and if so, will it reveal missing circuit components that haven’t been found yet but is necessary for tracking head direction? We built a recurrent neural network and trained it to report back head direction in response to turning velocity. Not surprisingly, the machine learns to integrate turning motion to produce an accurate estimate of its current head orientation. During this process, the machine learned to produce a ring attractor! Shown below is the connection weight matrix from ring neurons to ring neurons. Ring neurons send strong excitatory connections to immediate neighbors (2-3 neurons apart) but inhibit neighbors that are about 45 degrees away (4-6 neurons apart). It differs from theoretical models in that it does not much care to inhibit far away neighbors that are 180 degrees away (~10 neurons apart).

<p align="center">
  <img src="/assets/img/W_h_aa.png" alt="Logo" width="400" align="middle"/>
</p>

How does the machine learn to respond to turning input? It also learns to produce two sets of neurons, one that shifts weights leftwards and another rightwards (figure below). One set of neurons (dotted red neurons) are activated by a turn right command and in turn shifts the ring attractor bump (in black) rightward. This is accomplished since the dotted red neuron activates the ring neuron on its right and silences the ring neuron on its left. Another set of neurons are activated by a turn left command (dotted blue neurons) and shift the ring neurons leftwards through the same mechanism.

<p align="center">
  <img src="/assets/img/head_direction_machine.png" alt="Logo" width="600" align="middle"/>
</p>

Interestingly, this mechanism only emerges if we impose within the machine a penalty for making lots of connections and for having neurons be active all the time. Such a cost is metabolic in nature, since it is energetically costly to make lots of connections and to have a bunch of neurons firing all the time. Putting in such a penalty forces the circuit to come up with a lean solution that is stripped bare of non-essentials, which is what we observe, and which is also what exists in biology.

The inhibition of ring neurons that is in the direction opposite of the turning motion has not been revealed by experiments thus far, and may be an essential component for angular integration. The machine therefore has evolved the same structural principles as biology in solving a dynamic task, and circuit components not previously found has been revealed in the process. Such a circuit is likely fed into a broader circuit that is used for path integration, and we are currently investigating the architecture that a machine builds to determine its own position within 2-D space. 
