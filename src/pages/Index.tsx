
import { Button } from "@/components/ui/button";
import { Brain, Users, BarChart3, Zap, CheckCircle, Clock, TrendingUp, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold ai-gradient-text">TaskAI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="ai-gradient text-white font-medium">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="ai-gradient-text">AI-Powered</span>
              <br />
              Task Management
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Transform your team's productivity with intelligent task prioritization, 
              deadline management, and AI-driven insights that keep everyone focused on what matters most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button size="lg" className="ai-gradient text-white font-medium px-8 py-4 text-lg">
                  Start Free Trial
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Hero Visual */}
          <div className="mt-16 animate-float">
            <div className="relative max-w-4xl mx-auto">
              <div className="glass-card rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-ai-danger animate-pulse-slow"></div>
                      <span className="text-sm text-muted-foreground">High Priority</span>
                    </div>
                    <div className="bg-card/50 rounded-lg p-4 border border-white/10">
                      <h4 className="font-medium text-sm mb-2">Fix critical bug in payment system</h4>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Due: Today</span>
                        <span className="text-ai-danger">●</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-ai-warning animate-pulse-slow"></div>
                      <span className="text-sm text-muted-foreground">Medium Priority</span>
                    </div>
                    <div className="bg-card/50 rounded-lg p-4 border border-white/10">
                      <h4 className="font-medium text-sm mb-2">Update user documentation</h4>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Due: Tomorrow</span>
                        <span className="text-ai-warning">●</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-ai-success animate-pulse-slow"></div>
                      <span className="text-sm text-muted-foreground">Low Priority</span>
                    </div>
                    <div className="bg-card/50 rounded-lg p-4 border border-white/10">
                      <h4 className="font-medium text-sm mb-2">Research new design trends</h4>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Due: Next week</span>
                        <span className="text-ai-success">●</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Brain className="h-4 w-4 text-primary" />
                  <span>AI automatically sorted by urgency and impact</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="ai-gradient-text">Intelligent Features</span> for Modern Teams
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with intuitive design 
              to revolutionize how teams manage tasks and priorities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-all animate-slide-in">
              <div className="ai-gradient w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Priority Sorting</h3>
              <p className="text-muted-foreground">
                Advanced algorithms analyze deadlines, dependencies, and team capacity to automatically prioritize tasks for maximum productivity.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-all animate-slide-in">
              <div className="ai-gradient w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Seamless collaboration tools with real-time updates, comments, and file sharing to keep everyone aligned and informed.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-all animate-slide-in">
              <div className="ai-gradient w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics Dashboard</h3>
              <p className="text-muted-foreground">
                Comprehensive insights into team performance, task completion rates, and productivity trends with beautiful visualizations.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-all animate-slide-in">
              <div className="ai-gradient w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Deadlines</h3>
              <p className="text-muted-foreground">
                Intelligent deadline tracking with predictive alerts and automatic rescheduling suggestions based on team workload.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-all animate-slide-in">
              <div className="ai-gradient w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Performance Insights</h3>
              <p className="text-muted-foreground">
                Track individual and team performance metrics with AI-powered recommendations for continuous improvement.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-all animate-slide-in">
              <div className="ai-gradient w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Enterprise Security</h3>
              <p className="text-muted-foreground">
                Bank-level security with end-to-end encryption, role-based access control, and compliance with industry standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Ready to <span className="ai-gradient-text">Transform</span> Your Team's Productivity?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of teams already using TaskAI to streamline their workflow and achieve their goals faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button size="lg" className="ai-gradient text-white font-medium px-8 py-4 text-lg">
                  Start Your Free Trial
                  <CheckCircle className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">No credit card required • 14-day free trial</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold ai-gradient-text">TaskAI</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact Us</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 TaskAI. All rights reserved. Built with ❤️ for productive teams.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
