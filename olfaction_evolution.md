---
layout: default
---

## Evolving Olfactory Circuitry in the Machine

The anatomic and functional organization of the olfactory system is similar in flies and mice despite 600 million years of evolution separating the two species. Are these circuits structurally similar because they are easy to evolve, or because they are optimal for odor sensing? We modeled an artificial neural network after the fly olfactory system and asked whether the same structural principles can also emerge in the machine when it learns to perform complex odor classification.

We focus on flies because their olfactory systems are simple and well-characterized. Shown below is a layout of the olfactory system (courtesy of Daisuke Hattori). Olfactory sensory neurons (OSNs) that express the same olfactory receptor (OR) project onto spatially invariant glomeruli. Projection neurons (PNs) sample from a single glomerulus and in turn innervate Kenyon cells (KCs), which integrate input from random combinations of glomeruli to encode odor identity.

<div id="wrapper">
    <video id="home1" width="800" height="400" autoplay loop controls muted="">
      <source src="/assets/movies/fly.mp4" type="
      video/mp4" />
    </video>
    <div class="clear"></div>
</div>

In our model network, ORN-to-PN connections are first initialized to be dense and random but are allowed to be modified by training. Surprisingly, glomeruli with singular connectivity emerge when the network learns to classify odors: each PN strengthens incoming connections from ORNs expressing a given OR and weakens connections from ORNs expressing all other ORs. Moreover, connections segregate until every PN receives input from a different OR. We further show that a network whose ORN-to-PN connections are constrained to be all-to-all and random performs worse than this determined pathway. Moreover, we find that classification performance plateaus when the number of PNs and KCs in our network increase past the amount present within the fly olfactory system. This study indicates that the machine evolves a set of structural principles similar to that observed in the olfactory systems of flies and mice, and may provide insight into the functional logic of these organization.

<div id="wrapper">
    <video id="home1" width="400" height="400" autoplay loop controls muted="">
      <source src="/assets/movies/weights.mp4" type="
      video/mp4" />
    </video>
    <div class="clear"></div>
</div>
