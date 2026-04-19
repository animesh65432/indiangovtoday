import { Brief_Announcement } from "@/types";
import { TranslateText } from "./translatetext";

export function CheckIfUserStateInBriefing(
    States: string[],
    lan: string
): string {

    const INDIA_CODE =
        TranslateText[lan].MULTISELECT_OPTIONS[
            TranslateText[lan].MULTISELECT_OPTIONS.length - 1
        ].value;

    for (const state of States) {

        if (state === INDIA_CODE) continue;

        return state;
    }

    return INDIA_CODE;
}