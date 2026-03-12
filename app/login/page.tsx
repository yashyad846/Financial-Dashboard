"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "{}");
      
      if (!users[email]) {
        setError("Email not found. Please sign up first.");
        setIsLoading(false);
        return;
      }

      if (users[email].password !== password) {
        setError("Incorrect password");
        setIsLoading(false);
        return;
      }

      // Login successful
      const userData = {
        email,
        name: users[email].name,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setSuccess("Login successful! Redirecting...");
      
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("users") || "{}");
      
      if (users[email]) {
        setError("Email already registered. Please login instead.");
        setIsLoading(false);
        return;
      }

      // Create new user
      users[email] = {
        name,
        password, // In production, this should be hashed!
        createdAt: new Date().toISOString()
      };

      localStorage.setItem("users", JSON.stringify(users));

      // Auto-login after signup
      const userData = {
        email,
        name,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setSuccess("Account created! Redirecting...");
      
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (isSignup) {
      handleSignup(e);
    } else {
      handleLogin(e);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo Section */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">FinanceFlow</h1>
            <p className="text-sm text-muted-foreground">
              {isSignup ? "Create your account" : "Welcome back"}
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="border-border bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{isSignup ? "Sign Up" : "Sign In"}</CardTitle>
            <CardDescription>
              {isSignup ? "Create a new account to get started" : "Sign in to your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700 border border-red-200">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700 border border-green-200">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">{success}</p>
                </div>
              )}

              {/* Name Input (Signup only) */}
              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
                    disabled={isLoading}
                  />
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-border bg-secondary text-foreground placeholder:text-muted-foreground"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-border bg-secondary text-foreground placeholder:text-muted-foreground"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input (Signup only) */}
              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 border-border bg-secondary text-foreground placeholder:text-muted-foreground"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Remember Me & Forgot Password (Login only) */}
              {!isSignup && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border bg-secondary"
                      defaultChecked
                    />
                    <span className="text-xs text-muted-foreground">
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (isSignup ? "Creating Account..." : "Signing in...") : (isSignup ? "Create Account" : "Sign In")}
              </Button>
            </form>

            {/* Toggle Auth Mode */}
            <div className="mt-6 border-t border-border pt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setError("");
                    setSuccess("");
                  }}
                  disabled={isLoading}
                  className="text-primary hover:underline font-medium transition-colors disabled:opacity-50"
                >
                  {isSignup ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            © 2026 FinanceFlow. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Data stored locally in your browser. No external servers.
          </p>
        </div>
      </div>
    </div>
  );
}
