import React from "react";
import { Announcement } from "@/types";
import { PATTERN } from "@/lib/categoryStyles";
import PlainTile from "./PlainTile";

export default function BentoTile({ ann, idx }: { ann: Announcement; idx: number }) {
    const size = PATTERN[idx % PATTERN.length];
    return <PlainTile ann={ann} size={size} />;
}