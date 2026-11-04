# Changelog
## 1.6.0 — 2026-11-04

- Network tab: Brunel (2000) sparse LIF network at the paper’s size (12 500 neurons, 15.6 million synapses) as a second model, with regime diagram, the paper’s four example parameter sets, and CV(ISI) readout; adaptive LFP scale.
- Seeded random numbers for all network runs (seed in the UI and in CSV headers).
- Neuron tab: Izhikevich phase plane with nullclines, equations panel with current parameters, and a validation suite of 12 checks against textbook values.
- Methods document extended (sections 3b–3d).

## 1.5.0 — 2026-11-04

- Research tools: lab notebook with context stamps and Markdown/JSON export (key `n`); CSV export of neuron traces, network spikes and LFP; reference library of 79 sources with search links (key `l`).
- Accuracy: three claims in the everyday scenarios tightened (cocktail-party name detection happens in about a third of listeners; the blood-glucose explanation of "hangry" is debated; observed pain engages somatosensory cortex much less, not "not at all").

## 1.4.0 — 2026-10-20

- Modules now connect: lesions made in the Brain map can be applied to the Live brain (tick "apply lesions"); affected regions go dark, their signal flows stop, and the step explains the predicted deficit (patient H.M. style experiments).
- Each scenario opens with a prediction question (which region is active in step 1?) so the tool practises the retrieval it preaches.
- Scenario menu grouped into Learning & memory, Emotions & body, Everyday life, Language learning, Programming.
- Network tab: drug and state presets (normal, caffeine, benzodiazepine/alcohol, anaesthetic, ketamine, seizure) with one-line mechanisms.
- Simulation review recorded in docs/REVIEW.md.

## 1.3.0 — 2026-10-20

- Twelve new live-brain scenarios in both languages (decision, exam stress, phone while studying, social media, pain, insight, reading a novel, cocktail-party attention, hunger, empathy, habits, smell and memory), with five new brain nodes (orbitofrontal cortex, temporoparietal junction, right anterior temporal lobe, olfactory cortex, nose).
- Second Vietnamese review of the lessons file: phrasing polished in seven places.

## 1.2.2 — 2026-10-20

- Vietnamese translation reviewed line by line: standard anatomical terms (hạch hạnh nhân, cúc tận cùng, vi bào đệm, dòng rò, mặt cắt giữa), one mistranslation fixed ("Rửa não" → "Làm sạch não"), "lấy mẫu" (sampling) replaced by "lấy ra các mẫu đã học" (retrieval), slang removed, the Live brain tab renamed "Não hoạt động", and a dozen awkward phrasings smoothed.

## 1.2.1 — 2026-10-20

- Fixed: the EN | VI toggle did not reload the page when the address ended in a `#tab` fragment, so the language only changed after a manual refresh.
- Fixed: the Replay button at the end of a live scenario threw an error (a local variable shadowed the translation function).

## 1.2.0 — 2026-10-20

- Renamed to HaiBrainLab (title, wordmark, About, footer, exports, docs, citation).
- Full content review in both languages; nine corrections recorded in `docs/REVIEW.md` (synapse-count comparison, axon length, neurons at birth, Alzheimer's onset region, amygdala latency, consolidation timescale, flow-state claims, ageing-brain advice, three citation details).

## 1.1.0 — 2026-10-20

- English / Vietnamese language switch (EN | VI in the header, remembered; `?lang=vi` also works). Vietnamese covers the interface, the whole Start here tab, glossary, quiz, brain map, all 20 live scenarios and the Language class. The Programming brain tab stays in English.
- Translation files: `js/i18n.vi.js`, `js/i18n.vi.lessons.js`, `js/i18n.vi.scenarios.js`.


## 1.0.0 — 2026-10-20

- Project restructured: `css/app.css`, `js/app.js`, inline 3D module, `docs/METHODS.md`, `LICENSE` (MIT), `CITATION.cff`.
- Deep links (`#neuron`, `#live/code_ai`), keyboard shortcuts (0–8 for tabs, `g` glossary, `?` About), last tab remembered.
- PNG export on every chart; screenshot buttons on both 3D views.
- About dialog with methods summary, references, shortcuts and version.
- "Find paper" links on every cited study in the Programming brain tab.
- Print stylesheet for the lessons; reduced-motion support; tab roles for assistive technology.
- Programming brain tab: five scenarios, task-by-expertise network diagram, cost-of-easy-answers model, evidence table, study design.

## 0.9 — 2026-10-19

- Start here: 15 beginner lessons, quick checks, progress and badges, facts, glossary and Jargon buster.
- Language class: timeline, equal-time practice simulator, class word test, presentation mode.
- Live brain: 13 animated scenarios with synapse close-up, neurochemistry and EEG panels.
- Brain map: procedural 3D brain with sulci, functional areas, medial cut, gizmo, scale bar, find-the-region game.
- Graphics pass: shared chart engine, membrane ion-channel animation, redrawn synapse, four explanatory figures.
- Fixed per-frame canvas resizing on fractional device pixel ratios (125% display scaling).

## 0.1 — 2026-10-19

- First version: Neuron, Synapse, Network, Brain map (2D), Quiz.
