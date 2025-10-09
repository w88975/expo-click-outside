import {useEffect} from "react";

export function useListenerGlobalClick(
    callback: (info: {
        x: number;
        y: number;
        targetIsTextInput: boolean;
        target: string;
    }) => void
) {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            callback({
                x: e.clientX,
                y: e.clientY,
                targetIsTextInput: target.tagName === "INPUT" || target.tagName === "TEXTAREA",
                target: target.tagName.toLowerCase(),
            });
        };

        document.addEventListener("pointerdown", handleClick);
        return () => {
            document.removeEventListener("pointerdown", handleClick);
        };
    }, [callback]);
}
