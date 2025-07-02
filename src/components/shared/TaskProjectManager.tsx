
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  FolderPlus, 
  UserPlus, 
  Save,
  Trash2,
  Edit3,
  Calendar
} from "lucide-react";
import { useCreateTask, useTasks, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { useCreateProject, useProjects, useUpdateProject, useDeleteProject } from "@/hooks/useProjects";
import { useCreateTeamMember, useTeamMembers, useUpdateTeamMember, useDeleteTeamMember } from "@/hooks/useTeam";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  assigned_to?: string;
  project_id?: string;
  due_date?: string;
  category: string;
}

interface Project {
  id?: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold';
}

interface TeamMember {
  id?: string;
  name: string;
  email: string;
  role: 'member' | 'manager' | 'admin';
  status: 'active' | 'inactive';
}

// Helper functions to safely cast database types to component types
const safeTaskPriority = (priority: string): 'low' | 'medium' | 'high' => {
  if (['low', 'medium', 'high'].includes(priority)) {
    return priority as 'low' | 'medium' | 'high';
  }
  return 'medium';
};

const safeTaskStatus = (status: string): 'pending' | 'in_progress' | 'completed' => {
  if (['pending', 'in_progress', 'completed'].includes(status)) {
    return status as 'pending' | 'in_progress' | 'completed';
  }
  return 'pending';
};

const safeProjectStatus = (status: string): 'active' | 'completed' | 'on_hold' => {
  if (['active', 'completed', 'on_hold'].includes(status)) {
    return status as 'active' | 'completed' | 'on_hold';
  }
  return 'active';
};

const safeTeamRole = (role: string): 'member' | 'manager' | 'admin' => {
  if (['member', 'manager', 'admin'].includes(role)) {
    return role as 'member' | 'manager' | 'admin';
  }
  return 'member';
};

const safeTeamStatus = (status: string): 'active' | 'inactive' => {
  if (['active', 'inactive'].includes(status)) {
    return status as 'active' | 'inactive';
  }
  return 'active';
};

