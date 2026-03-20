import React from "react";
import { getCat } from "@/lib/categoryStyles";

export default function Badge({ category }: { category: string }) {
    const cat = getCat(category);
    return (
        <span className={`
      inline-flex items-center gap-1.5 self-start w-fit flex-shrink-0
      text-[9px] font-semibold uppercase font-satoshi tracking-wider
      px-2 py-0.5 rounded-full ${cat.badge}
    `}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.dot }} />
            {category}
        </span>
    );
}