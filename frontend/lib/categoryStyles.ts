export const categoryStyles: Record<string, { badge: string; tile: string; dot: string }> = {
  Scheme: { badge: "bg-[#EEF5FB] text-[#2A5F82]", tile: "#F4F9FD", dot: "#5B9EC9" },
  Infrastructure: { badge: "bg-[#FAF0E8] text-[#6B4020]", tile: "#FDF6F0", dot: "#C07840" },
  Health: { badge: "bg-[#EDF7EF] text-[#235C30]", tile: "#F4FAF5", dot: "#4A9E60" },
  Policy: { badge: "bg-[#F2F0FC] text-[#3E3278]", tile: "#F7F5FE", dot: "#7B6CC4" },
  Award: { badge: "bg-[#FAF6E8] text-[#5C4A18]", tile: "#FDFAF2", dot: "#B09040" },
  Employment: { badge: "bg-[#FAF0F2] text-[#6A2438]", tile: "#FDF5F7", dot: "#B85068" },
  Agriculture: { badge: "bg-[#EEF8F2] text-[#1C5234]", tile: "#F4FAF6", dot: "#3D9060" },
  Welfare: { badge: "bg-[#FAF5E8] text-[#5A4218]", tile: "#FDFAF2", dot: "#A88038" },
  Election: { badge: "bg-[#EAF4FC] text-[#1E4E72]", tile: "#F2F9FE", dot: "#4080B0" },
  Education: { badge: "bg-[#F8EEF8] text-[#4E265A]", tile: "#FCF5FC", dot: "#9060A0" },
  Finance: { badge: "bg-[#EAF6F2] text-[#144A3A]", tile: "#F2FAF7", dot: "#307E68" },
  Event: { badge: "bg-[#FAF2EA] text-[#623E18]", tile: "#FDF7F2", dot: "#B87840" },
  Notification: { badge: "bg-[#EAF2FA] text-[#1A3E62]", tile: "#F2F7FD", dot: "#3870A8" },
  Other: { badge: "bg-[#F4F3F0] text-[#444240]", tile: "#F8F7F5", dot: "#888480" },
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