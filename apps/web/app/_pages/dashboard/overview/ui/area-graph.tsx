"use client";

import { IconTrendingUp } from "@tabler/icons-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
  { month: "January", tokenized: 1200, sold: 800 },
  { month: "February", tokenized: 1500, sold: 1100 },
  { month: "March", tokenized: 1400, sold: 1000 },
  { month: "April", tokenized: 900, sold: 700 },
  { month: "May", tokenized: 1600, sold: 1300 },
  { month: "June", tokenized: 1700, sold: 1400 },
];

const chartConfig = {
  tokenized: {
    label: "Tokenized (kg)",
    color: "var(--primary)",
  },
  sold: {
    label: "Sold (kg)",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function AreaGraph() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Tokenized vs Sold</CardTitle>
        <CardDescription>Past 6 months (kg)</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id="fillTokenized" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-tokenized)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-tokenized)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSold" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-sold)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-sold)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="sold"
              type="natural"
              fill="url(#fillSold)"
              stroke="var(--color-sold)"
              stackId="a"
            />
            <Area
              dataKey="tokenized"
              type="natural"
              fill="url(#fillTokenized)"
              stroke="var(--color-tokenized)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up over the last month{" "}
              <IconTrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              January - June
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
