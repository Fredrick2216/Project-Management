
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Play, Pause, XCircle } from "lucide-react";

interface TaskStatusBadgeProps {
  status: string;
  size?: "default" | "sm" | "lg";
}

export const TaskStatusBadge = ({ status, size = "default" }: TaskStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return {
          variant: "default" as const,
          className: "bg-green-500/20 text-green-400 border-green-500/30",
          icon: CheckCircle2,
          label: "Completed"
        };
      case 'in_progress':
        return {
          variant: "default" as const,
          className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          icon: Play,
          label: "In Progress"
        };
      case 'pending':
        return {
          variant: "secondary" as const,
          className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
          icon: Clock,
          label: "Pending"
        };
      case 'paused':
        return {
          variant: "outline" as const,
          className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: Pause,
          label: "Paused"
        };
      case 'cancelled':
      case 'deleted':
        return {
          variant: "destructive" as const,
          className: "bg-red-500/20 text-red-400 border-red-500/30",
          icon: XCircle,
          label: "Cancelled"
        };
      default:
        return {
          variant: "secondary" as const,
          className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: Clock,
          label: status || "Unknown"
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;
  const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <Badge 
      variant={config.variant} 
      className={`${config.className} ${size === "sm" ? "text-xs px-2 py-1" : ""}`}
    >
      <Icon className={`${iconSize} mr-1`} />
      {config.label}
    </Badge>
  );
};
