# Blog Materials: Decomposition Learning for Robot Manipulation

**Project**: Can we make robot manipulation policies more data-efficient and cross-embodiment by
explicitly separating the "move to contact" part (geometric, solvable with motion planning) from
the "do the contact" part (physics-dependent, needs learning)?

**Task**: PegInsertionSide-v1 in ManiSkill3 (Franka Panda robot, peg-in-hole)

**Audience**: Portfolio / hiring + robotics practitioners

**Story arc**: Full journey — idea, implementation, negative result, diagnosis, fix attempt (ongoing).

---

## Story Arc (for the writer)

### Act 1 — The Idea
- End-to-end IL (Diffusion Policy) learns everything from scratch. Wasteful.
- Geometric part (moving to position) can be solved analytically.
- Contact part (compliant insertion under uncertainty) actually needs learning.
- Key design: policy input = relative TCP-to-hole position (not joint angles) → embodiment-agnostic.
- Claim: better data efficiency + zero-shot transfer to new robot arms.

### Act 2 — Building the Baseline
- 996 expert demos from ManiSkill3 motion planner.
- E2E Diffusion Policy with `pd_joint_delta_pos` control (not absolute joint angles).
- Important mistake: initially trained on full 996 demos with no held-out test set.
  - Lesson: for comparative experiments, you need a proper train/test split.
- Fixed: 800 train / 200 test split. Final E2E result: **65.5% on held-out set** (200k steps).

### Act 3 — The Contact Policy
- Split each demo trajectory at contact onset (first frame where force > 0.1N).
- Average contact part: ~29 steps (short!), starting from ~5cm out.
- Train Diffusion Policy only on contact segments.
- Sweep: 50, 100, 200, 500, 796 demos. Best: **49.5% with 796 demos**.
- Learning curve (1k–100k steps): completely flat, no improvement. Saturated from start.
- Contact policy never beats E2E (65.5% vs 49.5%).

### Act 4 — The Diagnosis (Key Insight)
- Ran failure visualization (`viz_failures.py`) on the 20k checkpoint.
- **Result**: failures show complete covariate shift.
  - Failure episodes: peg tip ends up 54.7mm (mean) laterally off the hole center. Hole radius ≈ 15mm.
  - Failure episodes: x_final ≈ −0.11m — peg never even enters the hole.
  - Success vs failure is completely bimodal. No partial progress.
- **Root cause**: Training demos come from a scripted policy on a fixed path. Contact onset states have
  a very narrow distribution. At eval time, even small variations put the state out of distribution
  and the policy outputs garbage.
- This is NOT a hyperparameter or architecture problem. DAgger would fix it but is complex.

### Act 5 — The Fix: Data Augmentation (DONE — negative result)
- Offline augmentation: take each demo's contact onset frame, add random y/z perturbations
  (±3mm, ±7mm, ±15mm), let the scripted policy recover, keep successful trajectories.
- Generated **4539 trajectories** from 996 original demos.
- Trained Diffusion Policy on augmented data for 200k steps.
- Result: **41.0% on held-out test set** — *worse* than unaugmented (49.5%), far below E2E (65.5%).
- Why augmentation failed: the scripted policy's recovery behavior from perturbed starts is itself
  narrow and stereotyped. The "augmented" trajectories don't add real behavioral diversity —
  they add slightly-offset versions of the same correction pattern. The contact part from a scripted
  demo is only ~29 steps long and follows the same approach every time.
- **Conclusion**: The decomposition approach as implemented here does not work for this task.
  The contact segment from scripted demos is too short and too stereotyped to train a robust policy,
  and offline augmentation can't fix a data quality problem.

### Act 6 — Planned (pending Act 5 outcome)
- Data efficiency sweep: E2E vs Contact Policy at 50/100/200/500/796 demos.
- Cross-embodiment: train on Panda, zero-shot transfer to xArm6.

---

## Materials Index

### context/
| File | What it is |
|------|------------|
| `plan_01_current_project.docx` | Full project plan (Chinese), written mid-project after negative result. Has 3-phase roadmap. |
| `PROJECT.md` | Project overview: core idea, task, method, experiments. Good for blog intro. |
| `AGENTS.md` | Research practices, environment setup, code conventions. |
| `conversation_logs/session_1.txt` | Claude Code session: LR schedule diagnosis, action variance diagnostic, train/test split fix. |
| `conversation_logs/session_2.txt` | Claude Code session: failure visualization results, covariate shift diagnosis. |

