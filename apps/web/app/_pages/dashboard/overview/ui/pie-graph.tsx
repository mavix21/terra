"use client";

import * as React from "react";
import { IconTrendingUp } from "@tabler/icons-react";
import { Label, Pie, PieChart } from "recharts";

import type { ChartConfig } from "@terra/ui/components/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@terra/ui/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@terra/ui/components/chart";

const chartData = [
  { name: "Caturra", visitors: 275 },
  { name: "Bourbon", visitors: 200 },
  { name: "Geisha", visitors: 287 },
  { name: "Typica", visitors: 173 },
  { name: "Other", visitors: 190 },
];

const chartConfig = {
  visitors: {
    label: "Revenue",
  },
} satisfies ChartConfig;

export function PieGraph() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Visitor Distribution by Coffee Variety</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total visitors by browser for the last 6 months
          </span>
          <span className="@[540px]/card:hidden">Browser distribution</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          <PieChart>
            <defs>
              {chartData.map((_, index) => (
                <linearGradient
                  key={index}
                  id={`fill${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--primary)"
                    stopOpacity={1 - index * 0.15}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--primary)"
                    stopOpacity={0.8 - index * 0.15}
                  />
                </linearGradient>
              ))}
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData.map((item, index) => ({
                ...item,
                fill: `url(#fill${index})`,
              }))}
              dataKey="visitors"
              nameKey="name"
              innerRadius={60}
              strokeWidth={2}
              stroke="var(--background)"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Total Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Chrome leads with{" "}
          {((chartData[0]!.visitors / totalVisitors) * 100).toFixed(1)}%{" "}
          <IconTrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Based on data from January - June 2024
        </div>
      </CardFooter>
    </Card>
  );
}
