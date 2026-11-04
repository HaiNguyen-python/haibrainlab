# Content review — 2026-10-20 (v1.2.0)

A full pass over every lesson, glossary entry, quiz item, region description, live scenario, the Language class and the Programming brain evidence table, in English and Vietnamese. Each statement was checked against standard neuroscience sources (Kandel et al., *Principles of Neural Science*; Purves et al., *Neuroscience*; Walker, *Why We Sleep*; the cited primary papers). Corrections were applied in both languages.

## Corrected

| Where | Was | Now | Why |
|---|---|---|---|
| Facts card | "More synapses in one cubic millimetre of cortex than stars in the Milky Way" | About a thousand times more synapses in the whole brain (~10¹⁴) than stars in the Milky Way (10¹¹) | A cubic millimetre of cortex holds about 10⁹ synapses, fewer than the galaxy's stars; the popular line is a misquote. |
| Lesson 1 | Axon "a metre long (brain to toe)" | "from the lower spinal cord to the toe" | The metre-long axons are sciatic motor and sensory fibres; no single axon runs from the brain to the toe. |
| Lesson 10 | "Almost all the neurons you will ever have exist at birth" | Most cortical neurons exist at birth; the cerebellum keeps adding granule cells through the first year | Cerebellar granule neurogenesis, which produces the majority of all neurons, is largely postnatal. |
| Lesson 13 | Alzheimer's: "the hippocampus goes first" | "the entorhinal cortex and hippocampus go first" | Tau pathology begins in the entorhinal cortex (Braak staging) before the hippocampus proper. |
| Fear scenario, pathway, quick check | Thalamus-to-amygdala alarm "in ~12 ms" | "within a few tens of milliseconds (about 12 ms in rat experiments)" | The 12 ms figure is from rodent recordings (LeDoux); human latencies are longer and less precisely known. |
| Learning scenario | "after weeks the hippocampus is no longer needed" | "over weeks to months the hippocampus is needed less and less" | Systems consolidation in humans takes months to years, and the hippocampus may stay involved for detailed episodic memories. |
| Focus scenario | "transient hypofrontality" stated as fact; "after roughly 90 minutes" | marked as a hypothesis; "after an hour or two" | Hypofrontality during flow is a hypothesis (Dietrich 2003), not an established finding; the 90-minute ultradian limit is folklore. |
| Facts card | "30 minutes a day in a new environment is one of the best things for an ageing brain" | learning, exercise, sleep and social contact are the best-supported habits | The original was an unsupported specific prescription. |
| Programming evidence | Siegmund et al. 2017 listed at ICSE; Lee et al. "2018"; spatial-training citation "Bockmon et al. 2020" | ESEC/FSE 2017; Lee et al. BIBE 2016; Cooper et al. 2015 | Venue and attribution corrections. |

## Checked and kept (with the simplification noted)

- Neuron counts (86 billion neurons, similar number of glia, 69 billion in the cerebellum, ~16 billion in cortex) follow Azevedo et al. 2009.
- "100 trillion synapses" is the common mid-range estimate; published values span 10¹⁴–10¹⁵.
- "About a third of the cortex works on vision" is the usual textbook figure for primates; estimates range 20–30 % in humans.
- Caffeine half-life 5–6 h is an average; it ranges from about 2 to 10 h between people.
- Bilingualism delaying dementia symptoms by ~4 years follows Bialystok et al. 2007; later studies are mixed, and the page says so.
- Kuhl's window for losing foreign sound contrasts (6–12 months) is a population average; some sensitivity persists.
- The 0.5–1 mV size of a single EPSP, the −65/−50/+40 mV voltages, the 1 ms spike and 2 ms refractory period are textbook typical values; real neurons vary.
- Brodmann numbers for functional areas are the conventional assignments; boundaries vary between individuals.
- All Izhikevich preset parameters match Izhikevich (2003, 2004). Hodgkin–Huxley parameters match the 1952 squid-axon model shifted to a −65 mV rest.
- Fruit-fly connectome: 139,255 neurons and over 50 million synapses (FlyWire, 2024), rounded to 140,000 in the text.
- Study summaries in the Programming brain tab are paraphrases; check the originals before quoting them in academic writing.

## Not claimed as measured

The 3D brain, the live scenarios, the language simulator and the cost-of-easy-answers model are illustrative models; the page labels them as such wherever they appear.


# Simulation review — 2026-10-20 (v1.4.0)

