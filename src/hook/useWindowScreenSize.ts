import { useState, useEffect } from "react";

type TailwindBreakpoints = {
    width: number;
    height: number;
    isSm: boolean;
    isMd: boolean;
    isLg: boolean;
    isXl: boolean;
    is2xl: boolean;
    current: "base" | "sm" | "md" | "lg" | "xl" | "2xl";
};

export const useTailwindBreakpoints = (): TailwindBreakpoints => {
    const [breakpoint, setBreakpoint] = useState<TailwindBreakpoints>({
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
        isSm: false,
        isMd: false,
        isLg: false,
        isXl: false,
        is2xl: false,
        current: "base",
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            let current: TailwindBreakpoints["current"] = "base";

            if (width >= 1536) current = "2xl";
            else if (width >= 1280) current = "xl";
            else if (width >= 1024) current = "lg";
            else if (width >= 768) current = "md";
            else if (width >= 640) current = "sm";

            setBreakpoint({
                width,
                height,
                isSm: width >= 640,
                isMd: width >= 768,
                isLg: width >= 1024,
                isXl: width >= 1280,
                is2xl: width >= 1536,
                current,
            });
        };

        handleResize(); 

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return breakpoint;
};
