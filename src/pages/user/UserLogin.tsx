import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { UserLoginFormData } from "../../types/user.types";
import { loginUser } from "../../api/user.api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";

function UserLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserLoginFormData>();

  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: UserLoginFormData) => {
    try {
      setIsLoading(true);
      setServerError("");

      const res = await loginUser(data);

      //save accesstoken
      setAccessToken(res.accessToken);

      // Success notification
      toast.success("Login successful! Redirecting...");

      navigate("/");
    } catch (err: any) {
      console.log("Login failed", err);

      const message =
        err?.response?.data?.message ||
        "Invalid email or password. Please try again.";
      // setServerError(message);
      toast.error(message);
      reset(); 

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center">
        <div className="grid w-full overflow-hidden rounded-2xl border border-border-default bg-surface-card shadow-sm md:grid-cols-2">
          {/* Left Side */}
          <div className="hidden bg-panel-dark p-8 text-white md:block lg:p-12">
            <div className="flex h-full min-h-150 flex-col justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-wide">SHOPORA</h1>

                <div className="mt-24">
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-accent">
                    Shopora
                  </p>

                  <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">
                    Your style,
                    <br />
                    your store.
                  </h2>

                  <p className="mt-6 max-w-sm text-sm leading-7 text-gray-400">
                    Discover fashion, explore new collections and shop
                    everything you love in one place.
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-500">Fashion marketplace</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center px-5 py-10 sm:px-10 lg:px-14">
            <div className="mx-auto w-full max-w-md">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mb-6 cursor-pointer flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary"
              >
                <FiArrowLeft size={18} />
                Back
              </button>

              {/* Mobile Logo */}
              <div className="mb-8 md:hidden">
                <h1 className="text-xl font-semibold tracking-wide text-text-primary">
                  SHOPORA
                </h1>
              </div>

              {/* Heading */}
              <div className="mb-8">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-accent">
                  Customer
                </p>

                <h2 className="text-3xl font-semibold text-text-primary">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-text-secondary">
                  Sign in to continue shopping.
                </p>
              </div>

              {/* Server Error */}
              {serverError && (
                <div className="mb-5 rounded-lg border border-status-error px-4 py-3 text-sm text-status-error">
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
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                    })}
                    className={`w-full rounded-lg border px-4 py-3 text-sm text-text-primary outline-none ${
                      errors.email
                        ? "border-status-error"
                        : "border-border-default focus:border-text-primary"
                    }`}
                  />

                  {errors.email && (
                    <p className="mt-1 text-xs text-status-error">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-medium text-text-secondary hover:text-accent"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                      className={`w-full rounded-lg border px-4 py-3 pr-16 text-sm text-text-primary outline-none ${
                        errors.password
                          ? "border-status-error"
                          : "border-border-default focus:border-text-primary"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-text-secondary hover:text-text-primary"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1 text-xs text-status-error">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-btn-primary px-5 py-3 text-sm font-medium text-btn-primary-text transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              {/* Register */}
              <p className="mt-6 text-center text-sm text-text-secondary">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/user-register")}
                  className="font-medium cursor-pointer text-text-primary underline underline-offset-4 hover:text-accent"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
