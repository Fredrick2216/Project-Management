
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Workflow, 
  Plus, 
  Settings, 
  Play, 
  Save,
  Trash2,
  GitBranch,
  Clock,
  CheckCircle,
  Edit,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAutomation, Workflow as WorkflowType } from "@/hooks/useAutomation";
import { useForm } from "react-hook-form";

type WorkflowFormData = {
  name: string;
  description: string;
  is_active: boolean;
};

export const WorkflowBuilder = () => {
  const { 
    workflows, 
    loading, 
    createWorkflow, 
    updateWorkflow, 
    deleteWorkflow 
  } = useAutomation();
  
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  const form = useForm<WorkflowFormData>({
    defaultValues: {
      name: '',
      description: '',
      is_active: false
    }
  });

  const stepTypeColors = {
    trigger: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    condition: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    action: 'bg-green-500/20 text-green-400 border-green-500/30'
  };

  const stepTypeIcons = {
    trigger: Clock,
    condition: GitBranch,
    action: CheckCircle
  };

  const onSubmit = async (data: WorkflowFormData) => {
    try {
      if (selectedWorkflow && isEditing && !showCreateForm) {
        await updateWorkflow(selectedWorkflow.id, data);
        setIsEditing(false);
      } else {
        await createWorkflow({
          ...data,
          steps: [],
          executions: 0
        });
        setShowCreateForm(false);
      }
      
      setSelectedWorkflow(null);
      form.reset();
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  };

  const handleDelete = async (workflowId: string) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      await deleteWorkflow(workflowId);
      if (selectedWorkflow?.id === workflowId) {
        setSelectedWorkflow(null);
      }
    }
  };

  const handleEdit = (workflow: WorkflowType) => {
    setSelectedWorkflow(workflow);
    setIsEditing(true);
    setShowCreateForm(false);
    form.reset({
      name: workflow.name,
      description: workflow.description || '',
      is_active: workflow.is_active
    });
  };

  const handleCreateNew = () => {
    setSelectedWorkflow(null);
    setIsEditing(true);
    setShowCreateForm(true);
    form.reset({
      name: '',
      description: '',
      is_active: false
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowCreateForm(false);
    setSelectedWorkflow(null);
    form.reset();
  };

  const toggleWorkflow = async (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (workflow) {
      await updateWorkflow(workflowId, { is_active: !workflow.is_active });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Workflow List */}
      <Card className="dark-glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-primary" />
              <span>Workflows</span>
            </div>
            <Button size="sm" onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {workflows.length === 0 ? (
            <div className="text-center py-8">
              <Workflow className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No workflows created yet</p>
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Workflow
              </Button>
            </div>
          ) : (
            workflows.map((workflow) => (
              <div 
                key={workflow.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-background/80 ${
                  selectedWorkflow?.id === workflow.id ? 'bg-background/80 border-primary/50' : 'bg-background/50'
                }`}
                onClick={() => {
                  setSelectedWorkflow(workflow);
                  setIsEditing(false);
                  setShowCreateForm(false);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{workflow.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={workflow.is_active ? "default" : "secondary"} className="text-xs">
                      {workflow.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWorkflow(workflow.id);
                      }}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{workflow.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{workflow.steps.length} steps</span>
                  <span className="text-muted-foreground">{workflow.executions} runs</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Workflow Builder */}
      <div className="lg:col-span-2">
        <Card className="dark-glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {isEditing ? (showCreateForm ? 'Create New Workflow' : 'Edit Workflow') : 
                 selectedWorkflow ? selectedWorkflow.name : 'Workflow Details'}
              </span>
              {selectedWorkflow && !isEditing && (
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(selectedWorkflow)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDelete(selectedWorkflow.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workflow Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter workflow name" />
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
                          <Textarea {...field} placeholder="Describe your workflow" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center gap-2 pt-4">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-1" />
                      Save Workflow
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            ) : selectedWorkflow ? (
              <div className="space-y-6">
                <p className="text-muted-foreground">{selectedWorkflow.description}</p>
                
                {/* Workflow Steps */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Workflow Steps</h4>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Step
                    </Button>
                  </div>
                  
                  {selectedWorkflow.steps.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                      <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No steps configured yet</p>
                      <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Step
                      </Button>
                    </div>
                  ) : (
                    selectedWorkflow.steps.map((step, index) => {
                      const StepIcon = stepTypeIcons[step.type];
                      return (
                        <div key={step.id} className="flex items-center gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`p-3 rounded-full border ${stepTypeColors[step.type]}`}>
                              <StepIcon className="h-4 w-4" />
                            </div>
                            {index < selectedWorkflow.steps.length - 1 && (
                              <div className="w-px h-8 bg-border mt-2" />
                            )}
                          </div>
                          <div className="flex-1 p-3 rounded-lg bg-background/50">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium text-sm">{step.name}</h5>
                              <Badge variant="outline" className="text-xs">
                                {step.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Workflow Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{selectedWorkflow.executions}</div>
                    <div className="text-sm text-muted-foreground">Total Executions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {selectedWorkflow.is_active ? 'Active' : 'Inactive'}
                    </div>
                    <div className="text-sm text-muted-foreground">Status</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Workflow className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a workflow to view details or create a new one</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
