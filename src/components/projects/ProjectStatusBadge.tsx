
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Play, 
  CheckCircle, 
  Pause, 
  AlertCircle 
} from "lucide-react";

interface ProjectStatusBadgeProps {
  status: string;
  size?: "sm" | "default" | "lg";
}

export const ProjectStatusBadge = ({ status, size = "default" }: ProjectStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          icon: Play,
          label: "Active",
          className: "bg-green-500 text-white hover:bg-green-600",
        };
      case "completed":
        return {
          icon: CheckCircle,
          label: "Completed",
          className: "bg-blue-500 text-white hover:bg-blue-600",
        };
      case "paused":
        return {
          icon: Pause,
          label: "Paused",
          className: "bg-yellow-500 text-white hover:bg-yellow-600",
        };
      case "inactive":
        return {
          icon: Clock,
          label: "Inactive",
          className: "bg-gray-500 text-white hover:bg-gray-600",
        };
      default:
        return {
          icon: AlertCircle,
          label: "Unknown",
          className: "bg-gray-400 text-white",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} ${size === "sm" ? "text-xs" : "text-sm"}`}>
      <Icon className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} mr-1`} />
      {config.label}
    </Badge>
  );
};
