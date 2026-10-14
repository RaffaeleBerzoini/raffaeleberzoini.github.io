# Public professional profile evidence

Research checked on 13 October 2026. The user confirmed the name Raffaele Berzoini and a biomedical engineering background at Politecnico di Milano. This document records the public evidence used for the portfolio. Copy in `src/data.ts` is an original summary of these sources, not a verbatim biography.

## Identity and professional links

- [GitHub profile](https://github.com/RaffaeleBerzoini): full name matches; profile README identifies a biomedical engineer working as a software engineer. The profile directly links the LinkedIn profile below, establishing the cross-platform match.
- [LinkedIn](https://www.linkedin.com/in/raffaele-berzoini/): public search results describe an MSc graduate in Information Bioengineering at Polimi and employment at QubicaAMF. Full page access was unavailable; do not infer hidden employment dates or qualifications.
- [Politecnico di Milano author record](https://re.public.polimi.it/cris/rp/rp119687?type=all): records three earlier publications and affiliation with the Department of Electronics, Information and Bioengineering. This research record is evidence of publication affiliation, not a claim of present employment or a faculty role.

## Roles

### MuseMind

[Official MuseMind website](https://www.musemind.it/) identifies Raffaele Berzoini as CTO. Its team biography identifies a biomedical engineering graduate from Politecnico di Milano whose focus includes software systems, cloud architectures, and secure, scalable deployments.

The product is a browser-based AI museum guide: visitors can ask questions, choose interests, and follow personalized routes. The site describes curator-approved knowledge, multilingual access, and visitor analytics. Portfolio copy describes these product capabilities without asserting a private implementation stack, commercial adoption figures, or that any security certification has been obtained.

[Raffaele’s public pilot post](https://it.linkedin.com/posts/raffaele-berzoini_vedere-i-miei-bug-in-produzione-fa-un-certo-activity-7514665794463571969-oT4-) reports a pilot at Collezione Salce in Treviso. The exact pilot start date was not established, so the site does not invent it.

### QubicaAMF and public speaking

[DevFest speaker biography](https://devfest.modena.it/en/speakers/raffaele-berzoini/) lists Edge Software Engineer at QubicaAMF and explicitly mentions C++. The biography is tied to a 2025 session even though the site's shared title/header now mentions the 2026 edition. It is used for the published role, without inventing an employment start or end date.

[Official 2025 session](https://devfest.modena.it/en/2025/sessions/comprendere-i-sistemi-distribuiti-con-il-w3c-trace-context/) verifies **Understanding Distributed Systems with W3C Trace Context**, on **4 October 2025**, with co-speaker **Federico Fustini**. Session subjects include distributed tracing, `traceparent`, `tracestate`, and OpenTelemetry.

## Education and thesis

[POLITesi thesis record](https://www.politesi.polimi.it/handle/10589/218140) verifies:

- Title: **Adding memory to medical image segmentation: a 2D U-Net-based approach**.
- Author: Raffaele Berzoini.
- Type: Laurea Magistrale thesis.
- Official date: **9 April 2024**; academic year **2022/2023**.
- Supervisor: Marco Domenico Santambrogio; co-supervisor: Eleonora D'Arnese.
- Method: 2D LSTM U-Net, combining image segmentation with sequential memory; evaluated on CT-ORG and BraTS 2020.

The portfolio's English degree wording, **MSc in Information Bioengineering**, follows the public LinkedIn description; the university thesis record independently verifies the master's qualification and 2024 date. The specific programme wording is not separately exposed in the fetched thesis metadata.

The thesis and executive-summary PDFs are listed as embargoed until **18 March 2027**. Links go to the record, not a claimed open PDF download. A visible LinkedIn education range of 2018–2021 could not be unambiguously attached to a specific degree, so no bachelor dates or title are fabricated.

## Publications

### 2025 — Memory-based medical segmentation

**Leveraging memory for improved medical image segmentation with limited parameters**. Raffaele Berzoini, Marco D. Santambrogio, Eleonora D'Arnese. IEEE EMBC 2025, pp. 1–4.

- DOI: [10.1109/EMBC58623.2025.11253352](https://doi.org/10.1109/EMBC58623.2025.11253352).
- [University of Edinburgh institutional record](https://www.research.ed.ac.uk/en/publications/leveraging-memory-for-improved-medical-image-segmentation-with-li/).
- Conference dates: 14–17 July 2025. Record publication date: 3 December 2025.
- Reported results: comparable segmentation results with 1.6× fewer parameters than the compared 2D models and 16.5× fewer than the compared 3D models. These are paper-specific comparisons, not universal model claims.

### 2024 final issue / 2023 online — NERONE

**NERONE: The Fast Way to Efficiently Execute Your Deep Learning Algorithm at the Edge**. Raffaele Berzoini, Eleonora D'Arnese, Davide Conficconi, Marco D. Santambrogio. IEEE Journal of Biomedical and Health Informatics, **28(3), 1252–1260**, March 2024.

- DOI: [10.1109/JBHI.2023.3296142](https://doi.org/10.1109/JBHI.2023.3296142).
- [PubMed record](https://pubmed.ncbi.nlm.nih.gov/37459261/).
- [Research repository](https://github.com/necst/NERONE); [Raffaele’s fork](https://github.com/RaffaeleBerzoini/NERONE).
- [Polimi author manuscript](https://re.public.polimi.it/bitstream/11311/1247777/1/Nerone_JBHI.pdf).
- PubMed records the final 2024 issue; the repository and Polimi index use online-first 2023. The paper list uses **2024**, and the project displays **2023 / 2024**.
- Four models and three FPGA boards were evaluated. The abstract reports top average energy-efficiency improvements of **3.4× versus mobile GPU** and **1.9× versus datacenter GPU**. Any displayed metrics must retain the comparison context.
- Repository verifies Python, TensorFlow, Jupyter, Vitis AI, quantization and FPGA deployment workflows.

### 2022 — SENECA

**On How to Push Efficient Medical Semantic Segmentation to the Edge: the SENECA approach**. Raffaele Berzoini, Eleonora D'Arnese, Davide Conficconi. IEEE IPDPSW 2022, pp. 104–111.

- DOI: [10.1109/IPDPSW55747.2022.00027](https://doi.org/10.1109/IPDPSW55747.2022.00027).
- [University of Edinburgh institutional record](https://www.research.ed.ac.uk/en/publications/on-how-to-push-efficient-medical-semantic-segmentation-to-the-edg/).
- [Author repository](https://github.com/RaffaeleBerzoini/SENECA).
- [Polimi manuscript](https://re.public.polimi.it/bitstream/11311/1213599/4/SENECA_Raw22.pdf).
- Reported FPGA performance: **335.4 ± 0.34 FPS**, **4.65× GPU throughput**, **12.7× GPU energy efficiency**, and **93.04% ± 0.07 global Dice**. These apply to the study's configurations and benchmark.
- Repository verifies Python, TensorFlow, Vitis AI, and an evaluated ZCU104 FPGA workflow.

### 2022 — BIONET

**An Optimized U-Net for Unbalanced Multi-Organ Segmentation**. Raffaele Berzoini, Aurora A. Colombo, Susanna Bardini, Antonello Conelli, Eleonora D'Arnese, Marco D. Santambrogio. IEEE EMBC 2022, pp. 3764–3767.

- DOI: [10.1109/EMBC48229.2022.9871288](https://doi.org/10.1109/EMBC48229.2022.9871288).
- [PubMed record](https://pubmed.ncbi.nlm.nih.gov/36085901/).
- The paper introduces BIONET for abdominal multi-organ segmentation. It reports **93.74 ± 1.1% weighted global Dice** and **138 FPS** for the tested configuration.

## Other verified projects

### Master of Renaissance

- [Raffaele’s pinned fork](https://github.com/RaffaeleBerzoini/Master-of-Renaissance-A-java-online-multiplayer-board-game).
- [Collaborative course repository](https://github.com/elisabettafedele/ing-sw-2021-Berzoini-Fantini-Fedele).
- Authors: Raffaele Berzoini, Elia Fantini, Elisabetta Fedele.
- Polimi software engineering course project, 2021.
- Verified technologies and features: Java, JavaFX, Maven, socket communication, GUI and CLI, multiple games, persistence, disconnection handling.
- Portfolio labels it collaborative; it does not claim sole authorship.

### LoRaWAN-like sensor network

[Author repository](https://github.com/RaffaeleBerzoini/LoraWAN-like_sensor-networks) describes a Polimi 2022/2023 project with Davide Console. Eight simulated nodes: five sensors, two gateways, one network server. Deduplication, acknowledgements and retries; TinyOS/nesC, Python/TOSSIM, Node-RED, MQTT, and ThingSpeak. This is additional verified material, not one of the four initial featured cards.

## Editorial boundaries

- No private contact details, home address, age, or unrelated personal history are included.
- No graduation grades, exact employment ranges, unpublished achievements, private technology choices, live revenue/adoption counts, or current availability for hiring are asserted.
- “Current” for MuseMind reflects the official public team page on the research date; it is not an inferred start date.
- “Industry” for QubicaAMF avoids constructing employment dates from a conference biography.
- The 2022–2025 research entry describes the span of verified publications, not an employment contract or formal research appointment.
- Four publications are verified across institutional and bibliographic sources; the Polimi author profile lists only the three earlier papers, so that single page is not a complete source for the total.
- Animated visuals may explain domains conceptually; they should not be labeled as live inference, real project telemetry, or operational performance measurements.
