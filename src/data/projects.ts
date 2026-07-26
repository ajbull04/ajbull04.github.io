import project3 from "@/assets/project-3.jpg";
import TryblImage from "@/assets/Trybl.png";
import PublisherAccountingSystemImage from "@/assets/Hypothetical.png";

export const PROJECT_CATEGORIES = ["Full Stack", "Embedded Systems", "Mobile"] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface ArchitectureTier {
  label: string;
  nodes: { name: string; detail?: string }[];
}

export interface CaseStudy {
  context: string;
  constraints: string[];
  decisions: { decision: string; why: string; tradeoff: string }[];
  results: { metric: string; value: string; note?: string }[];
  nextTime: string;
  architecture: { tiers: ArchitectureTier[]; notes?: string[] };
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  categories: ProjectCategory[];
  stack: string[];
  image: string;
  featured?: boolean;
  role: string;
  timeline: string;
  highlights: string[];
  caseStudy?: CaseStudy;
  liveUrl?: string;
  repoUrl?: string;
}

const projects: Project[] = [
  {
    slug: "trybl",
    title: "Trybl",
    description:
      "Full-stack social platform for universities with a React Native client, JWT auth, and a high-performance Go/Python API.",
    longDescription:
      "Trybl is a production-grade social networking platform built for campus communities. I architected the system end to end: a React Native and Expo mobile experience for 6,000+ users, dual-language backend services in Python and Go with 30+ REST endpoints, and PostgreSQL tuned for sub-millisecond queries. Security and integrations include JWT with refresh, plus OAuth 2.0 for Google and Apple Calendar.",
    categories: ["Full Stack", "Mobile"],
    stack: [
      "TypeScript",
      "React Native",
      "Expo",
      "Python",
      "Go",
      "PostgreSQL",
      "Docker",
      "Django",
    ],
    image: TryblImage,
    featured: true,
    role: "Founding engineer & architect",
    timeline: "2025 — Present",
    highlights: [
      "Developed a machine learning pipeline to analyze user behavior and implement the app's recommendation system",
      "Built 30+ REST API endpoints in Python and Go for auth, messaging, discovery, and calendar",
      "JWT authentication with automatic refresh; OAuth 2.0 for Google and Apple Calendar",
      "Cut backend query latency from 100ms+ to under 1ms with 20+ PostgreSQL indexes",
    ],
    caseStudy: {
      context:
        "Campus social life is scattered across group chats, flyers, and stories, so nobody has one answer to \"what is my community doing this week?\" I came on as founding engineer and owned the system end to end: the mobile client, the services behind it, the data model, and how it ships.",
      constraints: [
        "Students live in a phone app on congested campus networks, so every read path had to feel instant or feel broken.",
        "The recommendation work needed Python's ecosystem while the feed and messaging paths needed predictable tail latency.",
        "Growing past 6,000 users on a student budget ruled out throwing infrastructure at problems.",
        "Calendar and identity integrations meant holding other people's OAuth tokens responsibly.",
      ],
      decisions: [
        {
          decision: "One React Native + Expo codebase for iOS and Android",
          why: "Two platforms from one team, with over-the-air updates for fixes that can't wait on review.",
          tradeoff: "Anything needing native modules has to route through Expo's constraints instead of straight platform code.",
        },
        {
          decision: "Split the backend: Django for auth, admin, and ML; Go for feed, messaging, and discovery reads",
          why: "Python where iteration speed and libraries matter, Go where request latency matters.",
          tradeoff: "Two deploy paths and one shared contract to keep honest between them — worth it only because the read paths are genuinely hot.",
        },
        {
          decision: "Tune PostgreSQL for the read shapes instead of adding a cache layer",
          why: "Sub-millisecond reads from the source of truth beat fast reads that can be stale or wrong; no invalidation logic to get wrong.",
          tradeoff: "20+ indexes cost write throughput and disk, and the schema has to be designed around how it will be read.",
        },
        {
          decision: "JWT access tokens with refresh rotation rather than server sessions",
          why: "Both backends can verify a request without a shared session store.",
          tradeoff: "Revocation is not free — it takes short access lifetimes and rotating refresh tokens to keep logout meaningful.",
        },
        {
          decision: "Batch recommendation scoring instead of an online model",
          why: "Behavior scoring is cheap, debuggable, and reproducible when it runs as a pipeline.",
          tradeoff: "Recommendations are minutes stale rather than reacting to the tap you just made.",
        },
      ],
      results: [
        { metric: "Users served", value: "6,000+" },
        { metric: "Feed read latency", value: "100 ms+ → <1 ms", note: "20+ targeted PostgreSQL indexes" },
        { metric: "API surface", value: "30+ endpoints", note: "auth, messaging, discovery, calendar" },
        { metric: "Clients", value: "iOS + Android", note: "single React Native codebase" },
      ],
      nextTime:
        "I would design the schema around the read shapes on day one instead of retrofitting indexes once the feed got slow, and I would keep everything in one service until measurements — not instinct — justified the second language.",
      architecture: {
        tiers: [
          {
            label: "Client",
            nodes: [{ name: "React Native + Expo", detail: "iOS and Android from one codebase" }],
          },
          {
            label: "Services",
            nodes: [
              { name: "Go read API", detail: "feed · messaging · discovery" },
              { name: "Django REST API", detail: "auth · calendar · admin" },
            ],
          },
          {
            label: "Data",
            nodes: [
              { name: "PostgreSQL", detail: "20+ indexes tuned to read shapes" },
              { name: "Batch ML scoring", detail: "Python behavior pipeline" },
            ],
          },
        ],
        notes: [
          "JWT with refresh rotation is verified independently by both services.",
          "OAuth 2.0 for Google and Apple Calendar sits behind the Django service.",
        ],
      },
    },
  },
  {
    slug: "publisher-accounting-system",
    title: "Publisher Accounting System",
    description:
      "Full-stack accounting product that automates sales tracking and royalty payouts, replacing spreadsheet workflows.",
    longDescription:
      "A Next.js and TypeScript platform for publishers to model books, authors, sales, and royalties with a normalized PostgreSQL schema via Prisma. The app uses server-rendered tables with URL-driven state and server mutations for refresh-safe caching. Infrastructure includes Docker, Nginx, GitHub Actions CI/CD to QA and production, and Vitest for confidence in changes.",
    categories: ["Full Stack"],
    stack: ["TypeScript", "Next.js", "Prisma", "PostgreSQL", "Docker", "Nginx", "Vitest"],
    image: PublisherAccountingSystemImage,
    featured: true,
    role: "Full-stack developer",
    timeline: "2026 — Present",
    highlights: [
      "Replaced manual spreadsheets with automated sales and royalty tracking",
      "Deployed with Docker, Nginx, and GitHub Actions to QA and production",
      "Designed normalized PostgreSQL schema (books, authors, sales, royalties) with Prisma",
      "Server-rendered tables with URL state and server-side mutations for reliable caching",
    ],
    caseStudy: {
      context:
        "Publishers were tracking sales and author royalties in spreadsheets, where one dragged formula quietly pays someone the wrong amount. The system models books, authors, sales, and royalty terms directly so payouts are computed from the underlying rows instead of maintained by hand.",
      constraints: [
        "Money math has to be reproducible: every payout should be traceable back to the sales that produced it.",
        "The people using this live in tables — filtering, sorting, and sending someone a link to a view matters more than visual flourish.",
        "A small operations team means deploys and QA have to be automated, not ceremonial.",
      ],
      decisions: [
        {
          decision: "Normalized schema (books, authors, sales, royalties) managed with Prisma migrations",
          why: "Royalty terms are relational by nature, and normalization keeps every payout derivable rather than stored as a guess.",
          tradeoff: "More joins per view, so reporting queries need deliberate indexing instead of denormalized shortcuts.",
        },
        {
          decision: "Server-rendered tables with state in the URL instead of client-side table state",
          why: "Every view is shareable and refresh-safe, and caching behaves predictably because the URL is the query.",
          tradeoff: "Each filter is a round trip, which makes query performance the actual UX budget.",
        },
        {
          decision: "Server mutations rather than a hand-rolled client API layer",
          why: "Validation and cache revalidation live in one place, next to the data they touch.",
          tradeoff: "Optimistic and offline interactions are harder than they would be with a client-side store.",
        },
        {
          decision: "Docker and Nginx behind GitHub Actions, deploying to QA before production",
          why: "Accounting changes deserve a rehearsal environment with real-shaped data before they touch payouts.",
          tradeoff: "Real infrastructure to maintain for a product that could have shipped straight to one box.",
        },
        {
          decision: "Vitest coverage aimed at the royalty calculations",
          why: "The calculation is the product; a regression there is not a bug report, it is a wrong payment.",
          tradeoff: "Relational fixtures take real effort to set up and keep meaningful.",
        },
      ],
      results: [
        { metric: "Payout workflow", value: "Automated", note: "replaced manual spreadsheet tracking" },
        { metric: "Environments", value: "QA + production", note: "GitHub Actions pipeline" },
        { metric: "Schema", value: "Normalized + migrated", note: "books · authors · sales · royalties" },
        { metric: "Confidence", value: "Vitest on payout math" },
      ],
      nextTime:
        "I would make an audit trail a first-class table from the beginning. The numbers are right, but \"who changed which royalty rate, and when\" should be a queryable record rather than something reconstructed after the fact.",
      architecture: {
        tiers: [
          {
            label: "Interface",
            nodes: [{ name: "Next.js App Router", detail: "server-rendered tables, URL-driven state" }],
          },
          {
            label: "Application",
            nodes: [{ name: "Server mutations", detail: "validation + cache revalidation in one place" }],
          },
          {
            label: "Data",
            nodes: [{ name: "PostgreSQL via Prisma", detail: "books · authors · sales · royalties" }],
          },
          {
            label: "Delivery",
            nodes: [
              { name: "Docker + Nginx", detail: "reverse proxy, containerized app" },
              { name: "GitHub Actions", detail: "CI to QA, then production" },
              { name: "Vitest", detail: "royalty calculations under test" },
            ],
          },
        ],
      },
    },
  },
  {
    slug: "smart-basketball-game",
    title: "Smart Basketball Game",
    description:
      "FPGA arcade basketball game with custom pipelined CPU, I²C color sensing, VGA output, and MIPS assembly game logic.",
    longDescription:
      "A hardware–software capstone that combines digital design and computer architecture. The system includes a custom 16-bit, 100MHz pipelined RISC CPU with memory-mapped I/O, a Verilog FSM and I²C driver for a rim-mounted RGB sensor, VGA display timing, and game logic written in MIPS assembly running on the custom ISA.",
    categories: ["Embedded Systems"],
    stack: ["Verilog", "FPGA", "Assembly", "I²C", "VGA", "Computer architecture"],
    image: project3,
    featured: true,
    role: "Designer & implementer",
    timeline: "2025",
    highlights: [
      "Integrated sensors, buttons, and VGA for real-time arcade gameplay",
      "Custom I²C driver and FSM in Verilog for a rim-mounted RGB color sensor",
      "16-bit 100MHz pipelined CPU with custom RISC ISA and memory-mapped I/O",
      "Game logic in MIPS assembly: scoring, timing, and display control",
    ],
    caseStudy: {
      context:
        "An arcade basketball game that refused the convenient path: instead of running game logic on a soft core or a microcontroller, I designed the processor it runs on. A rim-mounted color sensor detects made shots, the custom CPU runs the game, and a VGA generator drives the display.",
      constraints: [
        "VGA timing cannot wait on the game loop, and the color sensor runs on its own I²C clock — three time domains that all have to stay honest.",
        "No operating system and no libraries: memory-mapped I/O is the only interface between hardware and game code.",
        "FPGA fabric and a 100 MHz clock set a hard ceiling, so every stage of the pipeline has to fit the timing budget.",
      ],
      decisions: [
        {
          decision: "A custom 16-bit RISC ISA and pipelined core instead of an off-the-shelf soft core",
          why: "The point was to understand the whole machine, and a narrow instruction set keeps decode and hazard logic tractable.",
          tradeoff: "No toolchain comes with it: the game is hand-written assembly, and any bug might live in the hardware rather than the code.",
        },
        {
          decision: "Memory-mapped I/O for sensor, buttons, and video",
          why: "One uniform interface for every peripheral, with no special-purpose instructions polluting the ISA.",
          tradeoff: "Address decode logic and access timing have to be right or the pipeline stalls on a peripheral read.",
        },
        {
          decision: "A dedicated Verilog FSM for the I²C driver rather than bit-banging from software",
          why: "Sensor protocol timing shouldn't depend on where the game loop happens to be.",
          tradeoff: "More hardware to verify, and debugging moves from print statements to waveforms.",
        },
        {
          decision: "A VGA timing generator independent of game state",
          why: "The display stays stable whatever the game is doing, which makes visual glitches a real signal instead of noise.",
          tradeoff: "Access to display memory has to be shared deliberately between the generator and the CPU.",
        },
      ],
      results: [
        { metric: "Processor", value: "16-bit, 100 MHz", note: "custom pipelined RISC ISA" },
        { metric: "Peripherals", value: "I²C sensor · buttons · VGA", note: "all memory-mapped" },
        { metric: "Game logic", value: "Assembly on the custom ISA" },
        { metric: "Outcome", value: "Playable end to end", note: "sensor to scoreboard" },
      ],
      nextTime:
        "I would write the assembler and a golden-model simulator before writing the game. Hand-assembling turned a seconds-long debug loop into a minutes-long one, and a simulator would have told me immediately whether a bug was in the silicon or the software.",
      architecture: {
        tiers: [
          {
            label: "Physical",
            nodes: [
              { name: "Rim RGB sensor", detail: "I²C, detects made shots" },
              { name: "Player buttons" },
              { name: "VGA display" },
            ],
          },
          {
            label: "Verilog logic",
            nodes: [
              { name: "I²C driver FSM", detail: "protocol timing in hardware" },
              { name: "VGA timing generator", detail: "independent of game state" },
              { name: "I/O address decode", detail: "memory-mapped peripherals" },
            ],
          },
          {
            label: "Core",
            nodes: [{ name: "Custom 16-bit RISC CPU", detail: "pipelined, 100 MHz, memory-mapped I/O" }],
          },
          {
            label: "Software",
            nodes: [{ name: "Game logic in assembly", detail: "scoring · timing · display control" }],
          },
        ],
      },
    },
  },
];

export const getFeaturedProjects = (): Project[] => projects.filter((p) => p.featured);

export const filterProjectsByCategories = (selected: ProjectCategory[]): Project[] => {
  if (selected.length === 0) return projects;
  return projects.filter((p) => p.categories.some((c) => selected.includes(c)));
};

export default projects;
