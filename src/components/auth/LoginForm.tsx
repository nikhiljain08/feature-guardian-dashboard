
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { Environment } from "@/types";
import OtpModal from "./OtpModal";
import { TokenManager } from "@/utils/auth";

import {
  WorkType,
  getAuthUrl,
  validateOtpUrl,
  getAuthHeaders,
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
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loginUrl = getAuthUrl(environment);
      const headers = getAuthHeaders(environment);

      const response = await axios.post(loginUrl, { username, password }, { headers });
      
      console.log("Login response:", response.data);
      console.log("Available user properties:", Object.keys(response.data));
      
      // Check if OTP is required based on the response
      if (response.data?.message === "OTP send successfully") {
        toast.info("OTP sent to your email");
        setShowOtpModal(true);
      } else if (response.data?.jwt) {
        // Extract user data from the response
        const userData = {
          name: response.data.name || username,
          email: response.data.username || '',
          avatar: response.data.images?.md || ''
        };

        // Direct login success
        TokenManager.setTokens(response.data.jwt, environment, userData);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Failed to login. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    setIsLoading(true);
    
    try {
      const verifyUrl = validateOtpUrl(environment);
      const headers = getAuthHeaders(environment);
      
      // Use 'code' instead of 'otp' as per the API specification
      const response = await axios.post(verifyUrl, { username, code: otp }, { headers });

      console.log("OTP verification response:", response.data);

      if (response.data?.jwt) {
        TokenManager.setTokens(response.data.jwt, environment);
        toast.success("Login successful!");
        setShowOtpModal(false);
        navigate("/dashboard");
      } else {
        toast.error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      const errorMessage = error.response?.data?.message || "Invalid OTP. Please try again.";
      toast.error(errorMessage);
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/40 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
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
