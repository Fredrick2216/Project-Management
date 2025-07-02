
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, TrendingUp, AlertTriangle, Target, Zap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PredictiveAnalyticsService, PredictionData } from "@/services/predictiveAnalytics";
import { useToast } from "@/hooks/use-toast";

export const PredictiveInsights = () => {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadPredictions = async () => {
    setIsLoading(true);
    try {
      const newPredictions = await PredictiveAnalyticsService.generatePredictions();
      setPredictions(newPredictions);
    } catch (error) {
      console.error('Error loading predictions:', error);
      toast({
        title: "Error loading predictions",
        description: "Failed to generate predictive insights",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPredictions();
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <Target className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span>Predictive Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">AI is analyzing your data patterns...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>Predictive Analytics</span>
          <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
            <Zap className="h-3 w-3 mr-1" />
            Real-time AI
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={loadPredictions}
            className="ml-auto"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {predictions.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">No data available for predictions</p>
            <p className="text-xs text-muted-foreground mt-2">Complete some tasks to see predictive insights</p>
          </div>
        ) : (
          predictions.map((prediction, index) => (
            <div key={index} className="p-4 rounded-lg border bg-background/50 hover:bg-background/80 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getTrendIcon(prediction.trend)}
                  <h4 className="font-medium text-sm">{prediction.metric}</h4>
                </div>
                <Badge className={`text-xs border ${getImpactColor(prediction.impact)}`}>
                  {prediction.impact}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Current</p>
                  <p className="text-lg font-bold">{prediction.current}{prediction.metric.includes('Rate') ? '%' : prediction.metric.includes('Time') ? ' days' : ''}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Predicted</p>
                  <p className="text-lg font-bold text-primary">{prediction.predicted}{prediction.metric.includes('Rate') ? '%' : prediction.metric.includes('Time') ? ' days' : ''}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Confidence Level</span>
                  <span>{prediction.confidence}%</span>
                </div>
                <Progress value={prediction.confidence} className="h-2" />
              </div>

              <div className="mt-3 space-y-1">
                <div className="text-xs text-muted-foreground">
                  📊 Timeframe: {prediction.timeframe}
                </div>
                <div className="text-xs text-muted-foreground">
                  🔍 {prediction.reasoning}
                </div>
              </div>
            </div>
          ))
        )}
        
        <div className="text-center pt-4 border-t">
          <Badge variant="outline" className="text-xs">
            Predictions based on your actual task and performance data
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
