import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { UserRegisterFormData } from "../../types/user.types";
import { registerUser, loginUser } from "../../api/user.api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { FiArrowLeft } from "react-icons/fi";

function UserRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegisterFormData>();

  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: UserRegisterFormData) => {
    try {
      setIsLoading(true);
      setServerError("");
      console.log(data);

      //register user
      await registerUser(data);

      //auto login after registration
      const loginRespose = await loginUser({
        email: data.email,
        password: data.password,
      });

      //save access token
      setAccessToken(loginRespose.accessToken);

      toast.success("Account created! Redircting..."); // Redirect to login page navigate("/user-login");

      navigate("/");
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
                    Shopora
                  </p>

                  <h2 className="text-4xl font-semibold leading-tight lg:text-5xl">
                    Discover your
                    <br />
                    next favorite.
                  </h2>

                  <p className="mt-6 max-w-sm text-sm leading-7 text-gray-400">
                    Create your account and explore fashion from independent
                    sellers and brands.
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-500">Fashion marketplace</p>
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
                  Customer
                </p>

                <h2 className="text-3xl font-semibold text-text-primary">
                  Create your account
                </h2>

                <p className="mt-2 text-sm text-text-secondary">
                  Join Shopora and start exploring.
                </p>
              </div>

              {/* Server Error */}
              {serverError && (
                <div className="mb-5 rounded-lg border border-status-error px-4 py-3 text-sm text-status-error">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="userName"
                    className="mb-2 block text-sm font-medium text-text-primary"
                  >
                    Full Name
                  </label>

                  <input
                    id="userName"
                    type="text"
                    placeholder="Enter your name"
                    {...register("userName", {
                      required: "Name is required",
                    })}
                    className={`w-full rounded-lg border px-4 py-3 text-sm text-text-primary outline-none ${
                      errors.userName
                        ? "border-status-error"
                        : "border-border-default focus:border-text-primary"
                    }`}
                  />

                  {errors.userName && (
                    <p className="mt-1 text-xs text-status-error">
                      {errors.userName.message}
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
                      placeholder="Create a password"
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

                {/* Phone */}
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
                    {...register("phoneNumber")}
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-btn-primary px-5 py-3 text-sm font-medium text-btn-primary-text transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              {/* Login */}
              <p className="mt-6 text-center text-sm text-text-secondary">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/user-login")}
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

export default UserRegister;
