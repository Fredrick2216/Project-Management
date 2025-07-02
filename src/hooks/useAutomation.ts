
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  category: 'task' | 'project' | 'team' | 'notification';
  trigger_type: string;
  trigger_conditions: Record<string, any>;
  actions: Array<{ type: string; config: Record<string, any> }>;
  is_active: boolean;
  priority: number;
  confidence: number;
  execution_count: number;
  success_rate: number;
  last_executed?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: Array<{
    id: string;
    type: 'trigger' | 'condition' | 'action';
    name: string;
    description: string;
    config: Record<string, any>;
  }>;
  is_active: boolean;
  executions: number;
  created_at: Date;
  updated_at: Date;
}

export interface PredictiveTask {
  id: string;
  title: string;
  estimated_duration: number;
  priority: 'low' | 'medium' | 'high';
  complexity: number;
  dependencies: string[];
  suggested_start_time: Date;
  confidence: number;
  reasoning: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export const useAutomation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [predictiveTasks, setPredictiveTasks] = useState<PredictiveTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch automation rules
  const fetchAutomationRules = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedRules = data?.map(rule => ({
        id: rule.id,
        name: rule.name,
        description: rule.description || '',
        category: rule.category as 'task' | 'project' | 'team' | 'notification',
        trigger_type: rule.trigger_type,
        trigger_conditions: (rule.trigger_conditions as Record<string, any>) || {},
        actions: (rule.actions as Array<{ type: string; config: Record<string, any> }>) || [],
        is_active: rule.is_active || false,
        priority: rule.priority || 1,
        confidence: rule.confidence || 0,
        execution_count: rule.execution_count || 0,
        success_rate: rule.success_rate || 0,
        last_executed: rule.last_executed ? new Date(rule.last_executed) : undefined,
        created_at: new Date(rule.created_at),
        updated_at: new Date(rule.updated_at)
      })) || [];
      
