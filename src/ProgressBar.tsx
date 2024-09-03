import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ReferenceLine,
  Label,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./ProgressBar.css";

interface Milestone {
  label: string;
  amount: number;
}

interface ProgressData {
  currentAmount: number;
  barMax: number;
  milestones: Milestone[];
  target?: number;
}

interface ProgressBarProps {
  data: ProgressData;
  height?: number;
  showK: boolean;
}

const CustomBar = ({
  x,
  y,
  width,
  height,
  fill,
  barMax,
  amount,
  target,
  showK,
}: any) => {
  let className = "progress-bar-rect ";
  if (target && amount >= target) {
    className += "above-target";
  } else {
    className += "below-target";
  }
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        className={className}
        rx={height / 2}
        ry={height / 2}
      />
      <text x={x + width} y={y - 8} textAnchor="end" className="progress-label">
        {`${amount}${showK ? "k" : ""}`}
      </text>
    </g>
  );
};

const CustomizableProgressBar: React.FC<ProgressBarProps> = ({
  data,
  height = 100,
  showK,
}) => {
  const { currentAmount, barMax, milestones, target } = data;

  const chartData = [{ name: "Progress", amount: currentAmount }];

  const generateTicks = (max: number) => {
    if (max === 100) {
      return [0, 20, 40, 60, 80, 100];
    } else {
      const count = 5;
      const interval = max / count;
      return Array.from({ length: count + 1 }, (_, i) =>
        Math.round(i * interval)
      );
    }
  };

  const xAxisTicks = generateTicks(barMax);

  return (
    <div className="customizable-progress-bar">
      <ResponsiveContainer width="100%" height={height + 60}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 30, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, barMax]}
            tickFormatter={(amount) => `${amount}${showK ? "k" : ""}`}
            ticks={xAxisTicks}
          />
          <YAxis type="category" dataKey="name" hide />
          <Bar
            dataKey="amount"
            shape={<CustomBar barMax={barMax} target={target} showK={showK} />}
          />
          {target && (
            <ReferenceLine
              x={target}
              stroke="var(--milestone-color)"
              strokeWidth={2}
            >
              <Label
                value={`Target ${target}${showK ? "k" : ""}`}
                position="top"
                offset={20}
                className="target-label"
              />
            </ReferenceLine>
          )}
          {milestones.map((milestone, index) => (
            <ReferenceLine
              key={index}
              x={milestone.amount}
              stroke="#666"
              strokeWidth={2}
              strokeDasharray="3 3"
            >
              <Label
                value={`${milestone.label} ${milestone.amount}${
                  showK ? "k" : ""
                }`}
                position="bottom"
                offset={35}
                className="milestone-label"
                fill="#666"
              />
            </ReferenceLine>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomizableProgressBar;
