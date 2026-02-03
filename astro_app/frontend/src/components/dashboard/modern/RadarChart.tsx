import React from 'react';

interface RadarData {
    label: string;
    value: number;
    fullMark: number;
}

interface RadarChartProps {
    data: RadarData[];
    size?: number;
    color?: string;
}

const RadarChart: React.FC<RadarChartProps> = ({
    data,
    size = 300,
    color = "#fbbf24"
}) => {
    const center = size / 2;
    const radius = (size / 2) * 0.7;
    const angleStep = (Math.PI * 2) / data.length;

    // Generate points for the background polygons
    const levels = [0.2, 0.4, 0.6, 0.8, 1];
    const bgPolygons = levels.map((level) => {
        return data.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = center + radius * level * Math.cos(angle);
            const y = center + radius * level * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');
    });

    // Generate points for the data polygon
    const dataPoints = data.map((d, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const valueRatio = d.value / d.fullMark;
        const x = center + radius * valueRatio * Math.cos(angle);
        const y = center + radius * valueRatio * Math.sin(angle);
        return `${x},${y}`;
    }).join(' ');

    // Generate axis lines and labels
    const axisLines = data.map((d, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x2 = center + radius * Math.cos(angle);
        const y2 = center + radius * Math.sin(angle);

        // Label position (further out)
        const lx = center + (radius + 25) * Math.cos(angle);
        const ly = center + (radius + 25) * Math.sin(angle);

        return { x2, y2, lx, ly, label: d.label };
    });

    return (
        <div className="flex items-center justify-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                {/* Background Grids */}
                {bgPolygons.map((points, i) => (
                    <polygon
                        key={i}
                        points={points}
                        fill="none"
                        stroke="white"
                        strokeOpacity="0.05"
                        strokeWidth="1"
                    />
                ))}

                {/* Axis Lines */}
                {axisLines.map((line, i) => (
                    <g key={i}>
                        <line
                            x1={center}
                            y1={center}
                            x2={line.x2}
                            y2={line.y2}
                            stroke="white"
                            strokeOpacity="0.1"
                            strokeWidth="1"
                        />
                        <text
                            x={line.lx}
                            y={line.ly}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-[10px] font-black uppercase tracking-widest fill-white/60"
                        >
                            {line.label}
                        </text>
                    </g>
                ))}

                {/* Data Polygon */}
                <polygon
                    points={dataPoints}
                    fill={color}
                    fillOpacity="0.15"
                    stroke={color}
                    strokeWidth="2"
                    className="drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                />

                {/* Data Points */}
                {data.map((d, i) => {
                    const angle = i * angleStep - Math.PI / 2;
                    const valueRatio = d.value / d.fullMark;
                    const x = center + radius * valueRatio * Math.cos(angle);
                    const y = center + radius * valueRatio * Math.sin(angle);
                    return (
                        <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="3"
                            fill={color}
                            className="drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]"
                        />
                    );
                })}
            </svg>
        </div>
    );
};

export default RadarChart;
