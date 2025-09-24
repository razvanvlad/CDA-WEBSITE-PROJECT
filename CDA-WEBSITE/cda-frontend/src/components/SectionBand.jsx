// components/SectionBand.jsx
export default function SectionBand({
  children,
  className = "",
  color = "bg-gray-100",
  height = "h-[240px] md:h-[260px]",
  position = "center", // 'center' | 'top' | 'bottom' | number (px) | string (e.g. '30%')
  maskLeft = false,
  maskLeftWidth = "w-[30vw]",
  maskRight = false,
  maskRightWidth = "w-[30vw]",
}) {
  const posClass =
    position === "center"
      ? "top-1/2 -translate-y-1/2"
      : position === "top"
      ? "top-0"
      : position === "bottom"
      ? "bottom-0"
      : ""; // if you pass a custom style below

  return (
    <section className={`relative overflow-hidden py-20 ${className}`}>
      {/* band */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 ${posClass} ${height} ${color} z-0`}
        style={
          typeof position === "number" || /%|px|rem/.test(position)
            ? { top: position, transform: "translateY(0)" }
            : undefined
        }
      />
      {/* optional white masks to keep art on white edges */}
      {maskLeft && (
        <div
          aria-hidden="true"
          className={`absolute inset-y-0 left-0 ${maskLeftWidth} bg-white z-10 hidden md:block`}
        />
      )}
      {maskRight && (
        <div
          aria-hidden="true"
          className={`absolute inset-y-0 right-0 ${maskRightWidth} bg-white z-10 hidden md:block`}
        />
      )}
      {/* content above */}
      <div className="relative z-20">{children}</div>
    </section>
  );
}
