import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { AdminLoginFormData } from "../../types/admin.types";
import { loginAdmin } from "../../api/admin.api";
import { useAdminAuth } from "../../context/AdminAuthContext";
import toast from "react-hot-toast";

function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>();

  const { setAdminAccessToken } = useAdminAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      setIsLoading(true);
      setServerError("");

      const res = await loginAdmin(data);

      toast.success("Login successful! Redirecting...");

    setAdminAccessToken(res.accessToken);
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.log("Login failed", err);

      const message =
        err?.response?.data?.message ||
        "Invalid email or password. Please try again.";
      setServerError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-border-default bg-surface-card shadow-sm">
        <div className="grid min-h-150 grid-cols-1 md:grid-cols-2">
          {/* Left Side */}
          <div className="hidden md:flex flex-col justify-between bg-panel-dark p-8 text-white lg:p-12">
            <div>
              <p className="text-xl font-semibold tracking-wide">SHOPORA</p>

              <div className="mt-20 max-w-sm">
                <p className="mb-4 text-sm uppercase tracking-[0.25em] text-accent">
                  Admin Portal
                </p>

                <h1 className="font-serif text-4xl leading-tight lg:text-5xl">
                  Manage your marketplace with confidence.
                </h1>

                <p className="mt-6 text-sm leading-7 text-gray-400">
                  Manage products, sellers, customers, orders and everything
                  that keeps your marketplace running.
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Secure administration portal
            </p>
          </div>

          {/* Right Side */}
          <div className="flex items-center px-5 py-10 sm:px-10 lg:px-14">
            <div className="mx-auto w-full max-w-md">
              {/* Mobile Logo */}
              <div className="mb-10 md:hidden">
                <p className="text-xl font-semibold tracking-wide text-text-primary">
                  SHOPORA
                </p>

                <div className="mt-6 h-px w-full bg-border-default" />
              </div>

              {/* Heading */}
              <div className="mb-8">
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-accent">
                  Admin
                </p>

                <h2 className="text-3xl font-semibold tracking-tight text-text-primary">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-text-secondary">
                  Sign in to access your admin dashboard.
                </p>
              </div>

              {/* Server Error */}
              {serverError && (
                <div className="mb-5 rounded-lg border border-status-error/20 bg-status-error/5 px-4 py-3 text-sm text-status-error">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-text-primary"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    className={`w-full rounded-lg border bg-surface-card px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 ${
                      errors.email
                        ? "border-status-error focus:border-status-error"
                        : "border-border-default focus:border-text-primary"
                    }`}
                  />

                  {errors.email && (
                    <p className="mt-1.5 text-xs text-status-error">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-text-primary"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                      className={`w-full rounded-lg border bg-surface-card px-4 py-3 pr-20 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 ${
                        errors.password
                          ? "border-status-error focus:border-status-error"
                          : "border-border-default focus:border-text-primary"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-text-secondary hover:text-text-primary"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1.5 text-xs text-status-error">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 flex min-h-11 w-full items-center justify-center rounded-lg bg-btn-primary px-5 py-3 text-sm font-medium text-btn-primary-text transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              {/* Register
              <p className="mt-7 text-center text-sm text-text-secondary">
                Don't have an admin account?{" "}
                <button
                  type="button"
                  className="font-medium text-text-primary underline underline-offset-4 transition hover:text-accent"
                >
                  Register
                </button>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
