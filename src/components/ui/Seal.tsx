import { site } from "@/data/site";

interface SealProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * A hanko (name seal): the name in katakana, two vertical columns read right to left,
 * cream on cinnabar red with an inner frame, like a hand-pressed stamp.
 */
export function Seal({ size = "md", className = "" }: SealProps) {
  return (
    <span className={`seal seal--${size} ${className}`} aria-hidden="true">
      {site.nameKana.map((col) => (
        <span key={col} className="seal__col">
          {col}
        </span>
      ))}
    </span>
  );
}
