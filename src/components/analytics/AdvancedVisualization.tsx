
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, BarChart3, Activity, Zap, RefreshCw } from "lucide-react";
import { PredictiveAnalyticsService, HeatmapData, RadarData } from "@/services/predictiveAnalytics";
import { useToast } from "@/hooks/use-toast";

export const AdvancedVisualization = () => {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [radarData, setRadarData] = useState<RadarData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadVisualizationData = async () => {
    setIsLoading(true);
    try {
      const [heatmap, radar] = await Promise.all([
        PredictiveAnalyticsService.generateHeatmapData(),
        PredictiveAnalyticsService.generateRadarData()
      ]);
      setHeatmapData(heatmap);
      setRadarData(radar);
    } catch (error) {
      console.error('Error loading visualization data:', error);
      toast({
        title: "Error loading visualizations",
        description: "Failed to generate visualization data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVisualizationData();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-48 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Performance Radar Chart */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Performance Matrix</span>
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              Real-time Data
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={loadVisualizationData}
              className="ml-auto"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" className="text-xs" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
                <Radar
                  name="Performance"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No performance data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Productivity Heatmap */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>Productivity Heatmap</span>
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              Time-based
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {heatmapData.length > 0 ? (
            <>
              <div className="grid grid-cols-6 gap-1 text-xs">
                <div></div>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                  <div key={day} className="text-center font-medium">{day}</div>
                ))}
                {heatmapData.map((row, index) => (
                  <React.Fragment key={index}>
                    <div className="text-right pr-2">{row.hour}</div>
                    <div className={`h-8 rounded ${Number(row.Mon) > 90 ? 'bg-green-500' : Number(row.Mon) > 70 ? 'bg-yellow-500' : 'bg-red-500'} opacity-80 flex items-center justify-center text-xs text-white font-medium`}>
                      {row.Mon}
                    </div>
                    <div className={`h-8 rounded ${Number(row.Tue) > 90 ? 'bg-green-500' : Number(row.Tue) > 70 ? 'bg-yellow-500' : 'bg-red-500'} opacity-80 flex items-center justify-center text-xs text-white font-medium`}>
                      {row.Tue}
                    </div>
                    <div className={`h-8 rounded ${Number(row.Wed) > 90 ? 'bg-green-500' : Number(row.Wed) > 70 ? 'bg-yellow-500' : 'bg-red-500'} opacity-80 flex items-center justify-center text-xs text-white font-medium`}>
                      {row.Wed}
                    </div>
                    <div className={`h-8 rounded ${Number(row.Thu) > 90 ? 'bg-green-500' : Number(row.Thu) > 70 ? 'bg-yellow-500' : 'bg-red-500'} opacity-80 flex items-center justify-center text-xs text-white font-medium`}>
                      {row.Thu}
                    </div>
                    <div className={`h-8 rounded ${Number(row.Fri) > 90 ? 'bg-green-500' : Number(row.Fri) > 70 ? 'bg-yellow-500' : 'bg-red-500'} opacity-80 flex items-center justify-center text-xs text-white font-medium`}>
                      {row.Fri}
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-xs">High (90%+)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-xs">Medium (70-90%)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-xs">Low (&lt;70%)</span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No productivity data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Trends Chart */}
      <Card className="glass-card border-white/10 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Performance Metrics Overview</span>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Zap className="h-3 w-3 mr-1" />
              Live Data
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={radarData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Complete some tasks to see performance metrics
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
