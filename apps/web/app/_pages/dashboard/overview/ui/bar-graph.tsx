"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import type { ChartConfig } from "@terra/ui/components/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@terra/ui/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@terra/ui/components/chart";

export const description = "Daily production (kg) vs tokenized (kg)";

const chartData = [
  { date: "2024-04-01", producedKg: 220, tokenizedKg: 150 },
  { date: "2024-04-02", producedKg: 180, tokenizedKg: 120 },
  { date: "2024-04-03", producedKg: 210, tokenizedKg: 140 },
  { date: "2024-04-04", producedKg: 260, tokenizedKg: 180 },
  { date: "2024-04-05", producedKg: 290, tokenizedKg: 190 },
  { date: "2024-04-06", producedKg: 340, tokenizedKg: 220 },
  { date: "2024-04-07", producedKg: 200, tokenizedKg: 160 },
  { date: "2024-04-08", producedKg: 320, tokenizedKg: 210 },
  { date: "2024-04-09", producedKg: 150, tokenizedKg: 90 },
  { date: "2024-04-10", producedKg: 260, tokenizedKg: 170 },
  { date: "2024-04-11", producedKg: 350, tokenizedKg: 230 },
  { date: "2024-04-12", producedKg: 210, tokenizedKg: 160 },
  { date: "2024-04-13", producedKg: 380, tokenizedKg: 240 },
  { date: "2024-04-14", producedKg: 220, tokenizedKg: 150 },
  { date: "2024-04-15", producedKg: 170, tokenizedKg: 120 },
  { date: "2024-04-16", producedKg: 190, tokenizedKg: 130 },
  { date: "2024-04-17", producedKg: 360, tokenizedKg: 250 },
  { date: "2024-04-18", producedKg: 410, tokenizedKg: 280 },
  { date: "2024-04-19", producedKg: 180, tokenizedKg: 120 },
  { date: "2024-04-20", producedKg: 150, tokenizedKg: 100 },
  { date: "2024-04-21", producedKg: 200, tokenizedKg: 140 },
  { date: "2024-04-22", producedKg: 170, tokenizedKg: 120 },
  { date: "2024-04-23", producedKg: 230, tokenizedKg: 150 },
  { date: "2024-04-24", producedKg: 290, tokenizedKg: 200 },
  { date: "2024-04-25", producedKg: 250, tokenizedKg: 170 },
  { date: "2024-04-26", producedKg: 130, tokenizedKg: 90 },
  { date: "2024-04-27", producedKg: 420, tokenizedKg: 300 },
  { date: "2024-04-28", producedKg: 180, tokenizedKg: 130 },
  { date: "2024-04-29", producedKg: 240, tokenizedKg: 180 },
  { date: "2024-04-30", producedKg: 380, tokenizedKg: 260 },
];

const chartConfig = {
  producedKg: {
    label: "Produced (kg)",
    color: "var(--primary)",
  },
  tokenizedKg: {
    label: "Tokenized (kg)",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function BarGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("producedKg");

  const total = React.useMemo(
    () => ({
      producedKg: chartData.reduce((acc, curr) => acc + curr.producedKg, 0),
      tokenizedKg: chartData.reduce((acc, curr) => acc + curr.tokenizedKg, 0),
    }),
    [],
  );

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // removed error mocking

  if (!isClient) {
    return null;
  }

  return (
    <Card className="@container/card !pt-3">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 !py-0">
          <CardTitle>Production and Tokenization Overview</CardTitle>
          <CardDescription>
            <span className="hidden @[540px]/card:block">
              Total for the last 3 months
            </span>
            <span className="@[540px]/card:hidden">Last 3 months</span>
          </CardDescription>
        </div>
        <div className="flex">
          {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>).map(
            (chart) => {
              if (total[chart] === 0) return null;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="data-[active=true]:bg-primary/5 hover:bg-primary/5 relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left transition-colors duration-200 even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-muted-foreground text-xs">
                    {chartConfig[chart].label}
                  </span>
                  <span className="text-lg leading-none font-bold sm:text-3xl">
                    {total[chart]?.toLocaleString()}
                  </span>
                </button>
              );
            },
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id="fillBar" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--primary)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor="var(--primary)"
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--primary)", opacity: 0.1 }}
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill="url(#fillBar)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
