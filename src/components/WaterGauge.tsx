import type { WaterStatus } from '../types';

interface Props {
  index: number | null;
  status: WaterStatus | null;
}

const STATUS_CONFIG = {
  boa: { label: 'Boa', color: '#22c55e', glow: 'rgba(34,197,94,0.3)', bg: 'rgba(34,197,94,0.1)' },
  atencao: { label: 'Atenção', color: '#eab308', glow: 'rgba(234,179,8,0.3)', bg: 'rgba(234,179,8,0.1)' },
  critica: { label: 'Crítica', color: '#ef4444', glow: 'rgba(239,68,68,0.3)', bg: 'rgba(239,68,68,0.1)' },
};

export default function WaterGauge({ index, status }: Props) {
  const cfg = status ? STATUS_CONFIG[status] : null;
  const pct = index !== null ? Math.min(index / 5, 1) : null;

  // Arc math: 220° arc centered, from -110° to +110° (measured from top)
  const R = 80;
  const cx = 110;
  const cy = 100;
  const startAngle = -220;
  const totalAngle = 220;

  function polarToXY(angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + R * Math.cos(rad), y: cy + R * Math.sin(rad) };
  }

  function describeArc(fromDeg: number, toDeg: number) {
    const s = polarToXY(fromDeg);
    const e = polarToXY(toDeg);
    const large = toDeg - fromDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const arcStart = startAngle / 2;
  const arcEnd = -startAngle / 2;
  const progressEnd = pct !== null ? arcStart + pct * totalAngle : arcStart;
  const needleAngle = pct !== null ? arcStart + pct * totalAngle : arcStart;
  const needle = polarToXY(needleAngle);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <svg viewBox="0 0 220 130" style={{ width: 260, height: 160 }}>
        {/* Track */}
        <path
          d={describeArc(arcStart, arcEnd)}
          fill="none"
          stroke="rgba(51,65,85,0.8)"
          strokeWidth={14}
          strokeLinecap="round"
        />

        {/* Progress */}
        {pct !== null && pct > 0 && (
          <path
            d={describeArc(arcStart, progressEnd)}
            fill="none"
            stroke={cfg?.color ?? '#64748b'}
            strokeWidth={14}
            strokeLinecap="round"
            style={{ filter: cfg ? `drop-shadow(0 0 8px ${cfg.color})` : undefined, transition: 'all 0.6s ease' }}
          />
        )}

        {/* Zone markers */}
        {[
          { pct: 0.5, color: '#eab308' },
          { pct: 0.8, color: '#22c55e' },
        ].map((m, i) => {
          const p = polarToXY(arcStart + m.pct * totalAngle);
          return <circle key={i} cx={p.x} cy={p.y} r={3} fill={m.color} opacity={0.5} />;
        })}

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needle.x}
          y2={needle.y}
          stroke="rgba(226,232,240,0.9)"
          strokeWidth={2}
          strokeLinecap="round"
          style={{ transition: 'all 0.6s ease' }}
        />
        <circle cx={cx} cy={cy} r={5} fill="#e2e8f0" />
        <circle cx={cx} cy={cy} r={2.5} fill="#0f172a" />

        {/* Scale labels */}
        {[0, 1, 2, 3, 4, 5].map((v) => {
          const p = polarToXY(arcStart + (v / 5) * totalAngle);
          return (
            <text key={v} x={p.x} y={p.y + 14} textAnchor="middle" fill="#475569" fontSize={8}>
              {v}
            </text>
          );
        })}
      </svg>

      {/* Value display */}
      <div style={{ textAlign: 'center' }}>
        {index !== null && cfg ? (
          <>
            <div style={{ fontSize: 52, fontWeight: 800, color: cfg.color, lineHeight: 1, letterSpacing: -2, textShadow: `0 0 30px ${cfg.color}60` }}>
              {index.toFixed(1)}
            </div>
            <div style={{ marginTop: 8 }}>
              <span style={{
                display: 'inline-block',
                padding: '4px 16px',
                borderRadius: 99,
                fontSize: 13,
                fontWeight: 600,
                color: cfg.color,
                background: cfg.bg,
                border: `1px solid ${cfg.color}40`,
                letterSpacing: 0.5,
              }}>
                {cfg.label}
              </span>
            </div>
          </>
        ) : (
          <div style={{ color: '#475569', fontSize: 14 }}>Sem avaliações ainda</div>
        )}
      </div>
    </div>
  );
}
