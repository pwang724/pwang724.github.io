---
layout: default
---

## Evolving Olfactory Circuitry in the Machine

The anatomic and functional organization of the olfactory system is similar in flies and mice despite 600 million years of evolution separating the two species. This is an astounding fact, especially since the circuits are constructed from different gene sets. Are these circuits structurally similar because they are easy to evolve, or because they are optimal for odor sensing? We ([Robert Guangyu Yang](https://www.simonsfoundation.org/team/robert-guangyu-yang/) and I) modeled an artificial neural network after the fly olfactory system and asked whether the machine can evolve the same structural principles if we train it to sense and distinguish odors.

We focus on flies because their olfactory systems are simple and well-characterized. Shown below is a layout of the fly olfactory system (the beautiful images are courtesy of Daisuke Hattori). Olfactory sensory neurons (OSNs) that express the same olfactory receptor (OR) project onto spatially invariant glomeruli. Projection neurons (PNs) sample from a single glomerulus and in turn innervate Kenyon cells (KCs), which integrate input from random combinations of glomeruli to encode odor identity.

<p align="center">
    <video id="video" width="500" autoplay loop controls muted="">
      <source src="/assets/movies/fly.mp4" type="video/mp4" />
    </video>
    <div class="clear"></div>
</p>

The anatomical description of the olfactory system translates quite well to a simple multilayer perception (MLP). So we modeled the olfactory system as a three-layer MLP and trained it to classify odors. In our model network, ORN-to-PN connections are first initialized to be dense and random but are allowed to be modified by training.

<p align="center">
  <img src="/assets/img/fly_model.png" alt="Logo" width="250" align="middle"/>
</p>

Surprisingly, glomeruli with singular connectivity emerge when the network learns to classify odors: each PN strengthens incoming connections from ORNs expressing a given OR and weakens connections from ORNs expressing all other ORs. Moreover, connections segregate until every PN receives input from a different OR. Quite astoundingly, the machine learns to evolve a set of structural principles similar to that observed in the olfactory systems of flies and mice!

<p align="center">
    <video id="video" width="200" autoplay loop controls muted="">
      <source src="/assets/movies/weights.mp4" width="500" height="500" type="
      video/mp4" />
    </video>
    <div class="clear"></div>
</p>

We can now play with all kinds of parameters in the machine model. When we set the number of PNs and KCs in our network to be greater than the amount present within the fly olfactory system, the machine does not do much better at classifying odors. So given limited headspace, the fly olfactory system has evolved an optimal solution for odor sensing.
