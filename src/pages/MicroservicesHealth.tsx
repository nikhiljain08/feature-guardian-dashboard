
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Check, 
  AlertTriangle, 
  AlertCircle, 
  Server, 
  BarChart4, 
  Clock, 
  Activity, 
  RefreshCw
} from "lucide-react";
import { Environment, Microservice } from "@/types";

// Expanded mock data with more details
const mockServicesDetails: (Microservice & { 
  metrics?: { 
    responseTime: string; 
    requestsPerMinute: number; 
    errorRate: string;
  };
  deployedVersion?: string;
  lastDeployed?: string;
  incidents?: Array<{ 
    id: string; 
    date: string; 
    description: string; 
    resolved: boolean;
  }>;
})[] = [
  {
    id: "service-1",
    name: "User Authentication API",
    status: "healthy",
    uptime: "99.9% (30d)",
    lastChecked: "2 minutes ago",
    metrics: {
      responseTime: "120ms",
      requestsPerMinute: 350,
      errorRate: "0.01%"
    },
    deployedVersion: "v2.3.1",
    lastDeployed: "2 days ago",
    incidents: []
  },
  {
    id: "service-2",
    name: "Payment Processing Service",
    status: "healthy",
    uptime: "99.8% (30d)",
    lastChecked: "1 minute ago",
    metrics: {
      responseTime: "150ms",
      requestsPerMinute: 120,
      errorRate: "0.05%"
    },
    deployedVersion: "v1.9.0",
    lastDeployed: "5 days ago",
    incidents: []
  },
  {
    id: "service-3",
    name: "Notification Service",
    status: "degraded",
    uptime: "97.2% (30d)",
    lastChecked: "3 minutes ago",
    metrics: {
      responseTime: "450ms",
      requestsPerMinute: 80,
      errorRate: "2.3%"
    },
    deployedVersion: "v3.1.0",
    lastDeployed: "1 week ago",
    incidents: [
      {
        id: "inc-1",
        date: "2 hours ago",
        description: "Increased latency due to database connection pool exhaustion",
        resolved: false
      }
    ]
  },
  {
    id: "service-4",
    name: "Product Catalog API",
    status: "healthy",
    uptime: "99.9% (30d)",
    lastChecked: "2 minutes ago",
    metrics: {
      responseTime: "95ms",
      requestsPerMinute: 540,
      errorRate: "0.003%"
    },
    deployedVersion: "v4.2.1",
    lastDeployed: "3 days ago",
    incidents: []
  },
  {
    id: "service-5",
    name: "Analytics Engine",
    status: "down",
    uptime: "94.3% (30d)",
    lastChecked: "5 minutes ago",
    metrics: {
      responseTime: "N/A",
      requestsPerMinute: 0,
      errorRate: "100%"
    },
    deployedVersion: "v2.0.1",
    lastDeployed: "10 days ago",
    incidents: [
      {
        id: "inc-2",
        date: "35 minutes ago",
        description: "Service crashed due to memory leak",
        resolved: false
      }
    ]
  },
  {
    id: "service-6",
    name: "Search Service",
    status: "healthy",
    uptime: "99.7% (30d)",
    lastChecked: "1 minute ago",
    metrics: {
      responseTime: "110ms",
      requestsPerMinute: 220,
      errorRate: "0.02%"
    },
    deployedVersion: "v3.5.0",
    lastDeployed: "1 day ago",
    incidents: []
  },
];

const ServiceStatusIcon = ({ status }: { status: Microservice['status'] }) => {
  switch (status) {
    case "healthy":
      return <Check className="h-5 w-5 text-success" />;
    case "degraded":
      return <AlertTriangle className="h-5 w-5 text-warning" />;
    case "down":
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    default:
      return null;
  }
};

const ServiceStatusBadge = ({ status }: { status: Microservice['status'] }) => {
  switch (status) {
    case "healthy":
      return <Badge className="bg-success hover:bg-success/80">Healthy</Badge>;
    case "degraded":
      return <Badge className="bg-warning hover:bg-warning/80">Degraded</Badge>;
    case "down":
      return <Badge className="bg-destructive hover:bg-destructive/80">Down</Badge>;
    default:
      return null;
  }
};

