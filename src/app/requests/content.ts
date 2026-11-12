/**
 * Requests from Founders, Operators and VCs: the public problem board for
 * the Builder's Day buildathon.
 *
 * How the copy is split, so nobody is quoted saying something they didn't:
 * - `request` is the sender's ask, lightly edited. First person
 *   stays first person.
 * - `pitch` (optional) is our framing of a raw one-liner, never shown as a quote.
 * - `waysIn` are starting points written by TPF (labelled as ours on the page),
 *   where we used our judgement to make a raw one-liner buildable in 4 hours.
 */

import { PUBLIC_URLS } from "@/lib/public-urls";

export type PersonType = "Founder" | "Operator" | "VC";

export type Person = {
  id: string;
  name: string;
  /** Shown under the name. Leave empty if unknown. */
  role: string;
  company: string;
  type?: PersonType;
  /** Headshot in public/brand/rfs/. Falls back to initials. */
  photo?: string;
  /** X handle without @, only when verified. Share text on X tags them. */
  x?: string;
};

export type Track = { id: string; label: string };

export type Request = {
  id: string;
  title: string;
  by: string; // Person id
  track: string; // Track id
  request: string;
  /** Our framing for raw one-liners. Shown on the card and as the lead, not as the sender's words. */
  pitch?: string;
  /** Our one-line framing of the problem for share images, shown without quote marks (not their words). Falls back to quoting `request`. */
  shareLine?: string;
  /** A shorter excerpt of `request` for share images, still their exact words, so it keeps quote marks. */
  shareQuote?: string;
  waysIn: readonly string[];
  /** Off the public board for now. */
  hidden?: boolean;
  /** Bigger than one day's build. Shared because it's what these people want solved. */
  moonshot?: boolean;
};

export const people: readonly Person[] = [
  { id: "varun", name: "Varun Mayya", role: "Founder", company: "Aeos", type: "Founder", photo: "varun.jpg" },
  { id: "ishaan", name: "Ishaan Preet Singh", role: "Partner", company: "Lightspeed", type: "VC", photo: "ishaan.jpg" },
  { id: "kintan", name: "Kintan Brahmbhatt", role: "Co-founder & CEO", company: "Olto", type: "Founder", photo: "kintan.jpg" },
  { id: "tejeshwi", name: "Tejeshwi Sharma", role: "Co-founder", company: "Mettle Capital", type: "VC", photo: "tejeshwi.jpg" },
  { id: "misbah", name: "Misbah Ashraf", role: "Co-founder", company: "Jar", type: "Founder", photo: "misbah.jpg" },
  { id: "mona", name: "Mona Gandhi", role: "Co-founder & CEO", company: "Kello", type: "Founder", photo: "mona.jpg" },
  { id: "mani", name: "Manikantha S", role: "Head of Product", company: "Sarvam", type: "Operator", photo: "mani.jpg" },
  { id: "ajey", name: "Ajey Gore", role: "", company: "Gojek, Sequoia, PeakXV, ThoughtWorks", type: "Operator", photo: "ajey.jpg" },
  { id: "nikkitha", name: "Nikkitha Shanker", role: "Co-founder & CEO", company: "SuperBryn", type: "Founder", photo: "nikkitha.jpg" },
  { id: "deepak", name: "Deepak Abbot", role: "Co-founder", company: "indiagold", type: "Founder", photo: "deepak.jpg" },
  { id: "saurabh-plum", name: "Saurabh Arora", role: "Co-founder & CTO", company: "Plum", type: "Founder", photo: "saurabh.jpg" },
  { id: "nitin", name: "Nitin Mittal", role: "", company: "Microsoft", type: "Operator", photo: "nitin.jpg" },
  { id: "nikhil", name: "Nikhil Jois", role: "Growth", company: "Bureau", type: "Operator", photo: "nikhil.jpg" },
  { id: "yogesh", name: "Yogesh Doravari", role: "Lead Product Manager", company: "Roblox", type: "Operator", photo: "yogesh.jpg" },
  { id: "vivek", name: "Vivek Raju", role: "Investor Communications Strategist", company: "Deck Rooster", type: "Operator", photo: "vivek.jpg", x: "vivekraju93" },
  { id: "anurag", name: "Anurag Ramdasan", role: "Partner", company: "3one4 Capital", type: "VC", photo: "anurag.jpg" },
  { id: "saksham", name: "Saksham Aggarwal", role: "Co-founder & CEO", company: "Cardboard", type: "Founder", photo: "saksham.jpg" },
  { id: "siddharth", name: "Siddharth Arora", role: "Director of Product Management", company: "Coursera", type: "Operator", photo: "siddharth.jpg" },
  { id: "jani", name: "Jani Pasha", role: "Co-founder & CEO", company: "Lokal", type: "Founder", photo: "jani.jpg" },
  { id: "nishant", name: "Nishant Chandra", role: "Co-founder", company: "Newton School", type: "Founder", photo: "nishant.jpg" },
  { id: "aviral", name: "Aviral Bhatnagar", role: "Investor", company: "A Junior VC", type: "VC", photo: "aviral.jpg" },
  { id: "shankar", name: "Shankar Ganesh", role: "Head of Product", company: "Storylane", type: "Operator", photo: "shankar.jpg", x: "_shankarganesh" },
  { id: "syed", name: "Syed Adil", role: "India Growth", company: "Replit", type: "Operator", photo: "syed.jpg" },
];