export const TaskProjectManager = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const { data: tasks } = useTasks();
  const { data: projects } = useProjects();
  const { data: teamMembers } = useTeamMembers();
  
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  
  const createTeamMember = useCreateTeamMember();
  const updateTeamMember = useUpdateTeamMember();
  const deleteTeamMember = useDeleteTeamMember();
  
  const { toast } = useToast();

  // Task form state
  const [taskForm, setTaskForm] = useState<Task>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    assigned_to: '',
    project_id: '',
    due_date: '',
    category: 'development'
  });

  // Project form state
  const [projectForm, setProjectForm] = useState<Project>({
    name: '',
    description: '',
    status: 'active'
  });

  // Team member form state
  const [memberForm, setMemberForm] = useState<TeamMember>({
    name: '',
    email: '',
    role: 'member',
    status: 'active'
  });

  const handleCreateTask = async () => {
    if (!taskForm.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }

    try {
      await createTask.mutateAsync(taskForm);
      setTaskForm({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        assigned_to: '',
        project_id: '',
        due_date: '',
        category: 'development'
      });
    } catch (error) {
      console.error('Create task error:', error);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask?.id) return;

    try {
      await updateTask.mutateAsync({
        id: editingTask.id,
        updates: editingTask
      });
      setEditingTask(null);
    } catch (error) {
      console.error('Update task error:', error);
    }
  };

  const handleCreateProject = async () => {
    if (!projectForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Project name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      await createProject.mutateAsync(projectForm);
      setProjectForm({
        name: '',
        description: '',
        status: 'active'
      });
    } catch (error) {
      console.error('Create project error:', error);
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProject?.id) return;

    try {
      await updateProject.mutateAsync({
        id: editingProject.id,
        updates: editingProject
      });
      setEditingProject(null);
    } catch (error) {
      console.error('Update project error:', error);
    }
  };

  const handleCreateTeamMember = async () => {
    if (!memberForm.name.trim() || !memberForm.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and email are required",
        variant: "destructive"
      });
      return;
    }

    try {
      await createTeamMember.mutateAsync(memberForm);
      setMemberForm({
        name: '',
        email: '',
        role: 'member',
        status: 'active'
      });
    } catch (error) {
      console.error('Create team member error:', error);
    }
  };

  const handleUpdateTeamMember = async () => {
    if (!editingMember?.id) return;

    try {
      await updateTeamMember.mutateAsync({
        id: editingMember.id,
        updates: editingMember
      });
      setEditingMember(null);
    } catch (error) {
      console.error('Update team member error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FolderPlus className="h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Team
          </TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={editingTask ? editingTask.title : taskForm.title}
                    onChange={(e) => editingTask 
                      ? setEditingTask({...editingTask, title: e.target.value})
                      : setTaskForm({...taskForm, title: e.target.value})
                    }
                    placeholder="Enter task title"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={editingTask ? editingTask.priority : taskForm.priority}
                    onValueChange={(value: 'low' | 'medium' | 'high') => editingTask
                      ? setEditingTask({...editingTask, priority: value})
                      : setTaskForm({...taskForm, priority: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={editingTask ? editingTask.status : taskForm.status}
                    onValueChange={(value: 'pending' | 'in_progress' | 'completed') => editingTask
                      ? setEditingTask({...editingTask, status: value})
                      : setTaskForm({...taskForm, status: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={editingTask ? editingTask.due_date || '' : taskForm.due_date}
                    onChange={(e) => editingTask
                      ? setEditingTask({...editingTask, due_date: e.target.value})
                      : setTaskForm({...taskForm, due_date: e.target.value})
                    }
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editingTask ? editingTask.description : taskForm.description}
                  onChange={(e) => editingTask
                    ? setEditingTask({...editingTask, description: e.target.value})
                    : setTaskForm({...taskForm, description: e.target.value})
                  }
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={editingTask ? handleUpdateTask : handleCreateTask}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingTask ? 'Update Task' : 'Create Task'}
                </Button>
                {editingTask && (
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingTask(null)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tasks List */}
          <Card>
            <CardHeader>
              <CardTitle>Existing Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {tasks && tasks.length > 0 ? (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{task.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={safeTaskPriority(task.priority || 'medium') === 'high' ? 'destructive' : safeTaskPriority(task.priority || 'medium') === 'medium' ? 'default' : 'secondary'}>
                            {safeTaskPriority(task.priority || 'medium')}
                          </Badge>
                          <Badge variant="outline">{safeTaskStatus(task.status || 'pending').replace('_', ' ')}</Badge>
                          {task.due_date && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(task.due_date).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingTask({
                            id: task.id,
                            title: task.title,
                            description: task.description || '',
                            priority: safeTaskPriority(task.priority || 'medium'),
                            status: safeTaskStatus(task.status || 'pending'),
                            assigned_to: task.assigned_to || '',
                            project_id: task.project_id || '',
                            due_date: task.due_date || '',
                            category: task.category || 'development'
                          })}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this task?')) {
                              deleteTask.mutate(task.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No tasks created yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderPlus className="h-5 w-5" />
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    value={editingProject ? editingProject.name : projectForm.name}
                    onChange={(e) => editingProject
                      ? setEditingProject({...editingProject, name: e.target.value})
                      : setProjectForm({...projectForm, name: e.target.value})
                    }
                    placeholder="Enter project name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={editingProject ? editingProject.status : projectForm.status}
                    onValueChange={(value: 'active' | 'completed' | 'on_hold') => editingProject
                      ? setEditingProject({...editingProject, status: value})
                      : setProjectForm({...projectForm, status: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editingProject ? editingProject.description : projectForm.description}
                  onChange={(e) => editingProject
                    ? setEditingProject({...editingProject, description: e.target.value})
                    : setProjectForm({...projectForm, description: e.target.value})
                  }
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={editingProject ? handleUpdateProject : handleCreateProject}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingProject ? 'Update Project' : 'Create Project'}
                </Button>
                {editingProject && (
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingProject(null)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Projects List */}
          <Card>
            <CardHeader>
              <CardTitle>Existing Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {projects && projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                        <Badge className="mt-1" variant={safeProjectStatus(project.status || 'active') === 'active' ? 'default' : 'secondary'}>
                          {safeProjectStatus(project.status || 'active').replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingProject({
                            id: project.id,
                            name: project.name,
                            description: project.description || '',
                            status: safeProjectStatus(project.status || 'active')
                          })}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this project?')) {
                              deleteProject.mutate(project.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No projects created yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    value={editingMember ? editingMember.name : memberForm.name}
                    onChange={(e) => editingMember
                      ? setEditingMember({...editingMember, name: e.target.value})
                      : setMemberForm({...memberForm, name: e.target.value})
                    }
                    placeholder="Enter member name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    value={editingMember ? editingMember.email : memberForm.email}
                    onChange={(e) => editingMember
                      ? setEditingMember({...editingMember, email: e.target.value})
                      : setMemberForm({...memberForm, email: e.target.value})
                    }
                    placeholder="Enter member email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select
                    value={editingMember ? editingMember.role : memberForm.role}
                    onValueChange={(value: 'member' | 'manager' | 'admin') => editingMember
                      ? setEditingMember({...editingMember, role: value})
                      : setMemberForm({...memberForm, role: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={editingMember ? editingMember.status : memberForm.status}
                    onValueChange={(value: 'active' | 'inactive') => editingMember
                      ? setEditingMember({...editingMember, status: value})
                      : setMemberForm({...memberForm, status: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={editingMember ? handleUpdateTeamMember : handleCreateTeamMember}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingMember ? 'Update Member' : 'Add Member'}
                </Button>
                {editingMember && (
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingMember(null)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Team Members List */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              {teamMembers && teamMembers.length > 0 ? (
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{safeTeamRole(member.role || 'member')}</Badge>
                          <Badge variant={safeTeamStatus(member.status || 'active') === 'active' ? 'default' : 'secondary'}>
                            {safeTeamStatus(member.status || 'active')}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingMember({
                            id: member.id,
                            name: member.name,
                            email: member.email,
                            role: safeTeamRole(member.role || 'member'),
                            status: safeTeamStatus(member.status || 'active')
                          })}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to remove this team member?')) {
                              deleteTeamMember.mutate(member.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No team members added yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
