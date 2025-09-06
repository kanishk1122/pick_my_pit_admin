"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { loginUser } from "@/redux/slices/authSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      console.log("Already authenticated, redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    if (password.length > 20) {
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      console.log("Login successful, redirecting to dashboard...");
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      // Error is handled by the slice
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-zinc-800/50 backdrop-blur-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-zinc-100">Admin Login</h1>
            <p className="text-zinc-400 mt-2">
              Welcome back! Please login to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-zinc-300">
                Email
              </label>
              <InputText
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-zinc-300">
                Password
              </label>
              <Password
                id="password"
                value={password}
                onChange={(e) => {
                  if (e.target.value.length <= 20) {
                    setPassword(e.target.value);
                  }
                }}
                maxLength={20}
                toggleMask
                className="w-full"
                required
                feedback={false}
              />
            </div>

            {error && (
              <Message severity="error" text={error} className="w-full" />
            )}

            <Button
              type="submit"
              label={loading ? "Logging in..." : "Login"}
              disabled={loading}
              className="w-full"
            />
          </form>
        </Card>
      </div>
    </div>
  );
}