export const tracks: readonly Track[] = [
  { id: "ai-tools", label: "AI & dev tools" },
  { id: "fintech", label: "Fintech" },
  { id: "health", label: "Health & sport" },
  { id: "learning", label: "Learning" },
  { id: "consumer", label: "Consumer & social" },
  { id: "ops", label: "Business ops" },
  { id: "talent", label: "Talent & creators" },
  { id: "hardware", label: "Hardware & space" },
];

export const requests: readonly Request[] = [
  {
    id: "gold-purity",
    title: "Gold Purity from a Photo",
    by: "deepak",
    track: "fintech",
    request:
      "We want a computer vision model that reads gold karatage (14k, 18k, 20k, 21k, 22k) accurately enough to deploy in the field, which means 95%+. We've spent 4 years on this, including 2 outsourced attempts, and we're stuck at 85%. Today's tools only flag fakes (below 14k), which is the easy part. Solving it unlocks the whole ₹18 lakh crore gold loan industry, not just one lender.",
    shareLine: "Read gold karatage from a photo at 95%+ accuracy, good enough for the field. The best attempts so far are stuck at 85%.",
    waysIn: [
      "Start with a narrow slice: tell 18k from 22k on one type of jewellery, under fixed lighting.",
      "Add cheap extra signals to the image, like weight or a colour reference card in the shot.",
      "Show a confidence score and when to fall back to a manual test, so it's usable before it's perfect.",
    ],
  },
  {
    id: "context-layer",
    title: "A Personal Context Layer",
    by: "tejeshwi",
    track: "ai-tools",
    request:
      "A personal context layer: one place that holds who you are, what you're working on and what you prefer, so every app and agent you use starts with that context instead of from zero.",
    waysIn: [
      "A portable profile you own, that any agent can read with your permission (an MCP server is a natural fit).",
      "Build it from what people already have, like notes, calendar and chats, and let them see and edit what it knows.",
      "Demo the same question in two AI apps, with and without your context.",
    ],
  },
  {
    id: "kids-tutor",
    title: "An AI Tutor for Every Kid",
    by: "tejeshwi",
    track: "learning",
    request: "An AI tutor built for kids.",
    pitch: "A tutor that moves at a kid's pace, teaches through hints and questions, and keeps parents in the loop.",
    waysIn: [
      "Pick an age band and one subject, say fractions for 8 to 10 year olds.",
      "Voice first, for kids who can't type fast yet, with guardrails parents can see.",
      "Lead kids to the answer with hints, and send the parent a short note after each session.",
    ],
  },
  {
    id: "money-manager",
    title: "An AI That Manages Your Money",
    by: "tejeshwi",
    track: "fintech",
    request: "An AI app that manages an individual's personal finances.",
    pitch: "An app that spots where money is leaking, plans what's next, and nudges you at the right moment.",
    waysIn: [
      "Have it act on what it finds, like flagging a forgotten subscription or moving idle cash.",
      "Start from what Indians actually have: UPI SMS alerts, bank statements, account aggregator data.",
      "A short weekly money check-in is a good first version.",
    ],
  },
  {
    id: "software-factory",
    title: "A Software Factory",
    by: "saurabh-plum",
    track: "ai-tools",
    request: "Software factory.",
    pitch: "A system of agents that takes a spec and ships working software, with planning, building, testing and review handled end to end.",
    waysIn: [
      "Pick one kind of software (internal CRUD tools, say) and take it from a one-page spec to a deployed app.",
      "Show each hand-off (spec, plan, code, tests, review) so a person can step in at any point.",
    ],
  },
  {
    id: "product-refinery",
    title: "A Product Refinery",
    by: "saurabh-plum",
    track: "ai-tools",
    request: "Product refinery.",
    pitch: "Take the raw signal a product team drowns in (support tickets, sales calls, user interviews, usage data) and refine it into clear, prioritised problems worth building.",
    waysIn: [
      "Feed it a pile of real tickets or call notes and get back a ranked list of problems, each with evidence.",
      "Turn the top problem into a one-page spec a team could start on.",
    ],
  },
  {
    id: "eval-designer",
    title: "An Eval Designer",
    by: "saurabh-plum",
    track: "ai-tools",
    request: "Eval designer.",
    pitch: "Describe what your AI feature should and shouldn't do, and get a ready-to-run evaluation suite: test cases, edge cases and graders.",
    waysIn: [
      "Input: a prompt or agent plus a plain-English description. Output: test cases, rubrics and a score.",
      "Have it suggest the edge cases and failure modes people usually miss.",
    ],
  },
  {
    id: "medical-tourism",
    title: "A Concierge for Medical Tourism",
    by: "nikhil",
    track: "health",
    request:
      "Patients already come to India for treatment, but hospitals can't manage what happens outside their walls. Build an end-to-end agentic AI plus human concierge: booking, pre-treatment, support during treatment, caretakers, post-treatment, and stay and tourism for families, from critical care to elective procedures.",
    shareLine: "An AI-plus-human concierge for patients coming to India for treatment: bookings, care, caretakers, and stays for their families.",
    waysIn: [
      "Start with one patient journey, such as a knee replacement for a patient flying in from abroad.",
      "The agent handles logistics and hands anything medical or sensitive to a person.",
    ],
  },
  {
    id: "generalist-accelerator",
    title: "An Accelerator for Generalists",
    by: "nikhil",
    track: "talent",
    request:
      "AI is making one-person companies that scale realistic. Build an individual accelerator for hyper-skilled generalists and operators who can do the work of several people. They'd make great hires and great founders.",
    shareLine: "An accelerator for hyper-skilled generalists who can do the work of several people. AI makes one-person companies that scale realistic.",
    waysIn: [
      "Start with how you'd find them, from the work they've already done.",
      "Design the programme an AI could run alongside a human mentor: projects, feedback, introductions.",
    ],
  },
  {
    id: "creator-school",
    title: "A Finishing School for Creators",
    by: "nikhil",
    track: "talent",
    request:
      "Audiences are tiring of AI-generated content and want real human video. India could produce 100 MrBeast or MKBHD-scale channels. What's missing is support for young creators: financial, technical and environmental, plus coaching on craft.",
    shareLine: "India could produce 100 MrBeast-scale channels. Young creators need money, tools and coaching on craft.",
    waysIn: [
      "An AI coach that watches a creator's last ten videos and gives specific, craft-level feedback.",
      "Or the matching side: connect promising creators with editors, gear and funding.",
    ],
  },
  {
    id: "keep-in-touch",
    title: "A Memory for Your Network",
    by: "nikkitha",
    track: "consumer",
    request:
      "I have thousands of connections across LinkedIn, WhatsApp and conferences, but I still lose touch with people I had a great conversation with three months ago. I'd pay for something that remembers where and how I met someone and what we talked about, then nudges me with a real reason to reconnect.",
    waysIn: [
      "Capture with almost no effort: a quick voice note after a conversation is enough.",
      "Make each nudge specific: what you talked about and why now is a good time to follow up.",
    ],
  },
  {
    id: "conference-matching",
    title: "The Right Five People at Every Conference",
    by: "nikkitha",
    track: "consumer",
    request:
      "At every conference the right person for me is usually in the room, and we never meet. Let every attendee drop a 30-second voice note about what they're building and what they need. The tool gives each person 5 people to find, with one line on why. You could demo it at the (Un)Conference itself!",
    waysIn: [
      "Voice note in, five matches out, each with a one-line reason.",
      "Test it on the day with the people around you.",
    ],
  },
  {
    id: "festival-voice",
    title: "Voice Agents for Festival Season",
    by: "nikkitha",
    track: "ops",
    request:
      "Every D2C brand's support lines melt down from Diwali through the wedding season, and hiring and training temp callers takes weeks the brand doesn't have. I want a voice agent a brand can spin up in a day from its FAQs and order system, run through the peak, and switch off after. Think seasonal staffing, but for voice.",
    waysIn: [
      "Keep v1 narrow: \"where's my order\" calls, with a clean handoff to a human.",
      "Show a brand going from an FAQ document to a live phone line in minutes.",
    ],
  },
  {
    id: "shut-down",
    title: "Shut Down a Company, Fast",
    by: "misbah",
    track: "ops",
    request:
      "Closing a company in India is slow and painful. Build a service that winds a company down quickly, the way SimpleClosure does in the US.",
    waysIn: [
      "Map the wind-down for a small private limited company, then automate the paperwork and the checklist.",
      "Start with the basics: what's left to do, who to notify, and what it will cost.",
    ],
  },
  {
    id: "retail-quant",
    title: "Jane Street for Retail Investors",
    by: "misbah",
    track: "fintech",
    request: "Bring institutional-grade quant trading to retail investors at the click of a button. Think Jane Street, on mobile, for retail.",
    waysIn: [
      "Paper trading only for the buildathon: strategies, backtests and plain-language explanations.",
      "Explain each strategy and its risk in plain language before anyone turns it on.",
    ],
  },
  {
    id: "cold-covid",
    moonshot: true,
    title: "Better Medicines for Everyday Viruses",
    by: "misbah",
    track: "health",
    request: "Better medicines to treat the common cold and Covid.",
    pitch:
      "Almost everyone catches a cold, flu or Covid every year, and there's still little to take beyond rest and something for the symptoms. AI is speeding up how drugs are found and tested, and common viruses are where that could help the most people.",
    waysIn: [
      "An agent that tracks new research on treatments for common viruses and explains it in plain language.",
      "A symptom diary that shows what actually helped across many people's recoveries.",
    ],
  },
  {
    id: "autoimmune",
    moonshot: true,
    title: "Better Medicines for Autoimmune Disorders",
    by: "misbah",
    track: "health",
    request: "Better medicines for autoimmune disorders.",
    pitch:
      "Autoimmune conditions affect millions of people, take years to diagnose, and are mostly managed rather than cured. Better medicines start with understanding each patient's disease better.",
    waysIn: [
      "A flare-up tracker for one condition, like rheumatoid arthritis, that patients can share with their doctor.",
      "An agent that keeps up with clinical trials for one condition and tells patients which ones they might qualify for.",
    ],
  },
  {
    id: "first-customer",
    title: "First Paying Customers for Medical Inventions",
    by: "nitin",
    track: "health",
    request:
      "Given a research paper or patent, identify the most viable clinical use, the hospitals with that need, the budget owner and the evidence required for a paid pilot. I'd pay through our venture studio to shorten the journey from research to first revenue.",
    waysIn: [
      "Paper in, a one-page go-to-market brief out: use case, target hospitals, buyer, evidence gap.",
      "Link every claim in the brief to its source.",
    ],
  },
  {
    id: "athlete-consistency",
    title: "Turn Training Data into Competition Results",
    by: "nitin",
    track: "health",
    request:
      "Combine shooting scores, electronic training data, coach observations and recovery logs to find recurring breakdowns and recommend coach-approved interventions. As a parent, I'd pay for measurable improvement in competition consistency.",
    waysIn: [
      "Line up training and competition sessions side by side and find where they diverge.",
      "Send suggestions to the coach for approval before they reach the athlete.",
    ],
  },
  {
    id: "vendor-overbilling",
    title: "Catch Vendor Overbilling Before You Pay",
    by: "nitin",
    track: "ops",
    request:
      "Check every invoice against contracts, agreed rates, delivery records and previous payments. Flag discrepancies with supporting evidence and route them for resolution. As a business operator, I'd pay a share of verified savings.",
    waysIn: [
      "Invoice plus contract in, a list of mismatches out, each pointing at the clause or record it breaks.",
      "Start with duplicate invoices and rate drift, which are common and easy to prove.",
    ],
  },

  {
    id: "self-improving-agents",
    title: "Agents That Improve Themselves",
    by: "mani",
    track: "ai-tools",
    request:
      "Most agents ship once and never get better. The interesting problem now isn't building an agent. It's building one that learns from its own mistakes in production. Can you make an agent that reads its own failures, fixes itself and proves it got better?",
    shareQuote: "The interesting problem now isn't building an agent. It's building one that learns from its own mistakes in production.",
    waysIn: [
      "An agent that rewrites its own prompt from failed runs.",
      "An eval set that builds itself from real errors.",
      "A system that tests two versions of an agent and keeps the winner.",
    ],
  },
  {
    id: "india-rl-envs",
    title: "RL Environments for India",
    by: "mani",
    track: "ai-tools",
    request:
      "Models are trained in environments, and almost none of those environments look like India. That's why models still stumble on GST filing, UPI disputes, government forms and customers who switch languages mid-sentence. Build the place where a model can practise an everyday Indian task and get scored on it.",
    shareQuote: "Models are trained in environments, and almost none of those environments look like India. Build the place where a model can practise an everyday Indian task and get scored on it.",
    waysIn: [
      "A mock GST portal with a grader.",
      "A UPI dispute resolution simulator.",
      "A kirana billing task with mixed-language orders.",
      "A form-filling task from messy scanned documents.",
    ],
  },
  {
    id: "hardware-ai",
    title: "AI That Leaves the Screen",
    by: "mani",
    track: "hardware",
    request:
      "AI is leaving the screen. The next wave of products will see, hear and move in the physical world, and most of that territory is still open. Build something where a model senses or acts on something real.",
    shareQuote: "AI is leaving the screen. Build something where a model senses or acts on something real.",
    waysIn: [
      "A robot task in simulation.",
      "A small model on a Raspberry Pi doing something useful offline.",
      "A wearable that understands what you're doing.",
      "A phone turned into a smart sensor.",
    ],
  },
  {
    id: "home-closing",
    title: "Agents That Close Home Sales",
    by: "yogesh",
    track: "ops",
    request:
      "Closing a home is still archaic, with bottlenecks, red tape, and commissions and fees at every step: titles, escrow, running comparables. Build AI agents that take a home purchase from offer to close with less friction and fewer middlemen.",
    waysIn: [
      "Pick one step, like pulling comparables or chasing title documents, and automate it end to end.",
      "A buyer-side agent that keeps a checklist of every document, deadline and fee, and flags what's late.",
    ],
  },
  {
    id: "trade-school",
    title: "AI for Trade Schools",
    by: "yogesh",
    track: "learning",
    request:
      "The trades are among the jobs least likely to be replaced by AI, and there's a real shortage of people trained in them. By 2030 many boomers will retire and take those skills with them. Use AI to speed up how people learn a trade.",
    waysIn: [
      "Pick one trade, like electrical wiring, and build a tutor that checks a learner's work from a photo.",
      "Record an experienced tradesperson talking through a job and turn it into a step-by-step lesson.",
    ],
  },
  {
    id: "more-games",
    title: "More Games, Made in India",
    by: "varun",
    track: "consumer",
    request: "Just more games bro!",
    pitch:
      "India has hundreds of millions of people gaming on phones, and very few of the games they play are built here. One person can now ship a playable game in a weekend with AI doing the art, levels, characters and voice.",
    waysIn: [
      "A game built on Indian stories or settings.",
      "Characters you can talk to in Hindi or Tamil.",
      "A game generated from a single prompt.",
      "A multiplayer game for a WhatsApp group.",
    ],
  },
  {
    id: "mass-healthcare",
    title: "AI Doctor Consultations for Mass India",
    by: "ishaan",
    track: "health",
    request:
      "Education and healthcare can, and will, be served to India's population more cheaply and broadly with AI. On healthcare: AI-assisted doctor consultations and advice for mass India.",
    shareQuote: "AI-assisted doctor consultations and advice for mass India.",
    waysIn: [
      "A first-consult assistant in a regional language that takes symptoms and history, then hands a clean summary to a doctor.",
      "Pick one common condition and design the flow for a village clinic with one doctor and a nurse.",
    ],
  },
  {
    id: "alpha-school-india",
    title: "Alpha School for India",
    by: "ishaan",
    track: "learning",
    request: "An AI tutor, or an Alpha School for India: mastery-based education for K-8, at Indian prices.",
    waysIn: [
      "Pick one subject and grade, and build the loop: a short lesson, a check, and no moving on until it's mastered.",
      "Give the teacher a daily view of where each child is stuck.",
    ],
  },
  {
    id: "shopping-beyond-chat",
    title: "New Ways to Shop, Beyond Chat",
    by: "ishaan",
    track: "consumer",
    request: "Shopping has got worse as it went digital. What new interfaces, beyond chat, would make it better?",
    waysIn: [
      "Start with one category, like furniture or sarees, and design how you'd want to browse it.",
      "Try showing options side by side, or letting people shop from a photo of their room.",
    ],
  },
  {
    id: "ai-first-services",
    title: "Services Companies, Rebuilt AI-First",
    by: "ishaan",
    track: "ops",
    request:
      "India has multiple billion-dollar-plus services verticals, serving local and global demand. Can you rebuild one AI-first, while building a services company? For example legal, accounting or engineering services.",
    waysIn: [
      "Pick one service, like company incorporation or bookkeeping, and run the whole job with AI plus one human reviewer.",
      "Show the time and cost per job, before and after.",
    ],
  },
  {
    id: "verification-loops",
    title: "Validation and Verification Loops",
    by: "ajey",
    track: "ai-tools",
    request: "Product folks should think about how you solve validation and verification loops.",
    pitch:
      "AI made building cheap. Knowing whether what you built is right is now the slow part: did the feature work, did the agent do the correct thing, did users get value? Build the loop that checks AI-made work as fast as it's made.",
    waysIn: [
      "A tool that writes test cases from a PRD.",
      "An agent that checks another agent's output before it ships.",
      "A fast loop from prototype to feedback from real users.",
    ],
  },
  {
    id: "agentic-cvent",
    title: "An Agentic Cvent",
    by: "kintan",
    track: "ops",
    request:
      "Go after Cvent in an agentic way. There are some attempts, like Naboo and Ande, but the space is still open and large.",
    pitch:
      "Cvent runs events for most large companies and still works like software from another era. Agents could plan, register, manage and follow up on events, with far fewer forms and dashboards.",
    waysIn: [
      "Give an agent an event brief and have it draft the agenda, venue shortlist and invite list.",
      "Or take the follow-up: after an event, send every attendee something specific to them.",
    ],
  },
  {
    id: "ai-underwriting",
    title: "AI-First Insurance Underwriting",
    by: "vivek",
    track: "fintech",
    request:
      "Insurance underwriting for term and health is form-based today, with manual workflows behind the scenes at the insurer. The entire workflow and the underwriting decision can be AI-first, with a human in the loop for special circumstances or troubleshooting.",
    waysIn: [
      "Take a filled proposal form and medical reports, and output a decision with reasons.",
      "Show exactly which cases go to a human, and why.",
    ],
  },
  {
    id: "advisor-back-office",
    title: "An AI Back Office for Wealth Advisors",
    by: "vivek",
    track: "fintech",
    request:
      "An AI portfolio manager, not for consumers but for wealth advisors. People will keep trusting a human with their life savings, so financial advice stays human first. But the advisor's entire operation can run on AI, managing portfolios, CRM and the rest, so one advisor can serve many more clients.",
    waysIn: [
      "A morning brief for an advisor: which clients need a call today, and why.",
      "Draft a rebalancing proposal for one client that the advisor reviews and sends.",
    ],
  },
  {
    id: "space-datacentres",
    moonshot: true,
    title: "The Ecosystem for Data Centres in Space",
    by: "vivek",
    track: "hardware",
    request:
      "In the next decade, a lot of AI compute could move to space. That will need an entire ecosystem around it: solar energy modules for space data centres, maintenance rovers and more.",
    waysIn: [
      "Stick to simulation: model power, heat and orbit for a small space data centre.",
      "Or plan a maintenance rover's day, from fault detection to repair.",
    ],
  },
  {
    id: "beyond-chat",
    title: "AI-Native Interfaces Beyond Chat",
    by: "anurag",
    track: "ai-tools",
    request:
      "AI-native interfaces are still unsolved. Everything is chat-dominant. Whoever cracks other AI-native interfaces will win the market.",
    waysIn: [
      "Take a task people do in a chat box today, like planning a trip, and design the interface it should have.",
      "Try interfaces that change shape for the task: a canvas, a timeline, a table you can edit.",
    ],
  },
  {
    id: "eldercare-agents",
    title: "AI Agents for Elder Care",
    by: "saksham",
    track: "health",
    request:
      "Geriatric care AI agents that take care of parents' meds, exercise and diet when their kids are away from home.",
    waysIn: [
      "Start with medicines: reminders over WhatsApp or a voice call, and a note to the kids when a dose is missed.",
      "Keep it simple enough for a parent who won't install a new app.",
    ],
  },
  {
    id: "cheapest-inference",
    title: "A Router to the Cheapest Inference",
    by: "saksham",
    track: "ai-tools",
    request:
      "A router that defaults to the cheapest inference providers across modalities: LLMs, diffusion models, VLMs, TTS, STT and more.",
    waysIn: [
      "Pick two modalities, say LLM and TTS, and route each call to the cheapest provider that meets a quality bar.",
      "Show what each request cost, and what it would have cost on the default provider.",
    ],
  },
  {
    id: "agent-friendly-apps",
    title: "Make Any App Agent-Friendly in One Click",
    by: "saksham",
    track: "ai-tools",
    request:
      "One click to make your app agent-friendly. After that click, agents can discover your app, sign up, use it, and top up or pay for it.",
    waysIn: [
      "Take one small web app and generate what an agent needs to find and use it, like an MCP server or an llms.txt.",
      "Then add agent sign-up and a way for an agent to pay, even if it's a test payment.",
    ],
  },
  {
    id: "apple-deals",
    title: "Compare Apple Prices across Countries",
    by: "siddharth",
    track: "consumer",
    request:
      "Apple products are often cheaper in the US, but a good deal in Dubai or Bangkok can beat the US price and save you from waiting until your next trip. What if there were a platform that compared Apple deals across countries, showed the total cost in INR, and let you see which offers were available for international shipping or local pickup?",
    waysIn: [
      "Start with one product, like the latest iPhone, and a handful of countries.",
      "Count everything in the INR total: exchange rate, taxes, tourist refunds and customs.",
    ],
  },
  {
    id: "best-photo",
    title: "One Moment, Ten Photos",
    by: "siddharth",
    track: "consumer",
    request:
      "It's easy to take eight or ten photos of the same moment. Over time, those near-identical shots clutter your photo library and make the best ones harder to find. What if an app could group those shots, automatically keep the best one based on cues like open eyes, natural smiles, and sharp focus, and move the rest to Deleted?",
    waysIn: [
      "Group a folder of photos by moment, then score each shot for eyes, smiles and focus.",
      "Show the pick and the runners-up so a person can overrule it before anything is deleted.",
    ],
  },
  {
    id: "kids-classes",
    title: "Playo for Kids",
    by: "siddharth",
    track: "learning",
    request:
      "Finding an after-school or weekend class that fits your child's interests, age, and schedule can mean scrolling through parent WhatsApp groups and calling providers just to check timings, fees, and availability. What if there were one app where parents could discover nearby classes, compare options, and book a trial before committing?",
    waysIn: [
      "Pick one neighbourhood and one activity, say swimming, and gather the classes into one list.",
      "Let an agent call or message providers to check timings and book a trial.",
    ],
  },
  {
    id: "consumer-research",
    title: "Consumer Research, 10x Cheaper and Faster",
    by: "jani",
    track: "ops",
    request:
      "Understanding consumers in small-town India requires expensive field visits, phone interviews and surveys. Can someone build an AI-native research platform that conducts thousands of natural conversations in regional languages and generates genuinely useful consumer insights in days rather than months?",
    waysIn: [
      "A voice agent that runs a ten-minute interview in Telugu or Hindi and writes up what it heard.",
      "Run it with a handful of people on the day, then turn the transcripts into three clear insights.",
    ],
  },
  {
    id: "ai-growth-team",
    title: "An AI Growth Team for Every Startup",
    by: "jani",
    track: "ops",
    request:
      "AI has made building products easier, but acquiring customers remains hard. Can we build an AI growth team that discovers winning marketing narratives, creates localised ads, runs experiments and continuously optimises customer acquisition? A two-person startup should be able to compete with the marketing capabilities of a large company.",
    waysIn: [
      "Give it a product page and get back five positioning angles, each with an ad in two Indian languages.",
      "Set up the experiment: which ads to run, for whom, and what result would pick a winner.",
    ],
  },
  {
    id: "education-to-earning",
    title: "From Education to Earning",
    by: "jani",
    track: "talent",
    request:
      "Millions of young Indians have degrees but struggle to find meaningful employment. We have enough learning platforms and job portals, but very few products own the outcome of getting someone employed. Can AI build a personalised path from identifying an individual's capabilities to developing job-ready skills and helping them earn?",
    waysIn: [
      "Start with one role, like customer support or sales, and build the path from a short skills check to a first interview.",
      "Have the AI run a mock interview and give feedback a hiring manager would agree with.",
    ],
  },
  {
    id: "personal-supplements",
    title: "Personalised Supplements, in as Few Pills as Possible",
    by: "mona",
    track: "health",
    request:
      "Every person should have 1-2-3 supplements a day with the exact dosage they need, based on their test results. Anything that can be combined should be combined, so people take the minimum number of supplements.",
    shareQuote: "Every person should have 1-2-3 supplements a day with the exact dosage they need, based on their test results.",
    waysIn: [
      "Read a blood test report and turn it into a short list of what's low and by how much.",
      "Take that list and work out the fewest combined pills that cover it, with doses a doctor could check.",
    ],
  },
  {
    id: "career-counsellor",
    title: "An AI Career Counsellor for Every Teen",
    by: "mona",
    track: "learning",
    request:
      "Every child from age 15 should have an AI-powered career counsellor that tracks their natural interests and strengths and guides them on how to multiply those strengths. It can tell them who to talk to, which events, forums and communities to join, what college specialisation to pick, which companies to intern at, and more.",
    shareQuote: "Every child from age 15 should have an AI-powered career counsellor that tracks their natural interests and strengths.",
    waysIn: [
      "Build a chat that learns what a teen enjoys and is good at over a few conversations, then sums it up in plain words.",
      "Turn that summary into a next-step plan: two people to talk to, one community to join, one thing to try this month.",
    ],
  },
  {
    id: "job-simulator",
    title: "The Job Simulator for AI-Native Freshers",
    by: "nishant",
    track: "talent",
    request:
      "Build a job simulator. A fresher picks any role at any company, real or made up, and a desktop opens: chat with their manager, an inbox, a task board, the tools of the job and a live business dashboard. Over one compressed workday, messages arrive, priorities collide and the context they need is buried across those apps. At the end, they see what their decisions did to the business. Every decision is also a hiring signal, so companies can use it as a fun pre-interview exercise.",
    pitch:
      "AI has made freshers fast at the task itself. What still separates them from experienced hires is business context, and that usually takes months on the job to learn. Companies, meanwhile, have little evidence of how a fresher decides when the work gets messy.",
    waysIn: [
      "Turn a role and a company into a believable workday: the business, its customers, a few colleagues with their own priorities, and context hidden in old threads.",
      "Use the same apps for every job, with one workspace that changes by role, such as a code editor, a spreadsheet or a CRM. For real companies, use only public information and label it as a simulation.",
      "Log every action and end with two views: the business consequences for the fresher, and a decision timeline a recruiter can scan in a minute.",
    ],
  },
  {
    id: "vertical-ai-chips",
    moonshot: true,
    title: "Chip Design for Vertical AI",
    by: "aviral",
    track: "hardware",
    request: "Vertical AI focused chip design.",
    pitch: "General-purpose GPUs run every model the same way. Chips designed around one kind of AI workload, like speech, vision or a single industry's models, could be far cheaper and faster for it.",
    waysIn: [
      "A tool that profiles one AI workload and shows where a general-purpose chip wastes time and power on it.",
      "An agent that helps chip designers explore design options for one model type and compares them on cost, speed and power.",
    ],
  },
  {
    id: "supply-chain-visibility",
    title: "Supply Chain Visibility",
    by: "aviral",
    track: "ops",
    request: "Visibility across the supply chain.",
    pitch: "Most companies can't see past their direct suppliers. Where a part actually is, what's late and what will run short tends to live in emails, spreadsheets and phone calls.",
    waysIn: [
      "An agent that reads supplier emails and order documents and keeps one live view of every open order.",
      "Early warnings: flag the orders most likely to slip, and say why, before they do.",
    ],
  },
  {
    id: "factory-energy",
    title: "Energy Intelligence for Factories",
    by: "aviral",
    track: "ops",
    request: "Energy intelligence for factories.",
    pitch: "Energy is one of a factory's biggest costs, and most plants only see it as one monthly bill. Knowing which machine, line and shift uses what is the first step to cutting it.",
    waysIn: [
      "Turn meter readings or electricity bills into a clear breakdown by machine, line and shift.",
      "Spot waste, like machines idling between shifts, and estimate what fixing it would save.",
    ],
  },
  {
    id: "ai-yoga-tutor",
    title: "An AI Yoga Tutor That Actually Watches You",
    by: "shankar",
    track: "health",
    request:
      "Most of what a yoga tutor does in a virtual class is correct your posture and your pace, and you pay for that every session. Build a voice coach that watches you through your webcam during yoga, corrects your posture in real time, and builds the routine from a goal you state, like \"more spine flexibility\" or \"calmer mind\". Over time it should remember the mistakes you keep making.",
    waysIn: [
      "Start with a handful of poses: recognise them from a webcam and speak one correction at a time, as it happens.",
      "Turn a stated goal into a 20-minute routine, and adjust the pace to how the person is keeping up.",
      "Keep a log of the mistakes someone repeats, and open each session by working on the top one.",
    ],
  },
  {
    id: "open-ai-harness",
    title: "An Open-Source AI Harness",
    by: "syed",
    track: "ai-tools",
    request: "An open source AI harness.",
    pitch: "The harness is everything around the model: the tools it can call, the context it sees, its memory and the loop that keeps it working. The best ones are closed and tied to one product. An open one would let anyone see how it works, swap the model and build on it.",
    waysIn: [
      "A minimal open harness: a model, a few tools, a memory file and a loop, small enough to read in an afternoon.",
      "Make the model swappable, and show the same task run on two different models.",
    ],
  },
  {
    id: "ai-roi-calculator",
    title: "An AI ROI Calculator",
    by: "syed",
    track: "ops",
    request: "A calculator for the ROI of AI.",
    pitch: "Companies are paying for AI tools without a clear way to tell what they get back. A simple, honest way to measure the return would help teams decide what to keep, expand or cut.",
    waysIn: [
      "Pick one kind of tool, like coding assistants, and estimate time saved from real usage against what it costs.",
      "A one-page calculator a team lead can fill in before buying, with every assumption shown.",
    ],
  },
  {
    id: "cross-agent-collaboration",
    title: "Cross-Agent Collaboration",
    by: "syed",
    track: "ai-tools",
    request: "Agents that collaborate with each other.",
    pitch: "Most agents work alone. Real work needs several of them, built by different teams on different stacks, to hand off tasks, share context and check each other's work.",
    waysIn: [
      "Two agents from different frameworks finishing one task together, with a clear hand-off in between.",
      "A shared log both agents write to, so a person can see who did what and why.",
    ],
  },
];

