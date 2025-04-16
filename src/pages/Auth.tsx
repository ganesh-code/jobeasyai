import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { AuthError } from "@supabase/supabase-js";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignIn) {
        await signIn(email, password);
        navigate("/dashboard");
      } else {
        await signUp(email, password);
        toast({
          title: "Success!",
          description: "Please check your email to confirm your account.",
        });
        navigate("/onboarding");
      }
    } catch (error) {
      const authError = error as AuthError;

      // Check for specific error messages
      if (authError.message.includes("Invalid login credentials")) {
        toast({
          variant: "destructive",
          title: "Email not registered",
          description:
            "This email is not registered with us. Please try signing up instead.",
          action: (
            <Button
              variant="ghost"
              onClick={() => setIsSignIn(false)}
              className="text-primary hover:text-primary"
            >
              Sign Up
            </Button>
          ),
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: authError.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error;
    } catch (error) {
      const authError = error as AuthError;
      toast({
        variant: "destructive",
        title: "Error",
        description: authError.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            JobEasyAI
          </CardTitle>
          <CardDescription className="text-lg">
            {isSignIn ? "Sign in to your account" : "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : isSignIn ? "Sign In" : "Sign Up"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              Continue with Google
            </Button>
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-primary"
                onClick={() => setIsSignIn(!isSignIn)}
              >
                {isSignIn
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
