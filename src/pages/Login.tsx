
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  
  // Check if user is already logged in (could use token in localStorage in a real app)
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/50 p-4">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      <div className="w-full flex flex-col items-center space-y-10">
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-3xl font-bold tracking-tighter">Feature Guardian</h1>
          <p className="text-muted-foreground">Monitor and control your feature flags across environments</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
