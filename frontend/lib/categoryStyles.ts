export const categoryStyles: Record<string, { badge: string; tile: string; dot: string }> = {
  Scheme: { badge: "bg-[#B8F1D1] text-[#065F46]", tile: "#F0FDF8", dot: "#10B981" },
  Award: { badge: "bg-[#FCE7F3] text-[#9D174D]", tile: "#FFF0F8", dot: "#EC4899" },
  Policy: { badge: "bg-[#EDE9FE] text-[#5B21B6]", tile: "#F5F3FF", dot: "#8B5CF6" },
  Infrastructure: { badge: "bg-[#FDE68A] text-[#78350F]", tile: "#FFFBEB", dot: "#D97706" },
  Health: { badge: "bg-[#DCFCE7] text-[#166534]", tile: "#F0FDF4", dot: "#22C55E" },
  Employment: { badge: "bg-[#FFE4E6] text-[#9F1239]", tile: "#FFF1F2", dot: "#F43F5E" },
  Agriculture: { badge: "bg-[#D9F99D] text-[#3F6212]", tile: "#F7FEE7", dot: "#84CC16" },
  Welfare: { badge: "bg-[#FEF3C7] text-[#92400E]", tile: "#FFFBEB", dot: "#F59E0B" },
  Election: { badge: "bg-[#CCFBF1] text-[#0F766E]", tile: "#F0FDFA", dot: "#14B8A6" },
  Education: { badge: "bg-[#FFEDD5] text-[#9A3412]", tile: "#FFF7ED", dot: "#F97316" },
  Finance: { badge: "bg-[#FFE4E6] text-[#881337]", tile: "#FFF1F2", dot: "#E11D48" },
  Event: { badge: "bg-[#FEF08A] text-[#713F12]", tile: "#FEFCE8", dot: "#CA8A04" },
  Notification: { badge: "bg-[#BAE6FD] text-[#075985]", tile: "#F0F9FF", dot: "#0284C7" },
  Other: { badge: "bg-[#F5F0E8] text-[#57534E]", tile: "#FAFAF9", dot: "#78716C" },
};

export type TileSize = "big" | "wide" | "small";

// No row spans ever — rows are always auto height
// big   = 2 cols, shows description
// wide  = 2 cols, no description
// small = 1 col,  no description
export const PATTERN: TileSize[] = ["big", "small", "small", "wide", "small", "small"];

export function getCat(category: string) {
  return categoryStyles[category] ?? categoryStyles["Other"];
}

// Desktop: 3-col. Mobile: 2-col.
// big/wide always span 2. small always 1.
export const GRID_CLASSES: Record<TileSize, string> = {
  big: "col-span-2",
  wide: "col-span-2",
  small: "col-span-1",
};