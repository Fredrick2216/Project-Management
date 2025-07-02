
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Zap } from "lucide-react";

interface ProductivityChartProps {
  data: any[];
}

export const ProductivityChart = ({ data }: ProductivityChartProps) => {
  const averageScore = data.reduce((sum, item) => sum + (item.productivity_score || 0), 0) / data.length || 0;
  const trend = data.length > 1 ? data[data.length - 1].productivity_score - data[0].productivity_score : 0;

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>Productivity Insights</span>
          </CardTitle>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>Avg: {Math.round(averageScore)}%</span>
            </div>
            <div className={`flex items-center space-x-1 ${trend > 0 ? 'text-ai-success' : 'text-ai-danger'}`}>
              <TrendingUp className="h-3 w-3" />
              <span>{trend > 0 ? '+' : ''}{Math.round(trend)}%</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="productivityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="productivity_score" 
              stroke="hsl(var(--primary))" 
              fillOpacity={1}
              fill="url(#productivityGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
