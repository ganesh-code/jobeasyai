import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { AuthError } from "@supabase/supabase-js";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);

  const updateLastLogin = async (userId: string) => {
    const { error } = await supabase
      .from("user_preferences")
      .update({ last_login: new Date().toISOString() })
      .eq("user_id", userId);

    if (error && error.code !== "PGRST116") {
      console.error("Error updating last login:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignIn) {
        const {
          data: { user },
        } = await signIn(email, password);
        if (user) {
          await updateLastLogin(user.id);
        }
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        toast.success(
          "Account created successfully! Please check your email to verify your account."
        );
        navigate("/onboarding");
      }
    } catch (error) {
      if (error instanceof AuthError) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error;
    } catch (error) {
      if (error instanceof AuthError) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignIn ? "Sign In" : "Sign Up"}</CardTitle>
          <CardDescription>
            {isSignIn
              ? "Enter your credentials to access your account"
              : "Create a new account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : isSignIn ? "Sign In" : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            Continue with Google
          </Button>
          <Button
            variant="link"
            className="w-full"
            onClick={() => setIsSignIn(!isSignIn)}
          >
            {isSignIn
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
