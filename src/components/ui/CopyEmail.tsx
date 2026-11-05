import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

type State = "idle" | "copied" | "failed";

const labels: Record<State, string> = { idle: "Copy", copied: "Copied", failed: "Failed" };
const spoken: Record<State, string> = {
  idle: "Copy email address",
  copied: "Email address copied",
  failed: "Could not copy the email address",
};

/** Older browsers and non-https pages have no clipboard API. */
function copyWithSelection(text: string) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.append(area);
  area.select();
  const done = document.execCommand("copy");
  area.remove();
  return done;
}

export function CopyEmail() {
  const [state, setState] = useState<State>("idle");
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    let done = false;
    try {
      await navigator.clipboard.writeText(site.email);
      done = true;
    } catch {
      done = copyWithSelection(site.email);
    }
    setState(done ? "copied" : "failed");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2000);
  };

  return (
    <button type="button" className={`copy-email is-${state}`} onClick={copy} aria-label={spoken[state]}>
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {state === "copied" ? (
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        ) : (
          <>
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
          </>
        )}
      </svg>
      <span>{labels[state]}</span>
    </button>
  );
}
