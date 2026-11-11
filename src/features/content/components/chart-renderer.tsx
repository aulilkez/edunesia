import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface ChartPoint {
  label: string;
  value: number;
}

export interface ChartRendererProps {
  data: ChartPoint[];
  title: string;
  type: "area" | "bar" | "line" | "pie";
}

const chartConfig = {
  value: {
    label: "value",
    color: "var(--chart-1)",
  },
};

export function ChartRenderer({ data, title, type }: ChartRendererProps) {
  const chartContent = {
    area: (
      <AreaChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend content={<ChartLegendContent />} />
        <Area
          dataKey="value"
          type="monotone"
          stroke="var(--color-value)"
          fill="var(--color-value)"
        />
      </AreaChart>
    ),
    bar: (
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend content={<ChartLegendContent />} />
        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
      </BarChart>
    ),
    line: (
      <LineChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend content={<ChartLegendContent />} />
        <Line dataKey="value" type="monotone" stroke="var(--color-value)" />
      </LineChart>
    ),
    pie: (
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend content={<ChartLegendContent />} />
        <Pie data={data} dataKey="value" nameKey="label" outerRadius="80%" label>
          {data.map((point, index) => (
            <Cell key={point.label} fill={`var(--chart-${(index % 5) + 1})`} />
          ))}
        </Pie>
      </PieChart>
    ),
  }[type];

  return (
    <figure className="my-8 min-w-0">
      <figcaption className="mb-3 font-medium">{title}</figcaption>
      <ChartContainer
        aria-label={title}
        className="min-h-64 w-full"
        config={chartConfig}
        role="img"
      >
        {chartContent}
      </ChartContainer>
    </figure>
  );
}
