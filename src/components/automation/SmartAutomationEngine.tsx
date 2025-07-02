
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  Zap, 
  Brain, 
  Clock, 
  Target, 
  TrendingUp, 
  Settings, 
  Play, 
  Pause,
  CheckCircle,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { AutomationRulesManager } from "./AutomationRulesManager";
import { WorkflowBuilder } from "./WorkflowBuilder";
import { PredictiveScheduler } from "./PredictiveScheduler";
import { useToast } from "@/hooks/use-toast";
import { useAutomation } from "@/hooks/useAutomation";

interface AutomationMetrics {
  totalRules: number;
  activeRules: number;
  totalExecutions: number;
  successRate: number;
  timeSaved: number;
  tasksAutomated: number;
}

export const SmartAutomationEngine = () => {
  const { automationRules, loading, updateAutomationRule } = useAutomation();
  const [metrics, setMetrics] = useState<AutomationMetrics>({
    totalRules: 0,
    activeRules: 0,
    totalExecutions: 0,
    successRate: 0,
    timeSaved: 0,
    tasksAutomated: 0
  });
  const [isLearningMode, setIsLearningMode] = useState(true);
  const [automationEngine, setAutomationEngine] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (automationRules.length > 0) {
      const activeRules = automationRules.filter(rule => rule.is_active).length;
      const totalExecutions = automationRules.reduce((sum, rule) => sum + rule.execution_count, 0);
      const avgSuccessRate = automationRules.length > 0 
        ? automationRules.reduce((sum, rule) => sum + rule.success_rate, 0) / automationRules.length 
        : 0;
      
      setMetrics({
        totalRules: automationRules.length,
        activeRules,
        totalExecutions,
        successRate: Math.round(avgSuccessRate),
        timeSaved: Math.round(totalExecutions * 0.25), // Estimated hours saved
        tasksAutomated: Math.round(totalExecutions * 0.8)
      });
    }
  }, [automationRules]);

  const toggleRule = async (ruleId: string) => {
    const rule = automationRules.find(r => r.id === ruleId);
    if (rule) {
      await updateAutomationRule(ruleId, { is_active: !rule.is_active });
      toast({
        title: "Automation Rule Updated",
        description: `Rule ${rule.is_active ? 'disabled' : 'enabled'} successfully.`,
      });
    }
  };

  const toggleLearningMode = () => {
    setIsLearningMode(!isLearningMode);
    toast({
      title: isLearningMode ? "Learning Mode Disabled" : "Learning Mode Enabled",
      description: isLearningMode 
        ? "AI will stop learning from new patterns" 
        : "AI will learn from user behavior to improve automation",
    });
  };

  const toggleAutomationEngine = () => {
    setAutomationEngine(!automationEngine);
    toast({
      title: automationEngine ? "Automation Engine Stopped" : "Automation Engine Started",
      description: automationEngine 
        ? "All automated processes have been paused" 
        : "Automation engine is now running",
      variant: automationEngine ? "destructive" : "default"
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="dark-glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary animate-pulse" />
            <span className="ai-gradient-text">Smart Automation Engine</span>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="font-medium">Automation Engine</span>
              </div>
              <Switch 
                checked={automationEngine} 
                onCheckedChange={toggleAutomationEngine}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Learning Mode</span>
              </div>
              <Switch 
                checked={isLearningMode} 
                onCheckedChange={toggleLearningMode}
              />
            </div>
            <div className="flex items-center justify-center p-4 rounded-lg bg-background/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{metrics.successRate}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
              <div className="text-2xl font-bold text-blue-400">{metrics.activeRules}</div>
              <div className="text-sm text-muted-foreground">Active Rules</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
              <div className="text-2xl font-bold text-green-400">{metrics.totalExecutions}</div>
              <div className="text-sm text-muted-foreground">Executions</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <div className="text-2xl font-bold text-purple-400">{metrics.timeSaved}h</div>
              <div className="text-sm text-muted-foreground">Time Saved</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20">
              <div className="text-2xl font-bold text-orange-400">{metrics.tasksAutomated}</div>
              <div className="text-sm text-muted-foreground">Tasks Automated</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automation Rules */}
      {automationRules.length > 0 && (
        <Card className="dark-glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>Your Automation Rules</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {automationRules.slice(0, 3).map((rule) => (
                <div key={rule.id} className="p-4 rounded-lg border bg-background/50 hover:bg-background/80 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${rule.is_active ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                        {rule.is_active ? 
                          <Play className="h-4 w-4 text-green-400" /> : 
                          <Pause className="h-4 w-4 text-gray-400" />
                        }
                      </div>
                      <div>
                        <h4 className="font-medium">{rule.name}</h4>
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={rule.is_active} 
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Confidence</div>
                      <div className="flex items-center gap-2">
                        <Progress value={rule.confidence} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{rule.confidence}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Executions</div>
                      <div className="font-medium">{rule.execution_count}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                      <div className="font-medium text-green-400">{rule.success_rate}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Last Run</div>
                      <div className="text-sm">
                        {rule.last_executed ? 
                          rule.last_executed.toLocaleTimeString() : 
                          'Never'
                        }
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span>Trigger: {rule.trigger_type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Actions: {rule.actions.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Features Tabs */}
      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-background/50">
          <TabsTrigger value="workflows">Workflow Builder</TabsTrigger>
          <TabsTrigger value="scheduler">Predictive Scheduler</TabsTrigger>
          <TabsTrigger value="rules">Rules Manager</TabsTrigger>
        </TabsList>
        
        <TabsContent value="workflows">
          <WorkflowBuilder />
        </TabsContent>
        
        <TabsContent value="scheduler">
          <PredictiveScheduler />
        </TabsContent>
        
        <TabsContent value="rules">
          <AutomationRulesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
