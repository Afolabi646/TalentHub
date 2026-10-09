import { useEffect, useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import Dashboard from "./dashboard/Dashboard";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      let accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken) {
        setCheckingAuth(false);
        return;
      }

      try {
        let response = await fetch("http://127.0.0.1:8000/api/me/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // If the access token expired, request a new one.
        if (response.status === 401 && refreshToken) {
          const refreshResponse = await fetch(
            "http://127.0.0.1:8000/api/token/refresh/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                refresh: refreshToken,
              }),
            },
          );

          if (refreshResponse.ok) {
            const tokenData = await refreshResponse.json();
            accessToken = tokenData.access;

            localStorage.setItem("accessToken", accessToken);

            response = await fetch("http://127.0.0.1:8000/api/me/", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
          } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }
        }

        if (response.ok) {
          const profile = await response.json();
          setUser(profile);
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      } catch {
        // Keep saved tokens if the backend is temporarily unavailable.
      } finally {
        setCheckingAuth(false);
      }
    }

    checkAuth();
  }, []);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">Checking your session...</p>
      </div>
    );
  }

  // Show the dashboard after successful login
  if (user) {
    function handleLogout() {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setIsLogin(true);
    }

    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-blue-600">
            AI TalentHub
          </h1>

          <h2 className="text-2xl font-semibold text-slate-800">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {isLogin
              ? "Sign in to continue to your account."
              : "Join AI TalentHub and discover new opportunities."}
          </p>
        </div>

        {isLogin ? <LoginForm onLogin={setUser} /> : <RegisterForm />}

        <p className="mt-6 text-center text-sm text-slate-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            {isLogin ? "Register" : "Sign in"}
          </button>
        </p>
      </div>
    </main>
  );
}
