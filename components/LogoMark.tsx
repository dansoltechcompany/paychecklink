/**
 * PaycheckLink mark — exact approved artwork (clearer export, site-sized).
 */
export default function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span className={`logo-mark ${className}`.trim()} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-mark.png"
        alt=""
        width={32}
        height={32}
        draggable={false}
        decoding="async"
      />
    </span>
  );
}
