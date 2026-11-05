import { useEffect } from "react";
import { site } from "@/data/site";

export function usePageTitle(title?: string) {
  useEffect(() => {
    const base = `${site.name} portfolio`;
    document.title = title ? `${title} — ${base}` : base;
  }, [title]);
}
