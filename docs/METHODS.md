# HaiBrainLab — methods and models

This document states exactly what each simulation computes, so results can be interpreted, reproduced and criticised. Version 1.6.0.

## 1. Single neuron (tab 1)

**Hodgkin–Huxley (1952).** Membrane equation `C dV/dt = I − gNa m³h (V − ENa) − gK n⁴ (V − EK) − gL (V − EL)` with C = 1 µF/cm², gNa = 120, gK = 36, gL = 0.3 mS/cm², ENa = +50, EK = −77, EL = −54.4 mV. Gating variables follow `dx/dt = αx(V)(1 − x) − βx(V)x` with the standard rate functions (voltage shifted so rest is −65 mV). Forward Euler, dt = 0.01 ms, 200 ms simulated, every fifth sample plotted. The channel-blocker sliders multiply gNa, gK, gL. The membrane cross-section shows open fractions m³h and n⁴ and currents INa, IK at the cursor time.

**Leaky integrate-and-fire.** `τ dV/dt = −(V − EL) + R·I`, EL = −65 mV, threshold and refractory period from the sliders, reset to −65 mV; dt = 0.1 ms.

**Izhikevich (2003).** `dv/dt = 0.04v² + 5v + 140 − u + I`, `du/dt = a(bv − u)`, reset `v = c, u = u + d` when v ≥ 30 mV. Presets: RS (0.02, 0.2, −65, 8), IB (0.02, 0.2, −55, 4), CH (0.02, 0.2, −50, 2), FS (0.1, 0.2, −65, 2), LTS (0.02, 0.25, −65, 2), TC (0.02, 0.25, −65, 0.05), RZ (0.1, 0.26, −65, 2).

**f–I curve.** Spike count over a 200 ms pulse for I = 0…30 in steps of 1, noise off.

## 2. Synapse (tab 2)

Conductance-based synapse onto a leaky integrate-and-fire cell: `g ← g + gmax·w/3` per released vesicle (three vesicles per presynaptic spike, 1.5 ms delay), `dg/dt = −g/τ`, `Isyn = g (Esyn − V)`, Esyn = 0 mV (AMPA) or −80 mV (GABA-A). Postsynaptic cell: τ = 10 ms, threshold −50 mV, refractory 2 ms.

**STDP.** `Δw = A+ exp(−Δt/τ+)` for Δt > 0 and `−A− exp(Δt/τ−)` for Δt < 0, A+ = 0.01, A− = 0.012, τ± = 20 ms, with soft bounds `w ← w + Δw(1 − w)` (potentiation) or `w + Δw·w` (depression), scaled ×4 per pairing for visibility (Bi & Poo 1998).

## 3. Network (tab 3)

Izhikevich (2003) cortical network: 800 excitatory (a = 0.02, b = 0.2, c = −65 + 15r², d = 8 − 6r²) and 200 inhibitory (a = 0.02 + 0.08r, b = 0.25 − 0.05r, c = −65, d = 2) neurons, all-to-all weights 0.5·rand (excitatory) and −rand (inhibitory), thalamic input 5·N(0,1) (E) and 2·N(0,1) (I), 1 ms steps with two 0.5 ms half-steps for v. Sliders multiply the excitatory and inhibitory columns and the input. The "LFP" is the mean excitatory membrane potential; the spectrum is a Hann-windowed DFT of the last 1024 ms at 1…100 Hz. Synchrony = coefficient of variation of the 1 ms population spike count.

### 3b. Brunel (2000) sparse network (tab 3, "Network model" selector)

Brunel's balanced random network at the size used in the paper: N_E = 10 000 excitatory and N_I = 2 500 inhibitory leaky integrate-and-fire neurons, each receiving C_E = 1000 excitatory and C_I = 250 inhibitory recurrent connections chosen at random (ε = 0.1). Membrane: τ = 20 ms, threshold θ = 20 mV, reset V_r = 10 mV, refractory 2 ms, synaptic delay D = 1.5 ms, forward Euler with dt = 0.1 ms. Excitatory synapses add J = 0.1 mV, inhibitory subtract g·J. External drive: C_E Poisson inputs at rate ν_ext = η·ν_thr with ν_thr = θ/(J·C_E·τ) = 10 Hz, applied in the diffusion limit (per-step increments with mean J·C_E·ν_ext·dt and variance J²·C_E·ν_ext·dt, drawn from a variance-matched uniform distribution; the membrane sums about 200 of them per time constant, so the input is Gaussian by the central limit theorem). A smaller network with C and J rescaled to keep C·J was tried first and rejected: it keeps the mean input but multiplies the input variance by the scaling factor, and the four regimes then collapse into one noise-driven state. The raster, simulated LFP and CV(ISI) use a fixed subset of 1000 E + 250 I neurons; the population rate counts every spike. The regime diagram marks the paper's four example parameter sets (SR: g = 3, η = 2; AI: g = 5, η = 2; SI fast: g = 6, η = 4; SI slow: g = 4.5, η = 0.9); exact regime boundaries are in Brunel 2000, Fig. 2.

