
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { Environment } from "@/types";
import OtpModal from "./OtpModal";

import {
  WorkType,
  getAuthUrl,
  validateOtpUrl,
} from "@/config/api";

const environments: { value: Environment; label: string }[] = [
  { value: "development", label: "Development" },
  { value: "staging", label: "Staging" },
  { value: "production", label: "Production" },
];

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [environment, setEnvironment] = useState<Environment>("development");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loginUrl = getAuthUrl(environment);

      const response = await axios.post(loginUrl, { username, password }, {headers: { 'Content-Type': 'application/json', 'System-id': 'CWINGS' }});
      if (response.data?.otpRequired) {
        toast.info("OTP sent to your email");
        setShowOtpModal(true);
      } else {
        localStorage.setItem("token", response.data.jwt);
        localStorage.setItem("env", environment);
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    setIsLoading(true);
    
    try {
      const verifyUrl = validateOtpUrl(environment);
      const response = await axios.post(verifyUrl, { username, otp });

      localStorage.setItem("token", response.data.jwt);
      localStorage.setItem("env", environment);
      toast.success("Login successful!");
      setShowOtpModal(false);
      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md shadow-lg border-accent/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Feature Guardian</CardTitle>
          <CardDescription className="text-center">
            Login to manage your feature flags and monitor services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="environment">Environment</Label>
              <Select value={environment} onValueChange={(value) => setEnvironment(value as Environment)}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/40">
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  {environments.map((env) => (
                    <SelectItem key={env.value} value={env.value}>
                      {env.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="submit" 
              className="w-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/20" 
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account? Contact your administrator
          </p>
        </CardFooter>
      </Card>

      <OtpModal 
        open={showOtpModal}
        onOpenChange={setShowOtpModal}
        onVerify={handleOtpVerify}
        isLoading={isLoading}
      />
    </>
  );
};

export default LoginForm;
