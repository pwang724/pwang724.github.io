---
layout: default
---

## Evolving a Neural Circuit that Supports Angular Integration

Close your eyes and turn your head. Despite not having feedback from your surroundings, you still have a good idea of where your head is facing. How do we do this?

If we know how fast our head is turning, then this can be used to update the current estimate of head direction. A conceptual realization of a neural circuit capable of computing head direction without sensory feedback was proposed more than 20 years ago[<sup>1</sup>](https://papers.nips.cc/paper/890-a-model-of-the-neural-basis-of-the-rats-sense-of-direction). This schematic has two modular components: ring neurons maintain current head direction, and angular velocity (AV) neurons update head direction in response to movement.

Ring neurons (image below) are a set of neurons connected to form a topological ring. The angular estimate of the current head direction is encoded in the radial position of the set of active neurons in this ring, called a bump. Local excitation between adjacently connected ring neurons allow activity to be maintained over time, and long-range inhibition between non-neighboring neurons limits the size of the activity bump to be a subset of ring neurons.

<p align="center">
  <img src="/assets/img/bump_attractor.png" alt="Logo" width="250" align="middle"/>
</p>

 Turning motion activates a separate population of either left and right angular velocity neurons, and these neurons are asymmetrically connected to ring neurons and cause the bump to move in the direction of motion.


How does this circuit update position when the head turns? AV neurons shift the bumps left or right depending on whether the head is turning left or right, respectively (image below, taken from [here](https://www.nature.com/articles/nature22343)). The blue ring of neurons in the center represents the ring attractor. The orange ring of neurons on the outside represents right-shifting AV neurons, whereas the orange ring on the inside represents left-shifting AV neurons. When the head is turning right, this rightward turn activates the right-shifting orange neuron above the bump more so than the left-shifting orange neuron below. This asymmetry in activation drives the activation of the ring neuron immediately to the right of the current ring neuron, and causes a shift in ring position. This will repeat again and again as long as there is a right-turn input. The set of orange neurons inside the ring attractor likewise shifts the bump left when the head is turning left. This is how a neural network can integrate angular velocity to update position.

<p align="center">
  <img src="/assets/img/head_direction_schematic.png" alt="Logo" width="600" align="middle"/>
</p>

Quite amazingly, two research groups [<sup>2</sup>](https://www.nature.com/articles/nature22343)<sup>,</sup>[<sup>3</sup>](https://elifesciences.org/articles/23496) independently uncovered a physical instantiation of such a circuit within the fruit fly nervous system for tracking head direction. There is a literal ring of neurons within the fly brain that functions like a ring attractor. Moreover, two different sets of neurons are set up to shift bump activity left and right, much like what was originally theorized.

This seems too good to be true - rarely does theory agree with experimental evidence. Could this be the only instantiation that supports head direction integration? To test this, we trained a recurrent neural network to update head direction in response to turning velocity. The machine indeed learns to integrate turning motion to produce an accurate estimate of its current head orientation. Through this process, it produces a ring attractor! Shown below is the connection weight matrix from ring neuron to ring neuron. Ring neurons send strong excitatory connections to immediate neighbors (2-3 neurons apart) but inhibit neighbors that are about 45 degrees away (4-6 neurons apart). Therefore, this network exhibits local excitation and global inhibition.

<p align="center">
  <img src="/assets/img/W_h_aa.png" alt="Logo" width="400" align="middle"/>
</p>

How does the machine learn to respond to turning input? It also learns to produce two sets of AV neurons, one that shifts weights leftwards and another rightwards (figure below). One set of neurons (dotted red neurons) are activated by the concomitant activity of a turn right command and a ring neuron, and shifts the ring attractor bump (in black) rightwards. Another set of neurons are activated by a turn left command (dotted blue neurons) and shift the ring neurons leftwards through the same mechanism. These neurons also inhibit ring neurons that are in the direction opposite of the turning motion. While inhibitory connections has not been revealed by experiments thus far, it may be an essential component for stable angular integration.

<p align="center">
  <img src="/assets/img/head_direction_machine.png" alt="Logo" width="600" align="middle"/>
</p>

The machine therefore has evolved the same structural principles as biology in solving a dynamic task. Such a circuit is likely fed into a broader circuit that is then used for path integration, and we are currently investigating the architecture that a machine builds to determine its own position within 2-D space.
