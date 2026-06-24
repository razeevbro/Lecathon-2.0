export const ORGANIZER_NAME =
  "Robotics Club of Lumbini Engineering Management & Science College";

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Open Theme", href: "#themes" },
  { label: "Schedule", href: "#schedule" },
  { label: "Prizes", href: "#prizes" },
  { label: "FAQs", href: "#faqs" },
];

export const OPEN_THEME_TITLE = "Open Theme";

export const problemThemes = [
  {
    id: 1,
    title: OPEN_THEME_TITLE,
    description:
      "Build anything you're passionate about. No sector limits — bring your best ideas and create solutions across any domain.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
  },
];

export const partners = [
  { name: "Brave", logo: " Partner" },
  { name: "Circle", logo: "Partner" },
  { name: "Discord", logo: "Partner" },
  { name: "Google", logo: "Partner" },
  { name: "Jump_", logo: "Partner" },
  { name: "Lollapalooza", logo: "Partner" },
  { name: "Magic Eden", logo: "Partner" },
  { name: "Phantom", logo: "Partner" },
];

export const registrationThemes = [OPEN_THEME_TITLE];

export const lecaWeekSchedule = [
  {
    time: "10:00 - 11:00",
    phase: "Opening Ceremony",
    description:
      "Welcome address & event kickoff by Robotics Club of Lumbini Engineering Management & Science College team",
  },
  {
    time: "11:00 - 13:00",
    phase: "Workshop Session 1",
    description: "Hands-on workshop on modern web technologies & AI tools",
  },
  {
    time: "13:00 - 14:00",
    phase: "Lunch Break",
    description: "Networking lunch with mentors and participants",
  },
  {
    time: "14:00 - 16:00",
    phase: "Workshop Session 2",
    description: "Open ideation workshop and brainstorming exercises",
  },
  {
    time: "16:00 - 17:00",
    phase: "Panel Discussion",
    description: "Industry experts share insights on innovation and startups",
  },
  {
    time: "17:00 - 18:00",
    phase: "Team Formation",
    description: "Form teams, register problems, and get mentor allocation",
  },
];

export const hackathonSchedule = [
  {
    time: "09:00 - 10:00",
    phase: "Registration & Setup",
    description: "Check-in, team setup, and environment configuration",
  },
  {
    time: "10:00 - 10:30",
    phase: "Problem Statement Release",
    description: "Hackathon kickoff and open theme briefing",
  },
  {
    time: "10:30 - 22:00",
    phase: "Hacking Phase 1",
    description: "Primary development period — build, iterate, and innovate",
  },
  {
    time: "22:00 - 23:00",
    phase: "Mentor Check-ins",
    description: "Progress review sessions with assigned mentors",
  },
  {
    time: "23:00 - 06:00",
    phase: "Hacking Phase 2",
    description: "Overnight sprint — push your project to the next level",
  },
  {
    time: "06:00 - 08:00",
    phase: "Final Submissions",
    description: "Submit your project, prepare demo, and finalize presentation",
  },
  {
    time: "08:00 - 10:00",
    phase: "Project Demos",
    description: "Present to judges — 5 minutes pitch + 5 minutes Q&A",
  },
  {
    time: "10:00 - 11:00",
    phase: "Awards Ceremony",
    description: "Announce winners and close with prizes distribution",
  },
];

export const faqs = [
  {
    question: "Who can participate in Lecathon 2.0?",
    answer:
      "Lecathon 2.0 is open to all college students, recent graduates, and young professionals passionate about technology and innovation. Teams of 2-4 members are encouraged.",
  },
  {
    question: "Is there a registration fee?",
    answer:
      "yes! Lecathon 2.0's  final participants need to pay NPR 2500 as  registration fees.",
  },
  {
    question: "What should I bring to the hackathon?",
    answer:
      "Bring your laptop, charger, any hardware components you might need, and most importantly — your creativity! We'll provide food, beverages, Wi-Fi, and a collaborative workspace for all participants.",
  },
  {
    question: "Can I start working on my project before the hackathon?",
    answer:
      "The actual project development must begin at the hackathon. However, you're encouraged to research your idea, brainstorm solutions, and prepare your development environment in advance.",
  },
  {
    question: "How will projects be judged?",
    answer:
      "Projects will be evaluated on Innovation & Creativity, Technical Implementation, Real-world Impact, Presentation Quality, and Scalability. Each criterion carries equal weight in the final score.",
  },
  {
    question: "What are the prizes for Lecathon 2.0?",
    answer:
      "Winners receive cash prizes , exciting gadgets, internship opportunities at leading companies, and certificates of achievement recognized by industry partners.",
  },
];

// Hackathon target date - set to a future date
export const HACKATHON_DATE = new Date("2026-06-26T09:00:00");
