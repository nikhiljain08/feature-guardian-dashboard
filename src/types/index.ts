
export type Environment = "development" | "staging" | "production";

export interface Microservice {
  id: string;
  name: string;
  status: "healthy" | "degraded" | "down";
  uptime: string;
  lastChecked: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  environments: Record<Environment, boolean>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "developer" | "viewer";
}
