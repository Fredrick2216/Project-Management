
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, Lightbulb, Rocket, Star, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  category: 'productivity' | 'efficiency' | 'collaboration' | 'optimization';
  actionable: string;
  estimatedGain: string;
}

export const AIRecommendationsEngine = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateRecommendations = () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const newRecommendations: AIRecommendation[] = [
        {
          id: '1',
          title: 'Optimize Morning Productivity Window',
          description: 'AI detected 40% higher task completion rates between 9-11 AM. Consider scheduling critical tasks during this period.',
          impact: 'high',
          confidence: 94,
          category: 'productivity',
          actionable: 'Auto-schedule high-priority tasks for morning hours',
          estimatedGain: '+25% efficiency'
        },
        {
          id: '2',
          title: 'Team Collaboration Bottleneck Detected',
          description: 'Analysis shows 23% of tasks are delayed due to approval processes. Implement parallel review workflows.',
          impact: 'medium',
          confidence: 87,
          category: 'collaboration',
          actionable: 'Enable concurrent reviews for non-critical approvals',
          estimatedGain: '+15% faster delivery'
        },
        {
          id: '3',
          title: 'Predictive Task Dependencies',
          description: 'ML model identified potential blockers in 3 upcoming tasks. Proactive resolution recommended.',
          impact: 'high',
          confidence: 91,
          category: 'optimization',
          actionable: 'Auto-create dependency resolution tasks',
          estimatedGain: 'Prevent 2-3 day delays'
        },
        {
          id: '4',
          title: 'Smart Resource Allocation',
          description: 'Current workload distribution shows 67% efficiency potential. Redistribute based on individual strengths.',
          impact: 'medium',
          confidence: 82,
          category: 'efficiency',
          actionable: 'Implement AI-powered task assignment',
          estimatedGain: '+20% team performance'
        }
      ];
      
      setRecommendations(newRecommendations);
      setIsGenerating(false);
      
      toast({
        title: "AI Recommendations Generated",
        description: `${newRecommendations.length} optimization opportunities identified`,
      });
    }, 2000);
  };

  useEffect(() => {
    generateRecommendations();
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-500 bg-green-50 border-green-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'productivity': return TrendingUp;
      case 'efficiency': return Rocket;
      case 'collaboration': return Star;
      case 'optimization': return Lightbulb;
      default: return Brain;
    }
  };

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI Recommendations Engine</span>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              Smart ML
            </Badge>
          </div>
          <Button
            size="sm"
            onClick={generateRecommendations}
            disabled={isGenerating}
            className="ai-gradient text-white"
          >
            {isGenerating ? 'Analyzing...' : 'Regenerate'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => {
          const CategoryIcon = getCategoryIcon(rec.category);
          return (
            <div key={rec.id} className="p-4 rounded-lg border bg-background/50 hover:bg-background/80 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <CategoryIcon className="h-4 w-4 text-primary" />
                  <h4 className="font-medium text-sm">{rec.title}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs border ${getImpactColor(rec.impact)}`}>
                    {rec.impact} impact
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {rec.confidence}% confidence
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-xs">
                    <span className="text-muted-foreground">Expected gain: </span>
                    <span className="font-medium text-green-600">{rec.estimatedGain}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Apply <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
              
              <div className="mt-2 text-xs text-muted-foreground">
                💡 {rec.actionable}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
