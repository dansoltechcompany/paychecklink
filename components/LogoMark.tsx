/**
 * PaycheckLink mark — paycheck stub + dollar + link.
 * Designed for the white 32×32 nav tile (brand blue #0466c8 via currentColor).
 */
export default function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span className={`logo-mark ${className}`.trim()} aria-hidden>
      <svg viewBox="0 0 32 32" width="20" height="20" fill="none">
        {/* Paystub card */}
        <rect
          x="3.5"
          y="5.5"
          width="15"
          height="21"
          rx="2.75"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Stub perforation ticks */}
        <path
          d="M7 9.25h8M7 12h5.5"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinecap="round"
        />
        {/* Bold dollar */}
        <path
          d="M11 14.2v9.2M14.35 16.15H9.85a1.95 1.95 0 1 0 0 3.9h2.55a1.95 1.95 0 1 1 0 3.9H9.2"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Interlocking link (the “Link” in PaycheckLink) */}
        <path
          d="M19.1 16.35a3.35 3.35 0 0 1 4.75 0l.85.85a3.35 3.35 0 0 1 0 4.75"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M26.35 24.1a3.35 3.35 0 0 1-4.75 0l-.85-.85a3.35 3.35 0 0 1 0-4.75"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M21.55 20.35h2.35"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
