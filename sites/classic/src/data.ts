export const links = {
  github: "https://github.com/RaffaeleBerzoini",
  linkedin: "https://www.linkedin.com/in/raffaele-berzoini/",
  musemind: "https://www.musemind.it/",
  polimi: "https://re.public.polimi.it/cris/rp/rp119687?type=all",
};

export const profile = {
  name: "Raffaele Berzoini",
  role: "Software engineer · Biomedical background",
  summary:
    "I build across the boundary between intelligent models and the systems that bring them into the world. My work connects edge software, medical imaging research, and applied AI.",
  education: "MSc in Information Bioengineering · Politecnico di Milano · 2024",
};

export type Project = {
  id: string;
  title: string;
  category: "Product" | "Research" | "Open source";
  description: string;
  tech: string[];
  url: string;
  year: string;
  visual: "musemind" | "nerone" | "lstm" | "game";
};

export const projects: Project[] = [
  {
    id: "musemind",
    title: "MuseMind",
    category: "Product",
    description:
      "A conversational AI guide for museums. As CTO, I work on software systems and cloud architecture for experiences shaped by visitors and grounded in curatorial knowledge.",
    tech: ["Applied AI", "Cloud architecture", "Conversational interfaces"],
    url: links.musemind,
    year: "Current",
    visual: "musemind",
  },
  {
    id: "nerone",
    title: "NERONE",
    category: "Research",
    description:
      "Bringing deep learning inference to embedded FPGAs. A research workflow for quantization, compilation, and energy-efficient classification and segmentation.",
    tech: ["Python", "TensorFlow", "Vitis AI", "FPGA"],
    url: "https://github.com/necst/NERONE",
    year: "2023 / 2024",
    visual: "nerone",
  },
  {
    id: "lstm",
    title: "2D LSTM U-Net",
    category: "Research",
    description:
      "Giving a compact segmentation model a sense of volume. My master’s thesis combines U-Net with recurrent memory to connect information across medical image slices.",
    tech: ["Deep learning", "Medical imaging", "U-Net", "LSTM"],
    url: "https://www.politesi.polimi.it/handle/10589/218140",
    year: "2024 / 2025",
    visual: "lstm",
  },
  {
    id: "renaissance",
    title: "Master of Renaissance",
    category: "Open source",
    description:
      "A collaborative multiplayer board game with graphical and command-line clients. Built around network communication, persistent games, and recovery from disconnections.",
    tech: ["Java", "JavaFX", "Maven", "Sockets"],
    url: "https://github.com/RaffaeleBerzoini/Master-of-Renaissance-A-java-online-multiplayer-board-game",
    year: "2021",
    visual: "game",
  },
];

export const papers = [
  {
    id: "memory",
    title:
      "Leveraging memory for improved medical image segmentation with limited parameters",
    year: "2025",
    venue: "IEEE EMBC",
    description:
      "Recurrent memory brings volumetric context to a compact 2D U-Net, evaluated on organ and brain-tumor segmentation.",
    doi: "10.1109/EMBC58623.2025.11253352",
    url: "https://doi.org/10.1109/EMBC58623.2025.11253352",
    authors: [
      "Raffaele Berzoini",
      "Marco D. Santambrogio",
      "Eleonora D’Arnese",
    ],
    tags: ["Medical imaging", "LSTM", "Segmentation"],
  },
  {
    id: "nerone",
    title:
      "NERONE: The Fast Way to Efficiently Execute Your Deep Learning Algorithm at the Edge",
    year: "2024",
    venue: "IEEE Journal of Biomedical and Health Informatics",
    description:
      "An accessible FPGA deployment workflow, evaluated across four deep learning models and three embedded boards.",
    doi: "10.1109/JBHI.2023.3296142",
    url: "https://doi.org/10.1109/JBHI.2023.3296142",
    authors: [
      "Raffaele Berzoini",
      "Eleonora D’Arnese",
      "Davide Conficconi",
      "Marco D. Santambrogio",
    ],
    tags: ["Edge AI", "FPGA", "Energy efficiency"],
  },
  {
    id: "seneca",
    title:
      "On How to Push Efficient Medical Semantic Segmentation to the Edge: the SENECA approach",
    year: "2022",
    venue: "IEEE IPDPSW",
    description:
      "Medical segmentation on an embedded FPGA, balancing throughput, energy use, and prediction quality.",
    doi: "10.1109/IPDPSW55747.2022.00027",
    url: "https://doi.org/10.1109/IPDPSW55747.2022.00027",
    authors: ["Raffaele Berzoini", "Eleonora D’Arnese", "Davide Conficconi"],
    tags: ["FPGA", "U-Net", "Segmentation"],
  },
  {
    id: "bionet",
    title: "An Optimized U-Net for Unbalanced Multi-Organ Segmentation",
    year: "2022",
    venue: "IEEE EMBC",
    description:
      "BIONET tackles the imbalance between small and large abdominal organs in automatic medical image segmentation.",
    doi: "10.1109/EMBC48229.2022.9871288",
    url: "https://doi.org/10.1109/EMBC48229.2022.9871288",
    authors: [
      "Raffaele Berzoini",
      "Aurora A. Colombo",
      "Susanna Bardini",
      "Antonello Conelli",
      "Eleonora D’Arnese",
      "Marco D. Santambrogio",
    ],
    tags: ["Medical imaging", "U-Net", "Class imbalance"],
  },
];

export const experience = [
  {
    period: "Current",
    title: "CTO",
    organization: "MuseMind",
    description:
      "Software systems and cloud architecture for a conversational museum guide, with curators in control of the knowledge behind each experience.",
    url: links.musemind,
  },
  {
    period: "Industry",
    title: "Edge Software Engineer",
    organization: "QubicaAMF",
    description:
      "C++ and edge software engineering. Speaker at DevFest Modena 2025 on distributed tracing, W3C Trace Context, and OpenTelemetry.",
    url: "https://devfest.modena.it/en/speakers/raffaele-berzoini/",
  },
  {
    period: "2024",
    title: "MSc · Information Bioengineering",
    organization: "Politecnico di Milano",
    description:
      "Master’s thesis on adding memory to medical image segmentation with a 2D LSTM U-Net, supervised by Marco D. Santambrogio and Eleonora D’Arnese.",
    url: "https://www.politesi.polimi.it/handle/10589/218140",
  },
  {
    period: "2022–2025",
    title: "Research publications",
    organization: "Medical imaging & edge AI",
    description:
      "Four co-authored publications connecting medical segmentation, efficient neural networks, and FPGA acceleration.",
    url: links.polimi,
  },
];
