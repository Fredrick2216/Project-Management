
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  MessageSquare, 
  Video, 
  Share2, 
  Calendar,
  Send,
  Paperclip,
  Smile,
  Edit,
  Trash2,
  Phone,
  AlertCircle
} from "lucide-react";
import { useTeamMembers, useUpdateTeamMember, useDeleteTeamMember } from "@/hooks/useTeam";
import { useTeamMessages, useSendMessage } from "@/hooks/useTeamMessages";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const TeamCollaborationHub = () => {
  const [newMessage, setNewMessage] = useState("");
  const [editingMember, setEditingMember] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: teamMembers, isLoading: teamLoading, error: teamError } = useTeamMembers();
  const { data: messages, isLoading: messagesLoading, error: messagesError } = useTeamMessages();
  const sendMessage = useSendMessage();
  const updateTeamMember = useUpdateTeamMember();
  const deleteTeamMember = useDeleteTeamMember();

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    
    try {
      const senderName = user.email?.split('@')[0] || 'Unknown User';
      
      await sendMessage.mutateAsync({
        message: newMessage,
        senderName: senderName
      });
      
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMember = (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      deleteTeamMember.mutate(memberId);
    }
  };

  const handleStartCall = () => {
    toast({
      title: "Video Call",
      description: "Video call feature would integrate with WebRTC or a service like Zoom/Teams",
    });
  };

  const handleScreenShare = () => {
    toast({
      title: "Screen Share",
      description: "Screen sharing feature would use WebRTC Screen Capture API",
    });
  };

  const handleVoiceCall = () => {
    toast({
      title: "Voice Call",
      description: "Voice call feature coming soon!",
    });
  };

  const handleSchedule = () => {
    toast({
      title: "Schedule Meeting",
      description: "Meeting scheduling feature coming soon!",
    });
  };

  const handleAttachment = () => {
    toast({
      title: "File Attachment",
      description: "File attachment feature coming soon!",
    });
  };

  const handleEmoji = () => {
    toast({
      title: "Emoji Picker",
      description: "Emoji picker feature coming soon!",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "busy": return "bg-yellow-500";
      case "away": return "bg-gray-500";
      default: return "bg-gray-400";
    }
  };

  const activeMembers = teamMembers?.filter(member => member.status === 'active') || [];

  // Handle loading states
  if (teamLoading || messagesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Handle error states
  if (teamError || messagesError) {
    return (
      <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-100 mb-2">Error Loading Data</h3>
          <p className="text-slate-400">Failed to load team collaboration data. Please refresh the page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Team Status */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Team Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {teamMembers && teamMembers.length > 0 ? (
            teamMembers.slice(0, 8).map((member) => (
              <div key={member.id} className="flex items-center space-x-3 group">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback className="ai-gradient text-white text-xs">
                      {member.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Badge variant="outline" className="text-xs">
                    {member.status}
                  </Badge>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => setEditingMember(member.id)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 text-destructive"
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-slate-400 opacity-50" />
              <p className="text-slate-400">No team members found</p>
              <p className="text-xs text-slate-400 mt-2">Add team members to start collaborating</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2 pt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleStartCall}
            >
              <Video className="h-4 w-4 mr-2" />
              Start Call
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleScreenShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Screen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Team Chat */}
      <Card className="glass-card border-white/10 lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span>Team Chat</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">
                {activeMembers.length} online
              </Badge>
              <Button variant="outline" size="sm" onClick={handleVoiceCall}>
                <Phone className="h-4 w-4 mr-2" />
                Voice Call
              </Button>
              <Button variant="outline" size="sm" onClick={handleSchedule}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages */}
          <div className="h-64 overflow-y-auto space-y-3 p-3 bg-muted/20 rounded-lg">
            {messages && messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg.id} className="flex items-start space-x-3">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="ai-gradient text-white text-xs">
                      {msg.sender_name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{msg.sender_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{msg.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
          </div>
          
          {/* Message Input */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleAttachment}>
                  <Paperclip className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleEmoji}>
                  <Smile className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Button 
              onClick={handleSendMessage} 
              size="sm" 
              className="ai-gradient text-white"
              disabled={!newMessage.trim() || sendMessage.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
