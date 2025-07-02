
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SmartAutomationEngine } from "@/components/automation/SmartAutomationEngine";

const Automation = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="responsive-text-3xl font-bold ai-gradient-text">
            Smart Automation Engine
          </h1>
          <p className="responsive-text-base text-muted-foreground max-w-2xl mx-auto">
            Harness the power of AI to automate repetitive tasks, optimize workflows, and boost productivity 
            across your entire organization.
          </p>
        </div>
        
        <SmartAutomationEngine />
      </div>
    </DashboardLayout>
  );
};

export default Automation;
