
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause,
  Zap,
  Target,
  Users,
  Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAutomation, AutomationRule } from "@/hooks/useAutomation";
import { useForm } from "react-hook-form";

type AutomationFormData = {
  name: string;
  description: string;
  category: 'task' | 'project' | 'team' | 'notification';
  trigger_type: string;
  is_active: boolean;
  priority: number;
};

export const AutomationRulesManager = () => {
  const { 
    automationRules, 
    loading, 
    createAutomationRule, 
    updateAutomationRule, 
    deleteAutomationRule 
  } = useAutomation();
  
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const form = useForm<AutomationFormData>({
    defaultValues: {
      name: '',
      description: '',
      category: 'task',
      trigger_type: 'schedule',
      is_active: true,
      priority: 1
    }
  });

  const categoryIcons = {
    task: Zap,
    project: Target,
    team: Users,
    notification: Bell
  };

  const categoryColors = {
    task: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    project: 'bg-green-500/20 text-green-400 border-green-500/30',
    team: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    notification: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  };

  const onSubmit = async (data: AutomationFormData) => {
    try {
      if (isEditing && selectedRule) {
        await updateAutomationRule(selectedRule.id, {
          ...data,
          trigger_conditions: {},
          actions: []
        });
        toast({
          title: "Success",
          description: "Automation rule updated successfully",
        });
      } else {
        await createAutomationRule({
          ...data,
          trigger_conditions: {},
          actions: [],
          confidence: 85,
          execution_count: 0,
          success_rate: 0
        });
        toast({
          title: "Success",
          description: "Automation rule created successfully",
        });
      }
      
      setIsDialogOpen(false);
      setIsEditing(false);
      setSelectedRule(null);
      form.reset();
    } catch (error) {
      console.error('Error saving automation rule:', error);
      toast({
        title: "Error",
        description: "Failed to save automation rule",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (rule: AutomationRule) => {
    setSelectedRule(rule);
    setIsEditing(true);
    form.reset({
      name: rule.name,
      description: rule.description || '',
      category: rule.category,
      trigger_type: rule.trigger_type,
      is_active: rule.is_active,
      priority: rule.priority
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (ruleId: string) => {
    if (window.confirm('Are you sure you want to delete this automation rule?')) {
      try {
        await deleteAutomationRule(ruleId);
        toast({
          title: "Success",
          description: "Automation rule deleted successfully",
        });
      } catch (error) {
        console.error('Error deleting automation rule:', error);
        toast({
          title: "Error",
          description: "Failed to delete automation rule",
          variant: "destructive"
        });
      }
    }
  };

  const toggleRule = async (ruleId: string) => {
    const rule = automationRules.find(r => r.id === ruleId);
    if (rule) {
      try {
        await updateAutomationRule(ruleId, { is_active: !rule.is_active });
        toast({
          title: "Success",
          description: `Rule ${rule.is_active ? 'disabled' : 'enabled'} successfully`,
        });
      } catch (error) {
        console.error('Error toggling rule:', error);
        toast({
          title: "Error",
          description: "Failed to update automation rule",
          variant: "destructive"
        });
      }
    }
  };

  const handleCreateNew = () => {
    setSelectedRule(null);
    setIsEditing(false);
    form.reset({
      name: '',
      description: '',
      category: 'task',
      trigger_type: 'schedule',
      is_active: true,
      priority: 1
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="dark-glass-card border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Automation Rules Manager</span>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Create Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? 'Edit Automation Rule' : 'Create New Automation Rule'}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Rule name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rule Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter rule name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Describe your automation rule" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="task">Task</SelectItem>
                              <SelectItem value="project">Project</SelectItem>
                              <SelectItem value="team">Team</SelectItem>
                              <SelectItem value="notification">Notification</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="trigger_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trigger Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select trigger" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="schedule">Schedule</SelectItem>
                              <SelectItem value="task_complete">Task Complete</SelectItem>
                              <SelectItem value="project_update">Project Update</SelectItem>
                              <SelectItem value="team_activity">Team Activity</SelectItem>
                              <SelectItem value="deadline_approaching">Deadline Approaching</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority (1-10)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="1" 
                            max="10" 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            placeholder="Enter priority level" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {isEditing ? 'Update Rule' : 'Create Rule'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {automationRules.length === 0 ? (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Automation Rules</h3>
            <p className="text-muted-foreground mb-4">
              Create your first automation rule to streamline your workflow
            </p>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Rule
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {automationRules.map((rule) => {
              const CategoryIcon = categoryIcons[rule.category];
              return (
                <div 
                  key={rule.id}
                  className="p-4 rounded-lg border bg-background/50 hover:bg-background/80 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${categoryColors[rule.category]}`}>
                        <CategoryIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{rule.name}</h4>
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={rule.is_active ? "default" : "secondary"}>
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleRule(rule.id)}
                      >
                        {rule.is_active ? 
                          <Pause className="h-4 w-4" /> : 
                          <Play className="h-4 w-4" />
                        }
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(rule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Category:</span>
                      <div className="font-medium capitalize">{rule.category}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Trigger:</span>
                      <div className="font-medium">{rule.trigger_type.replace('_', ' ')}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Priority:</span>
                      <div className="font-medium">{rule.priority}/10</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Executions:</span>
                      <div className="font-medium">{rule.execution_count}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