### results/e2e_baseline/
| File | What it is |
|------|------------|
| `eval_200k_testset.json` | **Main result**: 65.5% on 200 held-out test episodes. 800-demo model, 200k steps. |
| `eval_100k_trainset.json` | 16% at 100k steps — the training dip (before proper test split was enforced). |
| `eval_50k_smoke.json` | 50% smoke test at 50k (only 2 episodes, not reliable). |

### results/contact_policy_v1/
| File | What it is |
|------|------------|
| `sweep_results.txt` | Success rates at 50/100/200/500/796 demos (all evaluated on 200 test episodes). |
| `learning_curve_796demos.txt` | Per-checkpoint success rate from 1k–100k steps. Completely flat. |

**Key numbers**:
```
E2E baseline (800 demos, 200k steps):    65.5%  ← the target to beat

Contact policy sweep (200 test episodes each):
   50 demos → 36.0%
  100 demos → 42.5%
  200 demos → 40.0%
  500 demos → 37.0%
  796 demos → 49.5%  ← best, still below E2E

Learning curve (796 demos): flat 39–56% from 1k to 100k steps. No trend.

Augmented contact policy (4539 trajectories, 200k steps):  41.0%  ← worse than unaugmented
```

### figures/failure_analysis/
Three diagnostic plots from `viz_failures.py` run on the contact policy 20k checkpoint
(50 test episodes, episodes 796–845):

| File | What it shows |
|------|--------------|
| `insertion_depth.png` | x(t) over time for successes vs failures. Failures never penetrate the hole. |
| `lateral_error.png` | y/z lateral offset from hole center over time. Failures scattered 3–4× hole radius. |
| `final_lateral.png` | Scatter of final peg position (y-z plane). Success cluster near origin, failures everywhere. |

### figures/training_loss/
| File | What it is |
|------|------------|
| `e2e_lerobot_996_loss.png` | Training loss curve for the early 996-demo E2E run (not the final 800-demo run). |

### figures/videos/
Success and failure rollouts from the early E2E baseline (before proper test split).
4 successes, 4 failures. Good for illustrating the task and failure mode visually.

### code_snapshots/
Frozen copies of key scripts at the time of writing:

| File | What it does |
|------|-------------|
| `contact_policy_train.py` | Trains Diffusion Policy on contact-only segments. LeRobot wrapper. |
| `contact_policy_eval.py` | Evaluates contact policy: restores env from demo state at contact onset, runs policy. |
| `viz_failures.py` | Generates the failure diagnosis plots (insertion depth, lateral error, scatter). |
| `augment_contact.py` | Offline data augmentation: perturbation + scripted recovery at contact onset. |
| `e2e_eval.py` | Evaluates the E2E baseline with proper test-set seed loading. |

---

## Status (as of 2026-05-10)

### Completed
- [x] E2E baseline: 65.5% (800 demos, 200k steps, held-out test set)
- [x] Contact policy v1 sweep: 49.5% best (796 demos)
- [x] Covariate shift diagnosis (failure visualization)
- [x] Data augmentation: 4539 trajectories generated
- [x] Augmented contact policy: 41.0% — augmentation made it worse

### The story is now complete (negative result)
The experiments tell a clear closed arc. The planned phases 2 and 3 are only meaningful
if phase 1 (augmentation) showed improvement. They can be noted as "future work" in the blog.

### Optional additions for the blog
- [ ] Failure videos specifically from the contact policy (current videos are E2E)
- [ ] Training loss curve for the 800-demo E2E run
- [ ] A plot comparing all methods: E2E vs contact policy sweep vs augmented

---

## One-liner for each plot (ready to use as captions)

- `insertion_depth.png`: "Successes insert the peg steadily; failures never reach the hole entrance."
- `lateral_error.png`: "Failed episodes show the peg tip drifting 3–4× the hole radius laterally — the policy lost orientation entirely."
- `final_lateral.png`: "Success and failure are bimodal. There are no near-misses — the policy either nails it or fails completely."
