"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export default function ElectricityUsage() {
  return (
    <Card className="flex flex-col lg:max-w-md">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
        <div>
          <CardDescription>Daily Consumption</CardDescription>
          <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
            20
            <span className="text-sm font-normal tracking-normal text-muted-foreground">
              kWh
            </span>
          </CardTitle>
        </div>
        <div>
          <CardDescription>Peak Usage</CardDescription>
          <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
            5
            <span className="text-sm font-normal tracking-normal text-muted-foreground">
              kWh
            </span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 items-center">
        <ChartContainer
          config={{
            usage: {
              label: "Usage",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="w-full"
        >
          <LineChart
            accessibilityLayer
            margin={{
              left: 14,
              right: 14,
              top: 10,
            }}
            data={[
              { date: "2024-09-01", usage: 22 },
              { date: "2024-09-02", usage: 18 },
              { date: "2024-09-03", usage: 25 },
              { date: "2024-09-04", usage: 20 },
              { date: "2024-09-05", usage: 15 },
              { date: "2024-09-06", usage: 30 },
              { date: "2024-09-07", usage: 22 },
            ]}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="hsl(var(--muted-foreground))"
              strokeOpacity={0.5}
            />
            <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                })
              }}
            />
            <Line
              dataKey="usage"
              type="natural"
              fill="var(--color-usage)"
              stroke="var(--color-usage)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                fill: "var(--color-usage)",
                stroke: "var(--color-usage)",
                r: 4,
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  }}
                />
              }
              cursor={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
