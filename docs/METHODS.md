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

## 7. Research bench (tab 9)

Every tool has a seed field; the seed is written into CSV exports. "Run all bench checks" runs each model against the value quoted below.

**Mean-field theory for the Brunel network (Network tab pill).** Stationary rate ν₀ from the self-consistent Siegert formula of Amit & Brunel (1997) and Brunel (2000): 1/ν₀ = τ_rp + τ√π ∫ from (V_r − μ)/σ to (θ − μ)/σ of e^{u²}(1 + erf u) du, with μ = J·C_E·τ·(ν_ext + ν₀(1 − gγ)), σ² = J²·C_E·τ·(ν_ext + ν₀(1 + g²γ)), γ = C_I/C_E. The integrand is evaluated as the scaled complementary error function (Chebyshev fit, fractional error below 1.2·10⁻⁷), integrated by Simpson's rule with 400 intervals; roots are bracketed on a logarithmic grid from 0.001 to 500 Hz and refined by bisection. The formula describes the asynchronous state and is shown for all parameters; it is not expected to hold in synchronous regimes.

**Associative memory.** Hopfield (1982) network, N = 256 units s_i = ±1, w_ij = (1/N) Σ_μ ξ_i^μ ξ_j^μ, w_ii = 0, asynchronous updates in random order s_i ← sign(Σ_j w_ij s_j) (a unit with zero input keeps its state), energy E = −½ Σ w_ij s_i s_j. The five default patterns are geometric shapes with about half the units on and pairwise overlaps of at most 0.25. The capacity experiment uses N = 400, random patterns, loads α = 0.02 to 0.30, and reports the mean overlap after recall started exactly at a stored pattern (8 patterns per load, sequential sweeps to a fixed point). Reference value α_c ≈ 0.138 (Amit, Gutfreund & Sompolinsky 1985).

**Synaptic competition.** Song, Miller & Abbott (2000): τ_m dV/dt = V_rest − V + g_ex(E_ex − V) + g_in(E_in − V), V_rest = −70, E_ex = 0, E_in = −70, threshold −54, reset −60 mV, τ_m = 20 ms, no refractory period. 1000 excitatory Poisson inputs with peak conductances g_a in [0, g_max], g_max = 0.015 (units of the leak conductance), 200 inhibitory Poisson inputs at 10 Hz with conductance 0.05; both conductances decay with 5 ms. STDP with all spike pairs: on a presynaptic spike P_a += A₊, g_a += M·g_max; on a postsynaptic spike M −= A₋, g_a += P_a·g_max for all a; P_a and M decay with 20 ms; A₊ = 0.005, A₋ = 1.05·A₊ by default. Forward Euler, dt = 0.1 ms. All weights start at 0.5·g_max, which is a choice made here.

**Dopamine and prediction error.** TD(λ) with a complete serial compound (tapped delay line): trial of 25 steps of 100 ms, cue at step 5, reward of size 1 at step 20; one weight per step after cue onset; δ_t = r_{t+1} + γV_{t+1} − V_t, e ← γλe + x_t, w ← w + αδe. Before the cue V = 0, so the cue-onset error cannot be learned away. The "after learning" curves are probe trials run with the final weights and no learning.

**Drift-diffusion.** dx = v·dt + s·dW from x = a/2 to absorbing boundaries at 0 and a, s = 0.1, Euler–Maruyama with dt = 1 ms, 2000 trials. To correct for monitoring the boundaries only once per step, both are moved inward by 0.5826·s·√dt (Broadie, Glasserman & Kou 1997). Theory for the pure model: P(correct) = 1/(1 + e^{−av/s²}), mean decision time = (a/2v)·tanh(av/2s²) (Bogacz et al. 2006). Reward rate = P(correct) / (decision time + non-decision time + pause between trials). Drift variability draws v from a normal distribution on each trial; the theory values shown assume none.

**Wilson–Cowan.** τ dE/dt = −E + (1 − E)·S_E(w_EE·E − w_EI·I + P), τ dI/dt = −I + (1 − I)·S_I(w_IE·E − w_II·I), S(x) = 1/(1 + e^{−a(x−θ)}) − 1/(1 + e^{aθ}), a_E = 1.3, θ_E = 4, a_I = 2, θ_I = 3.7, refractory factors 1. Defaults w_EE = 16, w_EI = 12, w_IE = 15, w_II = 3, P = 1.25 (the limit-cycle example of Wilson & Cowan 1972). Heun's method, dt = 0.01 τ, 100 τ per run. Frequency is measured from upward crossings of the mean of E over the last 40 % of the run and converted with the chosen τ (10 ms by default, a free choice).

