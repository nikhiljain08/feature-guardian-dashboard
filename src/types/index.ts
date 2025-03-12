
export type Environment = "development" | "staging" | "production";

export interface Microservice {
  id: string;
  name: string;
  status: "healthy" | "degraded" | "down";
  uptime: string;
  lastChecked: string;
}

export type FlagType = "release" | "experiment" | "ops" | "permission";
export type Country = 
  | "AE" 
  | "QA" 
  | "SA" 
  | "PK" 
  | "KW" 
  | "EG" 
  | "JO" 
  | "OM" 
  | "BH" 
  | "LB" 
  | "KE" 
  | "GE" 
  | "UZ";

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  environments: Record<Environment, boolean>;
  type?: FlagType;
  countries?: Country[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "developer" | "viewer";
}
