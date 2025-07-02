
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Zap, Users, Eye, Edit3 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useTasks } from '@/hooks/useTasks';
import { useTeamMembers } from '@/hooks/useTeam';

interface CollaborationData {
  user: string;
  action: string;
  timestamp: Date;
  location: string;
  avatar: string;
}

export const RealTimeCollaboration = () => {
  const [activeUsers, setActiveUsers] = useState<CollaborationData[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const { data: tasks } = useTasks();
  const { data: teamMembers } = useTeamMembers();

  useEffect(() => {
    const channel = supabase.channel('analytics-collaboration', {
      config: {
        presence: {
          key: `user-${Math.random().toString(36).substr(2, 9)}`,
        },
      },
    });

    // Track user presence
    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const users = Object.keys(newState).length;
        setOnlineCount(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        const newUser: CollaborationData = {
          user: 'User',
          action: 'joined analytics dashboard',
          timestamp: new Date(),
          location: 'Analytics Dashboard',
          avatar: newPresences[0]?.user_id?.slice(0, 2).toUpperCase() || 'AU'
        };
        setActiveUsers(prev => [newUser, ...prev.slice(0, 4)]);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        const leftUser: CollaborationData = {
          user: 'User',
          action: 'left analytics dashboard',
          timestamp: new Date(),
          location: 'Analytics Dashboard',
          avatar: leftPresences[0]?.user_id?.slice(0, 2).toUpperCase() || 'LU'
        };
        setActiveUsers(prev => [leftUser, ...prev.slice(0, 4)]);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: Math.random().toString(36).substr(2, 9),
            online_at: new Date().toISOString(),
          });
        }
      });

    // Listen for real-time database changes
    const tasksChannel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        (payload) => {
          const action = payload.eventType === 'INSERT' ? 'created new task' :
                        payload.eventType === 'UPDATE' ? 'updated task' :
                        payload.eventType === 'DELETE' ? 'deleted task' : 'modified task';
          
          const newActivity: CollaborationData = {
            user: 'Team Member',
            action: action,
            timestamp: new Date(),
            location: 'Task Management',
            avatar: 'TM'
          };
          setActiveUsers(prev => [newActivity, ...prev.slice(0, 4)]);
        }
      )
      .subscribe();

    const projectsChannel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        (payload) => {
          const action = payload.eventType === 'INSERT' ? 'created new project' :
                        payload.eventType === 'UPDATE' ? 'updated project' :
                        'modified project';
          
          const newActivity: CollaborationData = {
            user: 'Team Member',
            action: action,
            timestamp: new Date(),
            location: 'Project Management',
            avatar: 'PM'
          };
          setActiveUsers(prev => [newActivity, ...prev.slice(0, 4)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(projectsChannel);
    };
  }, []);

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-primary" />
          <span>Live Collaboration</span>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <Zap className="h-3 w-3 mr-1" />
            {onlineCount} Online
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeUsers.length > 0 ? (
          activeUsers.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-background/50">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {activity.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium truncate">{activity.user}</span>
                  <Edit3 className="h-3 w-3 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.timestamp.toLocaleTimeString()}</p>
              </div>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">No recent activity</p>
            <p className="text-xs mt-1">Activity will appear when team members interact with the system</p>
          </div>
        )}
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            Real-time activity tracking
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