### 3c. Reproducibility and analysis

All network randomness (connectivity, parameters, noise) comes from a seeded mulberry32 generator; the seed is shown in the UI, included in CSV exports, and changing it rebuilds the network. The CV(ISI) readout is the coefficient of variation of interspike intervals averaged over neurons with at least three spikes in the last second (≈ 1 for Poisson-like irregular firing, ≪ 1 for regular firing). Synchrony is the CV of the 1 ms population spike count.

### 3d. Validation suite (Neuron tab, "Validate models")

Automatic checks of the simulations against textbook values: HH resting potential (−65 ± 1.5 mV), spike peak (+25 to +50 mV), firing rate at 10 µA/cm² (55–85 Hz), rheobase (1.5–8 µA/cm²), type II onset frequency (≥ 30 Hz), TTX abolishing spikes, TEA reducing the rate, LIF monotonic f–I, Izhikevich RS rate and CH bursting (ISI CV > 0.5), and the STDP window values. The Izhikevich phase plane shows the v- and u-nullclines with the trajectory.

## 4. Brain map and live brain (tabs 4, 5)

The 3D brain is generated procedurally: each hemisphere is a 210-segment sphere deformed (flatter ventral surface, frontal and occipital taper, flat medial wall), with gyri from `|sin(8.5·fBm(p))|` displacement, carved lateral, central and parieto-occipital sulci at analytic positions, a temporal pole bulge, and lobe/area labels assigned by position. Deep structures, cerebellum (with folia) and brainstem are separate meshes. Regions and Brodmann areas are schematic approximations.

Live-brain scenarios are authored sequences of steps; each step lists active nodes, particle flows between node positions, a synapse mode, neurochemical levels (0–1 relative) and a dominant EEG band. They illustrate published accounts; they are not simulations of measured data.

## 5. Language class simulator (tab 6)

Each word has a stability S (days) and last-review time t; recall probability `R = exp(−gap/S)`. New words: S0 = 2 days (1 day without sleep). Session: review due words (R < 0.8, most-forgotten first) at 0.5 min each up to 60 % of the session, then learn new words at 3 min each. Successful recall (R > 0.35) multiplies S by `1.15 + 1.35·g·min(1, gap/S)` where g = 1 for self-testing and 0.55 for re-reading; failed recall resets S to 1.3·S0. Reported: sum of R over words averaged over the final week, and "durable" words with S > 30 days. Illustrative; shapes follow the spacing, testing and sleep literature.

## 6. Cost of easy answers model (tab 7)

For difficulty d (1–5), prior p (0–1), n exercises and support level s (0 none, 1 hint after attempt, 2 worked example then attempt, 3 full solution first):

- fit = 5p − d; own success `σ(1.6·fit + 0.3)`; eventual success with support `σ(1.6·fit + 1.8)` (s=1), `σ(1.6·fit + 2.2)` (s=2), 0.98 (s=3).
- effort = 0.25 + 0.75·clamp((d/5)·[1, 0.78, 0.6, 0.15][s]); generated share gen = [1, 1, 0.8, 0.15][s].
- encoding per exercise K = (0.2 + 0.8·effort)·gen·(0.45 + 0.55·success), ×0.6 for unaided attempts with own success < 0.3 (unproductive struggle); over n exercises Kn = 1 − (1 − K)^(0.35·min(n,6)).
- recall(t) = Kn·exp(−t/(1.5 + 22·Kn)) + (1 − Kn)·0.08·exp(−t/2).
- immediate performance, confidence and frustration are simple monotone functions of success and support (see `js/app.js`, `ceModel`).

These are hypotheses expressing the generation effect, testing effect, desirable difficulties, productive failure and the expertise-reversal effect, to be tested with the measures listed in the tab.

## 7. Accuracy notes

Numbers in lessons (neuron counts, timings, percentages) are textbook values; study findings are paraphrased and should be checked against the original papers before citation. The "find paper" links open a search for each study.

## References (selection)

Hodgkin & Huxley 1952 J Physiol; Izhikevich 2003 IEEE TNN; Izhikevich 2004 IEEE TNN; Bi & Poo 1998 J Neurosci; Brunel 2000 J Comput Neurosci; Siegmund et al. 2014 ICSE, 2017 ESEC/FSE; Floyd et al. 2017 ICSE; Peitek et al. 2018 TSE, 2021 ICSE; Castelhano et al. 2019 Sci Rep; Huang et al. 2019 ICSE; Ivanova et al. 2020 eLife; Liu et al. 2020 eLife; Krueger et al. 2020 ICSE; Prat et al. 2020 Sci Rep; Fritz et al. 2014 ICSE; Prather et al. 2024 ICER; Denny, Leinonen et al. 2024 CACM; Cepeda et al. 2006 Psychol Bull; Dunlosky et al. 2013 PSPI; Roediger & Karpicke 2006 Psychol Sci; Slamecka & Graf 1978; Kapur 2008; Sweller 1988; Mårtensson et al. 2012 NeuroImage; Mechelli et al. 2004 Nature; Bialystok et al. 2007 Neuropsychologia.
