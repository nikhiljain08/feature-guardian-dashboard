
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token") != "";
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/50 p-4">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/30 to-accent/30 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
      
      <div className="w-full flex flex-col items-center space-y-10">
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Feature Guardian</h1>
          <p className="text-muted-foreground">Monitor and control your feature flags across environments</p>
        </div>
        <LoginForm />
      </div>
      
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-accent/30 to-primary/30 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </div>
  );
};

export default Login;