      setAutomationRules(transformedRules);
    } catch (error) {
      console.error('Error fetching automation rules:', error);
      toast({
        title: "Error",
        description: "Failed to load automation rules",
        variant: "destructive"
      });
    }
  };

  // Create automation rule
  const createAutomationRule = async (rule: Omit<AutomationRule, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('automation_rules')
        .insert([{
          user_id: user.id,
          name: rule.name,
          description: rule.description,
          category: rule.category,
          trigger_type: rule.trigger_type,
          trigger_conditions: rule.trigger_conditions,
          actions: rule.actions,
          is_active: rule.is_active,
          priority: rule.priority,
          confidence: rule.confidence,
          execution_count: rule.execution_count,
          success_rate: rule.success_rate,
          last_executed: rule.last_executed?.toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      const newRule: AutomationRule = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        category: data.category as 'task' | 'project' | 'team' | 'notification',
        trigger_type: data.trigger_type,
        trigger_conditions: (data.trigger_conditions as Record<string, any>) || {},
        actions: (data.actions as Array<{ type: string; config: Record<string, any> }>) || [],
        is_active: data.is_active || false,
        priority: data.priority || 1,
        confidence: data.confidence || 0,
        execution_count: data.execution_count || 0,
        success_rate: data.success_rate || 0,
        last_executed: data.last_executed ? new Date(data.last_executed) : undefined,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };

      setAutomationRules(prev => [newRule, ...prev]);
      
      toast({
        title: "Success",
        description: "Automation rule created successfully",
      });

      return newRule;
    } catch (error) {
      console.error('Error creating automation rule:', error);
      toast({
        title: "Error",
        description: "Failed to create automation rule",
        variant: "destructive"
      });
    }
  };

  // Update automation rule
  const updateAutomationRule = async (id: string, updates: Partial<AutomationRule>) => {
    if (!user) return;

    try {
      const updateData: any = { ...updates };
      if (updateData.last_executed) {
        updateData.last_executed = updateData.last_executed.toISOString();
      }
      if (updateData.created_at) {
        delete updateData.created_at;
      }
      if (updateData.updated_at) {
        delete updateData.updated_at;
      }

      const { data, error } = await supabase
        .from('automation_rules')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedRule: AutomationRule = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        category: data.category as 'task' | 'project' | 'team' | 'notification',
        trigger_type: data.trigger_type,
        trigger_conditions: (data.trigger_conditions as Record<string, any>) || {},
        actions: (data.actions as Array<{ type: string; config: Record<string, any> }>) || [],
        is_active: data.is_active || false,
        priority: data.priority || 1,
        confidence: data.confidence || 0,
        execution_count: data.execution_count || 0,
        success_rate: data.success_rate || 0,
        last_executed: data.last_executed ? new Date(data.last_executed) : undefined,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };

      setAutomationRules(prev => prev.map(rule => 
        rule.id === id ? updatedRule : rule
      ));

      toast({
        title: "Success",
        description: "Automation rule updated successfully",
      });
    } catch (error) {
      console.error('Error updating automation rule:', error);
      toast({
        title: "Error",
        description: "Failed to update automation rule",
        variant: "destructive"
      });
    }
  };

  // Delete automation rule
  const deleteAutomationRule = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('automation_rules')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setAutomationRules(prev => prev.filter(rule => rule.id !== id));
      
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
  };

  // Fetch workflows
  const fetchWorkflows = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedWorkflows = data?.map(workflow => ({
        id: workflow.id,
        name: workflow.name,
        description: workflow.description || '',
        steps: (workflow.steps as Array<{
          id: string;
          type: 'trigger' | 'condition' | 'action';
          name: string;
          description: string;
          config: Record<string, any>;
        }>) || [],
        is_active: workflow.is_active || false,
        executions: workflow.executions || 0,
        created_at: new Date(workflow.created_at),
        updated_at: new Date(workflow.updated_at)
      })) || [];
      
      setWorkflows(transformedWorkflows);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      toast({
        title: "Error",
        description: "Failed to load workflows",
        variant: "destructive"
      });
    }
  };

  // Create workflow
  const createWorkflow = async (workflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('workflows')
        .insert([{
          user_id: user.id,
          name: workflow.name,
          description: workflow.description,
          steps: workflow.steps,
          is_active: workflow.is_active,
          executions: workflow.executions
        }])
        .select()
        .single();

      if (error) throw error;

      const newWorkflow: Workflow = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        steps: (data.steps as Array<{
          id: string;
          type: 'trigger' | 'condition' | 'action';
          name: string;
          description: string;
          config: Record<string, any>;
        }>) || [],
        is_active: data.is_active || false,
        executions: data.executions || 0,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };

      setWorkflows(prev => [newWorkflow, ...prev]);
      
      toast({
        title: "Success",
        description: "Workflow created successfully",
      });

      return newWorkflow;
    } catch (error) {
      console.error('Error creating workflow:', error);
      toast({
        title: "Error",
        description: "Failed to create workflow",
        variant: "destructive"
      });
    }
  };

  // Update workflow
  const updateWorkflow = async (id: string, updates: Partial<Workflow>) => {
    if (!user) return;

    try {
      const updateData: any = { ...updates };
      if (updateData.created_at) {
        delete updateData.created_at;
      }
      if (updateData.updated_at) {
        delete updateData.updated_at;
      }

      const { data, error } = await supabase
        .from('workflows')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedWorkflow: Workflow = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        steps: (data.steps as Array<{
          id: string;
          type: 'trigger' | 'condition' | 'action';
          name: string;
          description: string;
          config: Record<string, any>;
        }>) || [],
        is_active: data.is_active || false,
        executions: data.executions || 0,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };

      setWorkflows(prev => prev.map(workflow => 
        workflow.id === id ? updatedWorkflow : workflow
      ));

      toast({
        title: "Success",
        description: "Workflow updated successfully",
      });
    } catch (error) {
      console.error('Error updating workflow:', error);
      toast({
        title: "Error",
        description: "Failed to update workflow",
        variant: "destructive"
      });
    }
  };

  // Delete workflow
  const deleteWorkflow = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setWorkflows(prev => prev.filter(workflow => workflow.id !== id));
      
      toast({
        title: "Success",
        description: "Workflow deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting workflow:', error);
      toast({
        title: "Error",
        description: "Failed to delete workflow",
        variant: "destructive"
      });
    }
  };

  // Fetch predictive tasks
  const fetchPredictiveTasks = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('predictive_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('suggested_start_time', { ascending: true });

      if (error) throw error;
      
      const transformedTasks = data?.map(task => ({
        id: task.id,
        title: task.title,
        estimated_duration: task.estimated_duration || 0,
        priority: task.priority as 'low' | 'medium' | 'high',
        complexity: task.complexity || 50,
        dependencies: (task.dependencies as string[]) || [],
        suggested_start_time: new Date(task.suggested_start_time || new Date()),
        confidence: task.confidence || 0,
        reasoning: task.reasoning || '',
        status: task.status || 'pending',
        created_at: new Date(task.created_at),
        updated_at: new Date(task.updated_at)
      })) || [];
      
      setPredictiveTasks(transformedTasks);
    } catch (error) {
      console.error('Error fetching predictive tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load predictive tasks",
        variant: "destructive"
      });
    }
  };

  // Create predictive task
  const createPredictiveTask = async (task: Omit<PredictiveTask, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('predictive_tasks')
        .insert([{
          user_id: user.id,
          title: task.title,
          estimated_duration: task.estimated_duration,
          priority: task.priority,
          complexity: task.complexity,
          dependencies: task.dependencies,
          suggested_start_time: task.suggested_start_time.toISOString(),
          confidence: task.confidence,
          reasoning: task.reasoning,
          status: task.status
        }])
        .select()
        .single();

      if (error) throw error;

      const newTask: PredictiveTask = {
        id: data.id,
        title: data.title,
        estimated_duration: data.estimated_duration || 0,
        priority: data.priority as 'low' | 'medium' | 'high',
        complexity: data.complexity || 50,
        dependencies: (data.dependencies as string[]) || [],
        suggested_start_time: new Date(data.suggested_start_time || new Date()),
        confidence: data.confidence || 0,
        reasoning: data.reasoning || '',
        status: data.status || 'pending',
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };

      setPredictiveTasks(prev => [...prev, newTask].sort((a, b) => 
        a.suggested_start_time.getTime() - b.suggested_start_time.getTime()
      ));
      
      toast({
        title: "Success",
        description: "Predictive task created successfully",
      });

      return newTask;
    } catch (error) {
      console.error('Error creating predictive task:', error);
      toast({
        title: "Error",
        description: "Failed to create predictive task",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([
          fetchAutomationRules(),
          fetchWorkflows(),
          fetchPredictiveTasks()
        ]);
        setLoading(false);
      };
      loadData();
    }
  }, [user]);

  return {
    automationRules,
    workflows,
    predictiveTasks,
    loading,
    createAutomationRule,
    updateAutomationRule,
    deleteAutomationRule,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    createPredictiveTask,
    fetchAutomationRules,
    fetchWorkflows,
    fetchPredictiveTasks
  };
};
