/**
 * PaycheckLink mark — single bold dollar.
 * Wordmark carries the brand name; the icon stays one clear shape at nav size.
 */
export default function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span className={`logo-mark ${className}`.trim()} aria-hidden>
      <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
        <path
          d="M16 4.75v22.5"
          stroke="currentColor"
          strokeWidth="2.85"
          strokeLinecap="round"
        />
        <path
          d="M22 10.75h-8.25a3.4 3.4 0 0 0 0 6.8h4.5a3.4 3.4 0 0 1 0 6.8H10"
          stroke="currentColor"
          strokeWidth="2.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
