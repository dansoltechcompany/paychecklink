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
        width={38}
        height={38}
        draggable={false}
        decoding="async"
      />
    </span>
  );
}
