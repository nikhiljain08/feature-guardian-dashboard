
import { Activity, AlertCircle, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Microservice } from "@/types";

interface ServiceHealthPanelProps {
  services: Microservice[];
}

const ServiceStatusIcon = ({ status }: { status: Microservice['status'] }) => {
  switch (status) {
    case "healthy":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "degraded":
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    case "down":
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    default:
      return null;
  }
};

const ServiceHealthPanel = ({ services }: ServiceHealthPanelProps) => {
  const healthyCount = services.filter(s => s.status === "healthy").length;
  const degradedCount = services.filter(s => s.status === "degraded").length;
  const downCount = services.filter(s => s.status === "down").length;
  
  // Calculate overall health percentage
  const healthPercentage = Math.round((healthyCount / services.length) * 100);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              {healthyCount} of {services.length} services healthy
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthyCount}</div>
            <p className="text-xs text-muted-foreground">Services operating normally</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Degraded</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{degradedCount}</div>
            <p className="text-xs text-muted-foreground">Services with performance issues</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Down</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{downCount}</div>
            <p className="text-xs text-muted-foreground">Services currently unavailable</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Microservices Status</CardTitle>
          <CardDescription>
            Monitor the real-time health of all your microservices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-3 rounded-md bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  <ServiceStatusIcon status={service.status} />
                  <div>
                    <p className="text-sm font-medium">{service.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Uptime: {service.uptime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Last checked: {service.lastChecked}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceHealthPanel;
