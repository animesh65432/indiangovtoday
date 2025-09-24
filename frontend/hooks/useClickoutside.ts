import { useEffect } from "react";
import type { RefObject } from "react";

export function useClickOutside<T extends HTMLElement>(
    ref: RefObject<T | null>,
    handler: (event: MouseEvent) => void
) {
    useEffect(() => {
        const listener = (event: MouseEvent) => {
            const target = event.target as Node;


            if (!ref.current || ref.current.contains(target)) return;

            const isInDropdown = (target as HTMLElement).closest("[data-ignore-outside-click]");
            if (isInDropdown) return;

            handler(event);
        };

        document.addEventListener("mousedown", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
        };
    }, [ref, handler]);
}