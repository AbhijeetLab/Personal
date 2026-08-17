"use client";

import { FinanceSnapshot } from "@/lib/types";

export default function Sparkline({ data, width = 280, height = 72 }: { data: FinanceSnapshot[]; width?: number; height?: number }) {
  if (data.length < 2) {
    return <div style={{ width, height }} className="grid place-content-center text-[11px] text-text-tertiary">Add entries to see a trend</div>;
  }

  const values = data.map((d) => d.netWorth);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padY = 8;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - padY - ((d.netWorth - min) / range) * (height - padY * 2);
    return [x, y] as const;
  });

  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;
  const last = points[points.length - 1];
  const rising = values[values.length - 1] >= values[0];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={rising ? "#C9A961" : "#F0576A"} stopOpacity="0.28" />
          <stop offset="100%" stopColor={rising ? "#C9A961" : "#F0576A"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkFill)" />
      <path d={linePath} fill="none" stroke={rising ? "#C9A961" : "#F0576A"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="3" fill={rising ? "#E4C67F" : "#F0576A"} stroke="#12161F" strokeWidth="2" />
    </svg>
  );
}
