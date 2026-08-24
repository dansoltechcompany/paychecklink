/** PaycheckLink mark: paycheck $ + link */
export default function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span className={`logo-mark ${className}`.trim()} aria-hidden>
      <svg viewBox="0 0 32 32" width="18" height="18" fill="none">
        <path
          d="M14.2 6.2v19.6M18.9 10.6H12.7a2.55 2.55 0 1 0 0 5.1h3.4a2.55 2.55 0 1 1 0 5.1H10.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.4 19.2a2.55 2.55 0 1 0 0 5.1 2.55 2.55 0 0 0 1.85-.78M25.7 19.2a2.55 2.55 0 1 1 0 5.1 2.55 2.55 0 0 1-1.85-.78"
          stroke="currentColor"
          strokeWidth="1.85"
          strokeLinecap="round"
        />
        <path
          d="M22.35 21.75h1.4"
          stroke="currentColor"
          strokeWidth="1.85"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
