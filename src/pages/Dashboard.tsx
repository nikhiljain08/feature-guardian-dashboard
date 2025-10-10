
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ServiceHealthPanel from "@/components/dashboard/ServiceHealthPanel";
import FeatureFlags from "@/components/dashboard/FeatureFlags";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Flag, Server } from "lucide-react";
import { Environment, FeatureFlag, Microservice } from "@/types";
import { TokenManager } from "@/utils/auth";

// Mock data for services
const mockServices: Microservice[] = [
  {
    id: "service-1",
    name: "User Authentication API",
    status: "healthy",
    uptime: "99.9% (30d)",
    lastChecked: "2 minutes ago",
  },
  {
    id: "service-2",
    name: "Payment Processing Service",
    status: "healthy",
    uptime: "99.8% (30d)",
    lastChecked: "1 minute ago",
  },
  {
    id: "service-3",
    name: "Notification Service",
    status: "degraded",
    uptime: "97.2% (30d)",
    lastChecked: "3 minutes ago",
  },
  {
    id: "service-4",
    name: "Product Catalog API",
    status: "healthy",
    uptime: "99.9% (30d)",
    lastChecked: "2 minutes ago",
  },
  {
    id: "service-5",
    name: "Analytics Engine",
    status: "down",
    uptime: "94.3% (30d)",
    lastChecked: "5 minutes ago",
  },
  {
    id: "service-6",
    name: "Search Service",
    status: "healthy",
    uptime: "99.7% (30d)",
    lastChecked: "1 minute ago",
  },
];

// Mock data for feature flags
const mockFlags: FeatureFlag[] = [
  {
    id: "flag-1",
    name: "new-checkout-flow",
    description: "Enable the new streamlined checkout experience",
    enabled: true,
    type:"OTP",
    value: true,
    valueType: "BOOLEAN",
  },
  {
    id: "flag-2",
    name: "dark-mode",
    description: "Enable dark mode theme across the application",
    enabled: true,
    type:"OTP",
    value: true,
    valueType: "BOOLEAN",
  },
  {
    id: "flag-3",
    name: "analytics-v2",
    description: "Use the new analytics tracking system",
    enabled: false,
    type:"OTP",
    value: true,
    valueType: "BOOLEAN",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Microservice[]>(mockServices);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(mockFlags);
  
  // Get environment from TokenManager
  const environment = (TokenManager.getEnvironment() as Environment) || "development";

  // Check if user is logged in
  useEffect(() => {
    if (!TokenManager.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // Simulate different service statuses based on environment
  useEffect(() => {
    if (environment === "production") {
      setServices(mockServices.map(service => ({
        ...service,
        status: Math.random() > 0.9 ? "degraded" : "healthy",
      })));
    } else if (environment === "staging") {
      setServices(mockServices.map(service => ({
        ...service,
        status: Math.random() > 0.8 ? "degraded" : Math.random() > 0.95 ? "down" : "healthy",
      })));
    } else {
      setServices(mockServices.map(service => ({
        ...service,
        status: Math.random() > 0.7 ? "degraded" : Math.random() > 0.9 ? "down" : "healthy",
      })));
    }
  }, [environment]);

  const handleUpdateFlag = (updatedFlag: FeatureFlag) => {
    const existingIndex = featureFlags.findIndex(flag => flag.id === updatedFlag.id);
    
    if (existingIndex > -1) {
      const updatedFlags = [...featureFlags];
      updatedFlags[existingIndex] = updatedFlag;
      setFeatureFlags(updatedFlags);
    } else {
      setFeatureFlags([...featureFlags, updatedFlag]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        environment={environment}
      />
      <main className="flex-1 container py-6 space-y-8">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Service Health</h2>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate("/microservices")}
            >
              <Server className="h-4 w-4" />
              View All Services
            </Button>
          </div>
          <ServiceHealthPanel services={services} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
