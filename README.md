# HaiBrainLab

Version 1.6.0 · MIT License · [Changelog](CHANGELOG.md) · [Methods](docs/METHODS.md) · [Content review](docs/REVIEW.md) · [Cite](CITATION.cff)

An interactive neuroscience simulator for learning how the brain works, from a single ion channel up to whole-brain pathways, with classroom and research modules. Runs entirely in the browser; nothing is collected.

## Project structure

```
brain-lab/
  index.html        page, markup for all tabs, and the inline three.js 3D module
  css/app.css       stylesheet (dark theme, print stylesheet, reduced motion)
  js/app.js         simulations, lessons, tabs, export, About dialog
  docs/METHODS.md   every model's equations and parameters
  CITATION.cff, CHANGELOG.md, LICENSE
```

The 3D module stays inline because browsers block module scripts loaded from `file://`, and the page is meant to work when double-clicked.

## Languages

EN | VI switch in the header (remembered in the browser; `index.html?lang=vi` also works). Vietnamese covers the interface, the whole Start here tab, the glossary, the quiz, the brain map, all live scenarios and the Language class. The Programming brain tab is English only, since it is research material with English references. To add a language, copy `js/i18n.vi.js` (and the lessons and scenarios files) to a new code, translate the strings, and register it in `window.I18N`.

## Research tools

- **Lab notebook** (📝 in the header, or key `n`): notes saved in the browser, each stamped with what you were looking at (tab, model and parameters, scenario and step, selected region, lesions). Export as Markdown or JSON.
- **CSV export**: the Neuron tab exports the current trace (time, voltage, gating variables or recovery variable, injected current); the Network tab exports the last second of spikes (time, neuron, E/I) and the last 1024 ms of the simulated LFP. Load them in Python or R for analysis.
- **Reference library** (📚, or key `l`): every study and book the app draws on, grouped by topic, searchable, with search links. Citation details should be confirmed against the originals.

## Science layer

- **Brunel 2000 reproduction**: switch the Network tab to the sparse leaky integrate-and-fire model, click the regime diagram or the paper's four example points (SR, AI, SI fast, SI slow) and compare the raster, rate, CV(ISI) and spectrum with the published regimes.
- **Reproducible runs**: a random seed controls connectivity, parameters and noise; the seed is written into CSV exports.
- **Analysis readouts**: CV of interspike intervals and population synchrony on the Network tab; Izhikevich phase plane with nullclines, and an equations panel with the current parameters, on the Neuron tab.
- **Validation suite**: one click runs the neuron and synapse models against textbook values and reports pass/fail with references.

## Sharing, shortcuts, export

- Deep links: `index.html#neuron`, `#code`, and live scenarios such as `#live/code_ai` or `#live/learn`.
- Keyboard: `0`–`8` switch tabs, `g` opens the glossary, `?` opens About, `Esc` closes dialogs.
- Hover any chart for a PNG download; both 3D views have a screenshot button.
- Print the Start here or Programming brain tab for a handout; controls are hidden and colours switch to print-friendly.

## Run it

Open `index.html` directly, or serve the folder:

```bash
py -m http.server 8129 --bind 127.0.0.1 --directory brain-lab
```

then visit http://localhost:8129.

## What is inside