What was checked in the numerical models, and what changed.

- **Hodgkin–Huxley**: parameters, rate functions and the −65 mV shift match the standard formulation; forward Euler at 0.01 ms is stable for these conductances. Type II f–I behaviour (abrupt onset near 50 Hz) is the expected squid-axon result. No change.
- **Integrate-and-fire and Izhikevich**: reset, refractory and preset parameters match the sources. Izhikevich is integrated at 0.1 ms, finer than the 0.5 ms half-steps used in the network. No change.
- **Synapse**: conductance-based, with AMPA and GABA-A reversal potentials; vesicle release is deterministic (three vesicles per spike), which is a simplification of probabilistic release. STDP window and soft bounds follow Bi & Poo. No change.
- **Network**: faithful to Izhikevich 2003 (all-to-all, 800/200, thalamic noise). All-to-all coupling is less realistic than sparse connectivity (Brunel 2000) but reproduces the known alpha/gamma regimes; sparse connectivity is listed as future work. Added drug and state presets that only move the three gains, with the mechanism stated as a simplification.
- **Live brain**: scenarios are authored illustrations, not simulations. Two gaps were closed: lesions from the Brain map now affect scenarios (regions go dark, flows stop, deficit shown), and each scenario begins with a prediction question so that the learner retrieves before watching.
- **Language and easy-answers models**: unchanged; equations in METHODS.md.


# Addendum — 2026-11-04 (v1.5.0)

Third pass, focused on the twelve everyday scenarios added in v1.3.0 and the network presets. Three statements were tightened:

| Where | Was | Now |
|---|---|---|
| Hearing your name (step 2) | own name "checked even when you are not listening" | can be picked up; in the classic dichotic-listening experiments about a third of listeners noticed their name in the ignored ear (Conway, Cowan & Bunting 2001). |
| Hunger (step 2) | "a low-glucose prefrontal cortex is weaker at self-control" | hunger makes prefrontal self-control harder; how much blood glucose itself contributes is debated. |
| Empathy (step 1) | observed pain activates cingulate and insula "but not the somatosensory cortex" | "much less" the somatosensory cortex; some studies do find sensory activation (Singer et al. 2004 vs later work). |

Checked and kept: loss aversion of roughly 2:1 (Kahneman & Tversky), the inverted-U of arousal and prefrontal function (Arnsten 2009), attention residue (Leroy 2009) and the smartphone "brain drain" (Ward et al. 2017), gate-control theory and swearing analgesia, the right anterior temporal gamma burst about 300 ms before insight (Jung-Beeman et al. 2004), the 66-day habit average (Lally et al. 2010), smell-cued memories peaking in the first decade (Willander & Larsson 2006), ghrelin/leptin changes with sleep loss (Spiegel et al. 2004), and the mechanisms stated for caffeine, benzodiazepines, anaesthetics and the seizure preset. The ketamine preset remains marked as a simplification.

## Simulation review, v1.6.0 (2026-11-05)

- **Brunel 2000 network, scaling check.** A first version used 1250 neurons with C = 100 and J = 1 mV (C·J preserved). All four parameter sets then gave 40–60 Hz with CV(ISI) ≈ 1.5–2: rescaling J multiplies the input variance by the scaling factor, so the network is noise-driven whatever g and η are. The model was rebuilt at the paper's size (12 500 neurons, 15.6 million synapses, J = 0.1 mV). With seed 12345 the four example points now separate as the paper describes: SR (g = 3, η = 2) fires near saturation (≈ 330 Hz, CV ≈ 0.02, synchronous); AI (g = 5, η = 2) ≈ 37 Hz, CV ≈ 0.4–0.5, flat LFP; SI fast (g = 6, η = 4) ≈ 58 Hz, CV ≈ 0.7, large fast LFP swings; SI slow (g = 4.5, η = 0.9) ≈ 6 Hz with an LFP peak near 20 Hz. Numbers are from 0.6–1.3 s runs and will move with the seed and window; the fast SI oscillation (above 100 Hz) lies outside the spectrum panel's range.
- **Validation suite.** A first "TEA lowers the firing rate" check failed: in the HH model, reducing gK to 0.2 raises the rate (shorter after-hyperpolarisation) rather than lowering it, so the check was wrong, not the model. Replaced by the textbook effect, spike broadening (width at −20 mV, ratio ≥ 1.2). All 12 checks pass on the current build.
