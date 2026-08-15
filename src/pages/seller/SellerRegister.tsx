import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { SellerRegisterFormData } from "../../types/seller.types";
import { loginSeller, registerSeller } from "../../api/seller.api";
import { useSellerAuth } from "../../context/SellerAuthContext";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";

function SellerRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SellerRegisterFormData>();

  const navigate = useNavigate();

  const { setSellerAccessToken } = useSellerAuth();

  const onSubmit = async (data: SellerRegisterFormData) => {
    try {
      setIsLoading(true);
      setServerError("");
      console.log(data);

      //register seller
      await registerSeller(data);

      //auto login
      const loginResponse = await loginSeller({
        email: data.email,
        password: data.password,
      });
      setSellerAccessToken(loginResponse.accessToken);

      toast.success("Account created! Redircting..."); // Redirect to login page navigate("/user-login");

      navigate("/seller/dashboard");
    } catch (err: any) {
      console.log("Registration failed", err);

      const message =
        err?.response?.data?.message ||
        "Registration failed. Please try again.";
      setServerError(message);
      toast.error(message);
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
            <div className="flex h-full min-h-162.5 flex-col justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-wide">SHOPORA</h1>

                <div className="mt-24">
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-accent">
                    Seller Portal
                  </p>

                  <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">
                    Start selling on Shopora.
                  </h2>

                  <p className="mt-6 max-w-sm text-sm leading-7 text-gray-400">
                    Create your seller account and manage your products, orders,
                    and store from one place.
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-500">Seller marketplace portal</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="px-5 py-10 sm:px-10 lg:px-14">
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
                  Create your store
                </h2>

                <p className="mt-2 text-sm text-text-secondary">
                  Register as a seller and start selling on Shopora.
                </p>
              </div>

              {/* Server Error */}
              {serverError && (
                <div className="mb-5 rounded-lg border border-status-error px-4 py-3 text-sm text-status-error">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Seller Name */}
                <div>
                  <label
                    htmlFor="sellerName"
                    className="mb-2 block text-sm font-medium text-text-primary"
                  >
                    Seller Name
                  </label>

                  <input
                    id="sellerName"
                    type="text"
                    placeholder="Enter seller name"
                    {...register("sellerName", {
                      required: "Name is required",
                    })}
                    className={`w-full rounded-lg border px-4 py-3 text-sm text-text-primary outline-none ${
                      errors.sellerName
                        ? "border-status-error"
                        : "border-border-default focus:border-text-primary"
                    }`}
                  />

                  {errors.sellerName && (
                    <p className="mt-1 text-xs text-status-error">
                      {errors.sellerName.message}
                    </p>
                  )}
                </div>

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
                    placeholder="Enter email"
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
                      placeholder="Enter password"
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

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="mb-2 block text-sm font-medium text-text-primary"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter phone number"
                    {...register("phoneNumber", {
                      required: "Phone is required",
                    })}
                    className={`w-full rounded-lg border px-4 py-3 text-sm text-text-primary outline-none ${
                      errors.phoneNumber
                        ? "border-status-error"
                        : "border-border-default focus:border-text-primary"
                    }`}
                  />

                  {errors.phoneNumber && (
                    <p className="mt-1 text-xs text-status-error">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/* Shop Name */}
                <div>
                  <label
                    htmlFor="shopName"
                    className="mb-2 block text-sm font-medium text-text-primary"
                  >
                    Shop Name
                  </label>

                  <input
                    id="shopName"
                    type="text"
                    placeholder="Enter shop name"
                    {...register("shopName", {
                      required: "Shop name is required",
                    })}
                    className={`w-full rounded-lg border px-4 py-3 text-sm text-text-primary outline-none ${
                      errors.shopName
                        ? "border-status-error"
                        : "border-border-default focus:border-text-primary"
                    }`}
                  />

                  {errors.shopName && (
                    <p className="mt-1 text-xs text-status-error">
                      {errors.shopName.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-btn-primary px-5 py-3 text-sm font-medium text-btn-primary-text transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Creating Account..." : "Create Seller Account"}
                </button>
              </form>

              {/* Login */}
              <p className="mt-6 text-center text-sm text-text-secondary">
                Already have a seller account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/seller-login")}
                  className="font-medium cursor-pointer text-text-primary underline underline-offset-4 hover:text-accent"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerRegister;
