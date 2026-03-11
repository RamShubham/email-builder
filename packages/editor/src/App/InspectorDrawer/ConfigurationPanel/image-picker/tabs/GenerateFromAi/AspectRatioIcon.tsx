function AspectRatioIcon({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <rect
        x="0.5"
        y="0.5"
        width={w - 1}
        height={h - 1}
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
export default AspectRatioIcon;