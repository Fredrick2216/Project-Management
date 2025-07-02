
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Trophy, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TaskCompletionChartProps {
  data: any[];
}

export const TaskCompletionChart = ({ data }: TaskCompletionChartProps) => {
  const totalTasks = data.reduce((sum, item) => sum + (item.tasks_completed || 0), 0);
  const bestDay = data.reduce((max, item) => 
    (item.tasks_completed || 0) > (max.tasks_completed || 0) ? item : max, data[0] || {});

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>Task Completion Trends</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className="bg-ai-success/10 text-ai-success">
              <Trophy className="h-3 w-3 mr-1" />
              Best: {bestDay?.tasks_completed || 0} tasks
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Tasks Completed</p>
              <p className="text-2xl font-bold text-primary">{totalTasks}</p>
            </div>
            <Clock className="h-8 w-8 text-primary/60" />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
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
            <Bar 
              dataKey="tasks_completed" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