const MicroservicesHealth = () => {
  const navigate = useNavigate();
  const [environment, setEnvironment] = useState<Environment>("production");
  const [services, setServices] = useState(mockServicesDetails);
  const [filter, setFilter] = useState<"all" | "issues">("all");

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token") != "";
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  const handleEnvironmentChange = (env: Environment) => {
    setEnvironment(env);
    
    // Simulate different service statuses based on environment
    if (env === "production") {
      setServices(mockServicesDetails.map(service => ({
        ...service,
        status: Math.random() > 0.9 ? "degraded" : "healthy",
      })));
    } else if (env === "staging") {
      setServices(mockServicesDetails.map(service => ({
        ...service,
        status: Math.random() > 0.8 ? "degraded" : Math.random() > 0.95 ? "down" : "healthy",
      })));
    } else {
      setServices(mockServicesDetails.map(service => ({
        ...service,
        status: Math.random() > 0.7 ? "degraded" : Math.random() > 0.9 ? "down" : "healthy",
      })));
    }
  };

  const filteredServices = filter === "all" 
    ? services 
    : services.filter(s => s.status === "degraded" || s.status === "down");
  
  const healthyCount = services.filter(s => s.status === "healthy").length;
  const degradedCount = services.filter(s => s.status === "degraded").length;
  const downCount = services.filter(s => s.status === "down").length;
  
  const refreshServices = () => {
    // In a real application, this would fetch fresh data
    handleEnvironmentChange(environment);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        environment={environment}
        onEnvironmentChange={handleEnvironmentChange}
      />
      <main className="flex-1 container py-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Microservices Health</h1>
            <button 
              onClick={refreshServices}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Status
            </button>
          </div>
          <p className="text-muted-foreground">
            Monitor and manage the health of all your microservices across environments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium flex items-center gap-2">
                <Check className="h-5 w-5 text-success" />
                Healthy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{healthyCount}</div>
              <p className="text-sm text-muted-foreground">Services operating normally</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Degraded
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{degradedCount}</div>
              <p className="text-sm text-muted-foreground">Services with performance issues</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Down
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{downCount}</div>
              <p className="text-sm text-muted-foreground">Services currently unavailable</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <Tabs defaultValue="all" className="w-[200px]" onValueChange={(value) => setFilter(value as "all" | "issues")}>
            <TabsList>
              <TabsTrigger value="all">All Services</TabsTrigger>
              <TabsTrigger value="issues">Issues Only</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="text-sm text-muted-foreground">
            Showing {filteredServices.length} of {services.length} services
          </div>
        </div>

        <div className="grid gap-4">
          {filteredServices.map((service) => (
            <Card key={service.id} className={`border-l-4 ${
              service.status === 'healthy' ? 'border-l-success' : 
              service.status === 'degraded' ? 'border-l-warning' : 'border-l-destructive'
            }`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <Server className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg font-medium">{service.name}</CardTitle>
                    <ServiceStatusBadge status={service.status} />
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Last checked: {service.lastChecked}
                  </div>
                </div>
                <CardDescription>
                  Version: {service.deployedVersion} • Deployed: {service.lastDeployed} • Uptime: {service.uptime}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Response Time</div>
                      <div className={`text-xl ${
                        service.status === 'degraded' ? 'text-warning' : 
                        service.status === 'down' ? 'text-destructive' : ''
                      }`}>
                        {service.metrics?.responseTime || 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <BarChart4 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Requests/min</div>
                      <div className="text-xl">
                        {service.metrics?.requestsPerMinute || 0}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Error Rate</div>
                      <div className={`text-xl ${
                        parseFloat(service.metrics?.errorRate || '0') > 1 ? 'text-warning' : 
                        parseFloat(service.metrics?.errorRate || '0') > 5 ? 'text-destructive' : ''
                      }`}>
                        {service.metrics?.errorRate || '0%'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {service.incidents && service.incidents.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Active Incidents</h4>
                      {service.incidents.map(incident => (
                        <div key={incident.id} className="bg-destructive/10 p-3 rounded-md">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm">{incident.date}</span>
                            {!incident.resolved && (
                              <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/20">
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{incident.description}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MicroservicesHealth;