export const copy = {
  meta: {
    title: "Requests for Builders · Builder's Day",
    description:
      "Problems from founders, operators and VCs, for the Builder's Day buildathon at Product (Un)Conference ’26. Pick one and build it on Sun 22 Nov in Bengaluru.",
  },
  nav: {
    menu: "Menu",
    links: [
      { label: "Behind the requests", href: "#people" },
      { label: "The requests", href: "#board" },
      { label: "Unconference", href: PUBLIC_URLS.unconference, external: true },
    ],
    cta: "Get your pass",
  },
  hero: {
    /** After YC's Requests for Startups. Second line in gold. */
    title: ["Requests", "for Builders"],
    /** What this is, in the spirit of YC's RFS intro. Kept to two sentences. */
    body: "Problems from founders, investors and operators at the frontier.",
    bg: "/brand/hero/unconf-hero-bg.avif",
    stats: { problems: "problems", people: "See who's asking", hours: "hours to build" },
    browse: "Browse the requests",
    /** The bubble after the hero faces. */
    more: "and more",
    /** Used on the board's link preview image. */
    from: "From people at Lightspeed, Sarvam, Coursera, Roblox, 3one4\u00a0Capital and more",
  },
  people: {
    title: "Behind the requests.",
    body: "Tap someone to see just their requests.",
    all: "Show everyone",
    less: "Show fewer",
  },
  board: {
    eyebrow: "The requests",
    title: "Pick one.",
    filters: { track: "Track", from: "From", all: "All", search: "Search requests or people" },
    showing: (n: number) => (n === 1 ? "1 request" : `${n} requests`),
    more: (n: number) => `Load more (${n} left)`,
    clear: "Clear filters",
    empty: "Nothing matches.",
    open: "Read the request",
    moonshotTag: "Moonshot",
  },
  detail: {
    request: "The request",
    pitch: "How we read it",
    waysIn: "Ways in",
    waysInNote: "Starting points written by the TPF team. A small slice of the problem is plenty for four hours.",
    moonshotNote: "A moonshot: bigger than four hours, and worth sharing anyway. These are slices you could start on the day.",
    close: "Close",
    cta: "Build this on 22 Nov",
  },
  share: {
    /** Public home of the board (Webflow page that embeds /requests). Share pages forward people here as #<id>. */
    publicUrl: PUBLIC_URLS.requests,
    /**
     * Share links: /requests/p/<id> serves that problem's preview card, then forwards to publicUrl.
     * Webflow can't vary its preview per problem, so links can't point at it directly.
     */
    linkBase: "https://builders-day-gamma.vercel.app/requests/p",
    /** Ends the link-preview description. */
    previewTail: "Pick it and build it at Builder’s Day, Sun 22 Nov, Bengaluru.",
    title: "Share this request",
    native: "Share",
    linkedin: "LinkedIn",
    x: "X",
    whatsapp: "WhatsApp",
    copy: "Copy link",
    copied: "Link copied",
    /** Post text. Plain and short; the image carries the rest. */
    text: (o: { title: string; name: string; who: string; link: string }) =>
      `My pick from Requests for Builders: "${o.title}", from ${o.name}${o.who ? ` (${o.who})` : ""}.\n\nPick a problem and build it at Builder’s Day, Sun 22 Nov, Bengaluru.\n${o.link}`,
  },
  /**
   * "Submit your own request" block after the board. Hidden while href is empty:
   * paste the form URL here to switch it on. Opens in a new tab.
   */
  submit: {
    eyebrow: "Your turn",
    title: "Got a problem worth building?",
    body: "Tell us the problem you want solved, in your own words. We may add it to Requests for Builders.",
    cta: "Submit a request",
    /** Public submission form. */
    href: "https://forms.fillout.com/t/q1sDTjL8LQus" as string,
  },
  pass: {
    eyebrow: "Sun 22 Nov · Bengaluru",
    title: "Come build it.",
    body: "Four hours at Builder’s Day, on your own or in a group of up to three. One Builder’s Pass gets you the talks and the buildathon, plus $500 in Claude credits and other AI credits.",
    cta: "Request Builder’s Pass",
  },
} as const;
