---
layout: default
---

## Evolving Olfactory Circuitry in the Machine

[*Conference Abstract*](https://ccneuro.org/2019/Papers/ViewPapers.asp?PaperNum=1355)

The anatomic and functional organization of the olfactory system is similar in flies and mice despite 600 million years of evolution separating the two species. This is an astounding fact, given that the circuits are constructed from different gene sets. Are these circuits structurally similar because they are easy to evolve, or because they are optimal for odor sensing? We ([Robert Guangyu Yang](https://www.simonsfoundation.org/team/robert-guangyu-yang/) and I) modeled an artificial neural network after the fly olfactory system and asked whether the machine can evolve the same structural principles if we trained it to sense and distinguish odors.

We focus on flies because their olfactory systems are simple and well-characterized. Shown below is a layout of the fly olfactory system (the beautiful images are courtesy of Daisuke Hattori). Olfactory sensory neurons (also known as olfactory receptor neurons, or ORNs) reside in the sensory epithelium (left image). All ORNs that express the same olfactory receptor (OR) project onto spatially invariant glomeruli (right image). Projection neurons (PNs) sample from a single glomerulus and in turn innervate Kenyon cells (KCs), which integrate input from random combinations of glomeruli to encode odor identity. Exhaustive experiments have shown that all KCs receive a random 7 PN inputs out of a possible of 50.

<p align="center">
    <video id="video" width="500" autoplay loop controls muted="">
      <source src="/assets/movies/fly.mp4" type="video/mp4" />
    </video>
    <div class="clear"></div>
</p>

The anatomical description of the olfactory system translates quite well to a simple feed-forward network. So we modeled the olfactory system as a three-layer feed-forward network and trained it to classify odors. In our model network, all connections are initialized to be dense and random but are allowed to be modified by training.

<p align="center">
  <img src="/assets/img/fly_model.png" alt="Logo" width="250" align="middle"/>
</p>

Surprisingly, glomeruli emerge between ORNs and PNs when the network learns to classify odors: each PN strengthens incoming connections from ORNs expressing a given OR and weakens connections from ORNs expressing all other ORs. Moreover, every PN receives input from a different OR.

The machine also learns to sparsen PN-to-KC connections. After training, KCs receives a random set of 7 PN inputs, which is the biological number in the fruit fly olfactory system. Quite astoundingly, the machine learns to evolve a set of structural principles similar to that observed in the olfactory systems of flies and mice.

<p align="center">
    <video id="video" width="200" autoplay loop controls muted="">
      <source src="/assets/movies/weights_glo.mp4" width="500" height="500" type="
      video/mp4" />
    </video>
    <div class="clear"></div>
</p>

<p align="center">
    <video id="video" width="200" autoplay loop controls muted="">
      <source src="/assets/movies/weights_kc.mp4" width="500" height="500" type="
      video/mp4" />
    </video>
    <div class="clear"></div>
</p>

These results appear to be extremely robust to network parameters, and also emerge even when the number of layers or the number of neurons per layer are not constrained. So given limited headspace, the fly olfactory system has evolved an optimal solution for odor sensing. To see why, see the conference paper above.