| Level | Module | Model |
|---|---|---|
| 0 | Start here | Fifteen plain-language lessons for complete beginners: the brain's building blocks, how a neuron fires, synapses and the key chemicals, networks and brain waves, the brain map, learning and memory with study tips, feelings, the senses (with a reaction-time test), sleep and the body clock, the brain across a lifetime, language and the bilingual brain, everyday substances and medicines, brain disorders, research methods, and a timeline of famous experiments. Each lesson ends with a quick-check question; answering it marks the lesson learned, with progress and badges saved in the browser. Also a rotating "did you know" card, a myths-versus-facts table and a 54-term glossary, reachable from every tab via the "Jargon buster" button |
| 1 | Neuron | Hodgkin–Huxley (1952) with gating variables m, h, n; leaky integrate-and-fire; Izhikevich (2003) with 7 cell-type presets; f–I curves; channel-blocker experiments (TTX, TEA) |
| 2 | Synapse | Conductance-based AMPA / GABA-A synapse with vesicle release animation, temporal summation; STDP learning window after Bi & Poo (1998) with repeated-pairing protocol |
| 3 | Network | Izhikevich (2003) cortical network: 800 excitatory + 200 inhibitory neurons, raster, population rate, simulated LFP and its frequency spectrum with EEG bands; seizure, anaesthesia and stimulus experiments. Second model: Brunel (2000) sparse balanced network at paper size (10 000 E + 2 500 I leaky integrate-and-fire neurons, 15.6 million synapses) with regime diagram, seed and CV(ISI) |
| 4 | Brain map | Rotatable 3D brain (three.js) generated procedurally: two hemispheres with noise-based gyri, carved and labelled central, lateral (Sylvian) and parieto-occipital sulci, temporal pole, medial wall, cerebellum with folia, brainstem, corpus callosum, and deep structures (thalamus, basal ganglia, hippocampus, amygdala, hypothalamus) in X-ray mode. Three colour modes: lobes, functional areas with Brodmann numbers (M1, S1, V1, A1, Broca, Wernicke, premotor, prefrontal, posterior parietal, visual and temporal association), and plain specimen. Standard anatomical views (lateral, dorsal, anterior, ventral, medial cut with the left hemisphere removed), orientation gizmo (A/P, S/I, L/R), live 5 cm scale bar, hover tooltips naming area, Brodmann area and hemisphere. 12 clickable regions with function, functional-area list, lesion effects and chemistry; lesion simulation; 5 animated signal pathways; a "find the region" game (8 rounds, deep structures included in X-ray mode). Falls back to a 2D SVG map if three.js cannot be loaded |
| 5 | Live brain | Thirty-two animated 3D scenarios of what happens inside the brain: learning a word, practising a skill, sleep, recall, fear, joy, chronic stress, love, deep focus, music, running, grief, meditation, two language-learning scenarios, five programming scenarios, and everyday cases such as making a decision, exam stress, studying with a phone nearby, scrolling social media, stubbing a toe, the aha moment, reading a novel, hearing your name in a noisy room, hunger and eating, empathy, building and breaking a habit, and a smell that brings back a memory. Each step glows the active regions, streams particle signals along the pathways, quietens suppressed regions (blue), and updates three side panels: a synapse close-up (rest, LTP, dopamine tagging, replay, pruning, cortisol damage, GABA inhibition, myelination), eight neurochemical levels (dopamine, noradrenaline, acetylcholine, serotonin, cortisol, oxytocin, GABA, endorphins) and the dominant EEG rhythm |
| 6 | Language class | A classroom demonstration of what frequent language practice does to the brain: an animated six-stage timeline (day 1 to fluent, plus "what if you stop") with glowing areas, growing connections and meters for effort, speed, accuracy, automaticity, myelin and vocabulary; a forgetting-curve simulator comparing two learners with equal weekly time (cramming vs little-and-often, with sleep and self-testing toggles); a 30-second class word-memory test with explanation; buttons that play two language scenarios on the 3D live brain; teacher talking points with sources; a presentation mode with large text and fullscreen |
| 7 | Programming brain | A research view for computing education: five 3D scenarios on the live brain (reading code as a novice, hunting a bug, writing from a task, the expert brain, AI solution vs working it out), a network diagram that changes with task (read, debug, write, data structure, read a solution) and expertise with cognitive-load meters, a "cost of easy answers" model comparing four support strategies (immediate performance, encoding, one-week recall, confidence, frustration), an evidence table of fMRI/fNIRS/EEG studies of programmers, and a study-design section with hypotheses H1–H5 and measures |
| 8 | Quiz | 28-question pool, 10 per round, each explanation points back to an experiment |

Each tab has a lesson panel with guided "Try this" experiments that set the sliders for you.

The 3D brain loads three.js 0.160 from jsdelivr, so the brain map tab needs an internet connection the first time; everything else works offline.

## Graphics

All charts share one canvas engine with filled curves, glow, swatch legends, annotations with leader lines and a time cursor. The Neuron tab adds a membrane cross-section that shows sodium and potassium channels opening, the inactivation gate plugging the channel, ion flow and the phase of the spike at the cursor time, with a slow-motion replay. The Synapse tab shows vesicle fusion, transmitter crossing the cleft, receptors opening and ions entering the spine. Start here includes an annotated action potential, the five EEG bands, a hypnogram of a night's sleep and a lifetime curve of synapse density against reward and prefrontal maturity.

## Model notes

- HH integrated with forward Euler at dt = 0.01 ms, standard squid-axon parameters (gNa 120, gK 36, gL 0.3 mS/cm²; ENa +50, EK −77, EL −54.4 mV).
- Izhikevich network uses the original all-to-all random weights (0.5·rand excitatory, −rand inhibitory) and thalamic noise (5·randn / 2·randn), two half-steps of 0.5 ms per ms.
- LFP is the mean excitatory membrane potential; spectrum is a Hann-windowed DFT over the last 1024 ms.
- STDP: A+ = 0.01, A− = 0.012, τ = 20 ms, soft bounds on the weight.

## Next steps toward a research-grade project

- Replace the all-to-all cortex with distance-dependent connectivity and conduction delays.
- Add a Python companion (Brian2) that reproduces each tab's experiment with a test checking firing rates against the browser version.
- Load real recorded neurons from the Allen Cell Types Database and fit Izhikevich parameters to them.
