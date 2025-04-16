import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (requireAuth && !session) {
          // If auth is required but no session exists, redirect to login
          navigate("/auth");
        } else if (!requireAuth && session) {
          // If auth is not required but session exists, redirect to dashboard
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (requireAuth) {
          navigate("/auth");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, requireAuth]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
