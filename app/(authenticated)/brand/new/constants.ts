import {
  Utensils,
  Heart,
  ShoppingBag,
  Store,
  Home,
  GraduationCap,
  Laptop,
  Plane,
  Coffee,
  Dumbbell,
  Scissors,
  type LucideIcon,
} from "lucide-react";

// Re-export InspirationTemplate type for convenience
export type { InspirationTemplate } from "./templates";

export interface Industry {
  id: string;
  label: string;
  icon: LucideIcon;
  desc: string;
  color: string;
}

export const INDUSTRIES: Industry[] = [
  {
    id: "restaurant",
    label: "Restaurant & Food",
    icon: Utensils,
    desc: "အစားသောက်ဆိုင်",
    color: "orange",
  },
  {
    id: "cafe",
    label: "Cafe & Bakery",
    icon: Coffee,
    desc: "ကော်ဖီဆိုင်",
    color: "amber",
  },
  {
    id: "beauty",
    label: "Beauty & Health",
    icon: Heart,
    desc: "အလှကုန်",
    color: "pink",
  },
  {
    id: "fashion",
    label: "Fashion & Apparel",
    icon: Scissors,
    desc: "ဖက်ရှင်",
    color: "rose",
  },
  {
    id: "retail",
    label: "Retail Shop",
    icon: ShoppingBag,
    desc: "ဆိုင်လက်လီ",
    color: "blue",
  },
  {
    id: "real_estate",
    label: "Real Estate",
    icon: Home,
    desc: "အိမ်ခြံမြေ",
    color: "green",
  },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    desc: "ပညာရေး",
    color: "indigo",
  },
  {
    id: "tech",
    label: "Tech & IT",
    icon: Laptop,
    desc: "နည်းပညာ",
    color: "cyan",
  },
  {
    id: "travel",
    label: "Travel & Tour",
    icon: Plane,
    desc: "ခရီးသွား",
    color: "teal",
  },
  {
    id: "fitness",
    label: "Fitness & Gym",
    icon: Dumbbell,
    desc: "အားကစား",
    color: "red",
  },
  { id: "other", label: "Other", icon: Store, desc: "အခြား", color: "gray" },
];

/** Tailwind class pairs for each color token — selected vs idle */
export const INDUSTRY_COLOR_CLASSES: Record<
  string,
  { selected: string; idle: string; ring?: string }
> = {
  orange: {
    selected: "bg-primary text-primary-foreground ring-2 ring-white/15 border-primary shadow-md",
    idle: "bg-secondary/80 text-muted-foreground border-border hover:border-white/25 hover:text-foreground hover:bg-accent",
    ring: "ring-white/15",
  },
  amber: {
    selected: "bg-primary text-primary-foreground ring-2 ring-white/15 border-primary shadow-md",
    idle: "bg-secondary/80 text-muted-foreground border-border hover:border-white/25 hover:text-foreground hover:bg-accent",
    ring: "ring-white/15",
  },
  pink: {
    selected: "bg-primary text-primary-foreground ring-2 ring-white/15 border-primary shadow-md",
    idle: "bg-secondary/80 text-muted-foreground border-border hover:border-white/25 hover:text-foreground hover:bg-accent",
    ring: "ring-white/15",
  },
  rose: {
    selected: "bg-primary text-primary-foreground ring-2 ring-white/15 border-primary shadow-md",
    idle: "bg-secondary/80 text-muted-foreground border-border hover:border-white/25 hover:text-foreground hover:bg-accent",
    ring: "ring-white/15",
  },
  blue: {
    selected: "bg-primary text-primary-foreground ring-2 ring-white/15 border-primary shadow-md",
    idle: "bg-secondary/80 text-muted-foreground border-border hover:border-white/25 hover:text-foreground hover:bg-accent",
    ring: "ring-white/15",
  },
  green: {
    selected: "bg-primary text-primary-foreground ring-2 ring-white/15 border-primary shadow-md",
    idle: "bg-secondary/80 text-muted-foreground border-border hover:border-white/25 hover:text-foreground hover:bg-accent",
    ring: "ring-white/15",
  },
  indigo: {
    selected: "bg-primary text-primary-foreground ring-2 ring-white/15 border-primary shadow-md",
    idle: "bg-secondary/80 text-muted-foreground border-border hover:border-white/25 hover:text-foreground hover:bg-accent",
    ring: "ring-white/15",
  },
  cyan: {
    selected: "bg-primary text-primary-foreground ring-2 ring-white/15 border-primary shadow-md",
    idle: "bg-secondary/80 text-muted-foreground border-border hover:border-white/25 hover:text-foreground hover:bg-accent",
    ring: "ring-white/15",
  },
  teal: {
    selected: "bg-primary text-primary-foreground ring-2 ring-white/15 border-primary shadow-md",
    idle: "bg-secondary/80 text-muted-foreground border-border hover:border-white/25 hover:text-foreground hover:bg-accent",
    ring: "ring-white/15",
  },
  red: {
    selected: "bg-primary text-primary-foreground ring-2 ring-white/15 border-primary shadow-md",
    idle: "bg-secondary/80 text-muted-foreground border-border hover:border-white/25 hover:text-foreground hover:bg-accent",
    ring: "ring-white/15",
  },
  gray: {
    selected: "bg-primary text-primary-foreground ring-2 ring-white/15 border-primary shadow-md",
    idle: "bg-secondary/80 text-muted-foreground border-border hover:border-white/25 hover:text-foreground hover:bg-accent",
    ring: "ring-white/15",
  },
};
