
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Brain,
  Save,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    // Profile Settings
    displayName: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    avatar: '',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    weeklyDigest: true,
    
    // Appearance Settings
    theme: 'system',
    accentColor: 'blue',
    compactMode: false,
    animationsEnabled: true,
    
    // AI Settings
    aiInsights: true,
    aiSuggestions: true,
    autoTaskPrioritization: true,
    smartScheduling: true,
    
    // Privacy Settings
    profileVisibility: 'team',
    activityTracking: true,
    dataSharing: false,
    
    // Advanced Settings
    autoSave: true,
    offlineMode: false,
    developerMode: false
  });

  const handleSave = () => {
    // Here you would typically save to a backend
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      // Reset to default values
      toast({
        title: "Settings reset",
        description: "All settings have been restored to default values.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-white/10 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-2">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Customize your experience and manage your preferences
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AI</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Advanced</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={settings.displayName}
                    onChange={(e) => setSettings(prev => ({ ...prev, displayName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    id="avatar"
                    value={settings.avatar}
                    onChange={(e) => setSettings(prev => ({ ...prev, avatar: e.target.value }))}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <Switch
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="taskReminders">Task Reminders</Label>
                  <Switch
                    id="taskReminders"
                    checked={settings.taskReminders}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, taskReminders: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                  <Switch
                    id="weeklyDigest"
                    checked={settings.weeklyDigest}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, weeklyDigest: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <Select
                    value={settings.accentColor}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, accentColor: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="compactMode">Compact Mode</Label>
                  <Switch
                    id="compactMode"
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, compactMode: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="animationsEnabled">Enable Animations</Label>
                  <Switch
                    id="animationsEnabled"
                    checked={settings.animationsEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, animationsEnabled: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>AI & Automation Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="aiInsights">AI Insights</Label>
                  <Switch
                    id="aiInsights"
                    checked={settings.aiInsights}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, aiInsights: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="aiSuggestions">AI Suggestions</Label>
                  <Switch
                    id="aiSuggestions"
                    checked={settings.aiSuggestions}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, aiSuggestions: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoTaskPrioritization">Auto Task Prioritization</Label>
                  <Switch
                    id="autoTaskPrioritization"
                    checked={settings.autoTaskPrioritization}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoTaskPrioritization: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="smartScheduling">Smart Scheduling</Label>
                  <Switch
                    id="smartScheduling"
                    checked={settings.smartScheduling}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smartScheduling: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select
                    value={settings.profileVisibility}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, profileVisibility: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="team">Team Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="activityTracking">Activity Tracking</Label>
                  <Switch
                    id="activityTracking"
                    checked={settings.activityTracking}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, activityTracking: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="dataSharing">Data Sharing for Analytics</Label>
                  <Switch
                    id="dataSharing"
                    checked={settings.dataSharing}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, dataSharing: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoSave">Auto Save</Label>
                  <Switch
                    id="autoSave"
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSave: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="offlineMode">Offline Mode</Label>
                  <Switch
                    id="offlineMode"
                    checked={settings.offlineMode}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, offlineMode: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="developerMode">Developer Mode</Label>
                  <Switch
                    id="developerMode"
                    checked={settings.developerMode}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, developerMode: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
            <Button onClick={handleSave} className="ai-gradient text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