**Kuramoto.** dθ_i/dt = ω_i + K·r·sin(ψ − θ_i) with r·e^{iψ} = (1/N) Σ e^{iθ_j}, N = 400, forward Euler, dt = 0.02. Natural frequencies are the quantiles of a Lorentzian with half-width γ = 1, which removes sampling noise in the frequencies. Exact result for N → ∞: K_c = 2γ, r = √(1 − K_c/K). The sweep raises K in steps of 0.25 without resetting phases, 30 time units of settling and 30 of averaging per step.

**Hodgkin–Huxley bistability.** Same equations and step as section 1. The sweep changes the current in steps of 0.25 µA/cm² and holds each value for 240 ms (120 ms settling, 120 ms measurement), carrying the state from one value to the next. Optional current noise is white with intensity σ (added as σ·ξ/√dt). The switching experiment first brings the neuron to its rest state at the chosen bias with a 300 ms ramp, applies a 2 ms pulse at 40 ms, and applies a second 2 ms pulse a set delay after the sixth spike. Reference values: Hopf bifurcation at 9.78 µA/cm², fold of limit cycles at 6.26 µA/cm² (Rinzel & Miller 1980).

**Spike-train analyser.** CV = SD/mean of interspike intervals per neuron, averaged over neurons with at least three intervals. CV2 = mean of 2|ISI_{k+1} − ISI_k| / (ISI_{k+1} + ISI_k) (Holt et al. 1996). Fano factor = variance/mean of spike counts in non-overlapping windows, per neuron, averaged over neurons that fired. Pairwise correlation = mean Pearson correlation of the windowed counts over up to 300 random pairs. Autocorrelation = normalised autocovariance of the 1 ms population count, lags ±150 ms, first 60 s. Demo data: Poisson; gamma renewal process of order 8; a two-component mixture of short and long exponential intervals; and an inhomogeneous Poisson process with 10 Hz sinusoidal modulation of depth 0.8 shared by all neurons, generated by thinning.

**Study planner.** Two-sided test, normal approximation with Guenther's correction: n per group = 2(z_{1−α/2} + z_power)²/d² + z²_{1−α/2}/4; paired: n = (z_{1−α/2} + z_power)²/d² + z²_{1−α/2}/2. Clustered assignment multiplies n by the design effect 1 + (m − 1)·ICC. The inverse normal uses Acklam's rational approximation.

**Python export (Neuron tab).** Writes a standard-library Python script with the same equations, time step and pulse as the browser run. Verified to reproduce the browser's spike times for all three models; with noise on, the random numbers differ.

## 8. Accuracy notes

Numbers in lessons (neuron counts, timings, percentages) are textbook values; study findings are paraphrased and should be checked against the original papers before citation. The "find paper" links open a search for each study.

## References (selection)

Hodgkin & Huxley 1952 J Physiol; Izhikevich 2003 IEEE TNN; Izhikevich 2004 IEEE TNN; Bi & Poo 1998 J Neurosci; Brunel 2000 J Comput Neurosci; Siegmund et al. 2014 ICSE, 2017 ESEC/FSE; Floyd et al. 2017 ICSE; Peitek et al. 2018 TSE, 2021 ICSE; Castelhano et al. 2019 Sci Rep; Huang et al. 2019 ICSE; Ivanova et al. 2020 eLife; Liu et al. 2020 eLife; Krueger et al. 2020 ICSE; Prat et al. 2020 Sci Rep; Fritz et al. 2014 ICSE; Prather et al. 2024 ICER; Denny, Leinonen et al. 2024 CACM; Cepeda et al. 2006 Psychol Bull; Dunlosky et al. 2013 PSPI; Roediger & Karpicke 2006 Psychol Sci; Slamecka & Graf 1978; Kapur 2008; Sweller 1988; Mårtensson et al. 2012 NeuroImage; Mechelli et al. 2004 Nature; Bialystok et al. 2007 Neuropsychologia.
