import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { SellerLoginFormData } from "../../types/seller.types";
import { loginSeller } from "../../api/seller.api";
import { useSellerAuth } from "../../context/SellerAuthContext";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";

function SellerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SellerLoginFormData>();

  const { setSellerAccessToken } = useSellerAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: SellerLoginFormData) => {
    try {
      setIsLoading(true);
      setServerError("");

      const res = await loginSeller(data);

      //save accesstoken
      setSellerAccessToken(res.accessToken);

      // Success notification
      toast.success("Login successful! Redirecting...");

      navigate("/seller/dashboard");
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
                    Seller Portal
                  </p>

                  <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">
                    Welcome back, seller.
                  </h2>

                  <p className="mt-6 max-w-sm text-sm leading-7 text-gray-400">
                    Sign in to manage your products, orders and store from one
                    place.
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-500">Seller marketplace portal</p>
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
                  Seller
                </p>

                <h2 className="text-3xl font-semibold text-text-primary">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-text-secondary">
                  Sign in to manage your store.
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
                Don't have a seller account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/seller-register")}
                  className="font-medium cursor-pointer text-text-primary underline underline-offset-4 hover:text-accent"
                >
                  Become a Seller
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerLogin;
