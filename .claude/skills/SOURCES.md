# Project skills: provenance

Third-party skills vendored into this repo. Each one was reviewed (SKILL.md, references and scripts) before installing.
Each skill folder keeps its original license file.

| Skill | Source repo | Commit | License |
|---|---|---|---|
| webapp-testing | anthropics/skills (`skills/webapp-testing`) | 2c5958e | Apache-2.0 (LICENSE.txt) |
| gsap-core | greensock/gsap-skills (`skills/gsap-core`) | aed9cfd | MIT |
| gsap-scrolltrigger | greensock/gsap-skills (`skills/gsap-scrolltrigger`) | aed9cfd | MIT |
| gsap-react | greensock/gsap-skills (`skills/gsap-react`) | aed9cfd | MIT |
| threejs-react-three-fiber | CloudAI-X/threejs-skills (`skills/threejs-react-three-fiber`) | 0e18186 | MIT |
| threejs-shaders | CloudAI-X/threejs-skills (`skills/threejs-shaders`) | 0e18186 | MIT |
| threejs-performance | CloudAI-X/threejs-skills (`skills/threejs-performance`) | 0e18186 | MIT |
| core-web-vitals | addyosmani/web-quality-skills (`skills/core-web-vitals`) | afa8da9 | MIT |
| performance | addyosmani/web-quality-skills (`skills/performance`) | afa8da9 | MIT |
| seo | addyosmani/web-quality-skills (`skills/seo`) | afa8da9 | MIT |
| fixing-motion-performance | ibelick/ui-skills (`skills/fixing-motion-performance`) | f511eae | MIT |
| web-animation-perf | swyxio/skills (`web-animation-perf`) | da1b8a0 | MIT |
| gsap-performance | greensock/gsap-skills (`skills/gsap-performance`) | aed9cfd | MIT |
| improve-threejs | millionco/react-doctor (`skills/improve-threejs`) | 94a349b | Modified MIT |
| dom-performance | thedaviddias/Front-End-Checklist (`skills/dom-performance`) | e8d14d0 | MIT |

Notes:
- Some skills mention sibling skills that were deliberately not vendored (e.g. `gsap-timeline`, `threejs-fundamentals`, `web-quality-audit`). Those cross-references are informational only.
- `improve-threejs` suggests running `npx react-doctor@latest` (a public scanner by Million); it is optional and is only run on demand.
- The only executable code is `webapp-testing/scripts/with_server.py`: it starts local dev servers, waits for their port and runs a command. No network calls, no keys.
