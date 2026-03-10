import {
  LayoutDashboard,
  CalendarCheck,
  FileStack,
  CreditCard,
  Settings,
  Code2Icon,
  User2Icon,
  BriefcaseBusinessIcon,
  Puzzle,
  Crown,
} from "lucide-react";

export const SideBarOption = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Scheduled Interview",
    icon: CalendarCheck,
    path: "/scheduled-interview",
  },
  {
    name: "All Interview",
    icon: FileStack,
    path: "/all-interview",
  },
  {
    name: "Billing",
    icon: CreditCard,
    path: "/billing",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export const InterviewType = [
  {
    title: "Technical",
    icon: Code2Icon,
  },

  {
    title: "Behavioral",
    icon: User2Icon,
  },
  {
    title: "Experience",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Problem Solving",
    icon: Puzzle,
  },
  {
    title: "Leadership",
    icon: Crown,
  },
];

export const QUESTIONS_PROMPT = `
You are an expert AI interview generator.

Based on the input below, generate a refined list of questions:

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}

🧠 Rules:
- Generate only relevant interview questions based on role and type.
- Increase question depth depending on experience level.
- Keep language clear and professional.

📌 Output Format — RETURN ONLY VALID JSON (No extra text, no markdown):

{
  "questions": [
    {
      "question": "string",
      "type": "Technical | Behavioral | Experience | Problem Solving | Leadership"
    }
  ]
}

⚠️ DO NOT add extra explanation — just return the JSON.
`;

