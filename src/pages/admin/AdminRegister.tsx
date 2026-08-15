// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import type { AdminRegisterFormData } from "../../types/admin.types";
// import { registerAdmin, loginAdmin } from "../../api/admin.api";
// import toast from "react-hot-toast";
// import { useAuth } from "../../context/AuthContext";

// function AdminRegister() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [serverError, setServerError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<AdminRegisterFormData>();

//   const { setAccessToken } = useAuth();
//   const navigate = useNavigate();

//   const onSubmit = async (data: AdminRegisterFormData) => {
//     try {
//       setIsLoading(true);
//       setServerError("");

//       //register admin
//       await registerAdmin(data);

//       const loginRespose = await loginAdmin({
//         email: data.email,
//         password: data.password,
//       });

//       //save access token
//       setAccessToken(loginRespose.accessToken);

//       toast.success("Account created! Redircting..."); // Redirect to login page navigate("/user-login");

//       navigate("/admin/login");
//     } catch (err: any) {
//       console.log("Registration failed", err);

//       const message =
//         err?.response?.data?.message ||
//         "Registration failed. Please try again.";
//       setServerError(message);
//       toast.error(message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
//       <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-border-default bg-surface-card shadow-sm">
//         <div className="grid min-h-155 grid-cols-1 md:grid-cols-2">
//           {/* Left Side */}
//           <div className="hidden md:flex flex-col justify-between bg-btn-primary p-8 text-btn-primary-text lg:p-12">
//             <div>
//               <p className="text-xl font-semibold tracking-wide">SHOPORA</p>

//               <div className="mt-20 max-w-sm">
//                 <p className="mb-4 text-sm uppercase tracking-[0.25em] text-accent">
//                   Admin Portal
//                 </p>

//                 <h1 className="font-serif text-4xl leading-tight lg:text-5xl">
//                   Build and manage your marketplace.
//                 </h1>

//                 <p className="mt-6 text-sm leading-7 text-gray-400">
//                   Create your administrator account and gain access to the tools
//                   needed to manage the Shopora platform.
//                 </p>
//               </div>
//             </div>

//             <p className="text-xs text-gray-500">
//               Secure administration portal
//             </p>
//           </div>

//           {/* Right Side */}
//           <div className="flex items-center px-5 py-10 sm:px-10 lg:px-14">
//             <div className="mx-auto w-full max-w-md">
//               {/* Mobile Logo */}
//               <div className="mb-10 md:hidden">
//                 <p className="text-xl font-semibold tracking-wide text-text-primary">
//                   SHOPORA
//                 </p>

//                 <div className="mt-6 h-px w-full bg-border-default" />
//               </div>

//               {/* Heading */}
//               <div className="mb-8">
//                 <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-accent">
//                   Admin
//                 </p>

//                 <h2 className="text-3xl font-semibold tracking-tight text-text-primary">
//                   Create account
//                 </h2>

//                 <p className="mt-2 text-sm text-text-secondary">
//                   Create your administrator account to continue.
//                 </p>
//               </div>

//               {/* Server Error */}
//               {serverError && (
//                 <div className="mb-5 rounded-lg border border-status-error/20 bg-status-error/5 px-4 py-3 text-sm text-status-error">
//                   {serverError}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//                 {/* Admin Name */}
//                 <div>
//                   <label
//                     htmlFor="adminName"
//                     className="mb-2 block text-sm font-medium text-text-primary"
//                   >
//                     Admin Name
//                   </label>

//                   <input
//                     id="adminName"
//                     type="text"
//                     autoComplete="name"
//                     placeholder="Enter admin name"
//                     {...register("adminName", {
//                       required: "Admin name is required",
//                       minLength: {
//                         value: 2,
//                         message: "Name must be at least 2 characters",
//                       },
//                     })}
//                     className={`w-full rounded-lg border bg-surface-card px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 ${
//                       errors.adminName
//                         ? "border-status-error focus:border-status-error"
//                         : "border-border-default focus:border-text-primary"
//                     }`}
//                   />

//                   {errors.adminName && (
//                     <p className="mt-1.5 text-xs text-status-error">
//                       {errors.adminName.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label
//                     htmlFor="email"
//                     className="mb-2 block text-sm font-medium text-text-primary"
//                   >
//                     Email Address
//                   </label>

//                   <input
//                     id="email"
//                     type="email"
//                     autoComplete="email"
//                     placeholder="Enter your email"
//                     {...register("email", {
//                       required: "Email is required",
//                       pattern: {
//                         value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                         message: "Please enter a valid email address",
//                       },
//                     })}
//                     className={`w-full rounded-lg border bg-surface-card px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 ${
//                       errors.email
//                         ? "border-status-error focus:border-status-error"
//                         : "border-border-default focus:border-text-primary"
//                     }`}
//                   />

//                   {errors.email && (
//                     <p className="mt-1.5 text-xs text-status-error">
//                       {errors.email.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Password */}
//                 <div>
//                   <label
//                     htmlFor="password"
//                     className="mb-2 block text-sm font-medium text-text-primary"
//                   >
//                     Password
//                   </label>

//                   <div className="relative">
//                     <input
//                       id="password"
//                       type={showPassword ? "text" : "password"}
//                       autoComplete="new-password"
//                       placeholder="Create a password"
//                       {...register("password", {
//                         required: "Password is required",
//                         minLength: {
//                           value: 6,
//                           message: "Password must be at least 6 characters",
//                         },
//                       })}
//                       className={`w-full rounded-lg border bg-surface-card px-4 py-3 pr-20 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 ${
//                         errors.password
//                           ? "border-status-error focus:border-status-error"
//                           : "border-border-default focus:border-text-primary"
//                       }`}
//                     />

//                     <button
//                       type="button"
//                       onClick={() => setShowPassword((prev) => !prev)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-text-secondary hover:text-text-primary"
//                     >
//                       {showPassword ? "Hide" : "Show"}
//                     </button>
//                   </div>

//                   {errors.password && (
//                     <p className="mt-1.5 text-xs text-status-error">
//                       {errors.password.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Submit */}
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="mt-2 flex min-h-11 w-full items-center justify-center rounded-lg bg-btn-primary px-5 py-3 text-sm font-medium text-btn-primary-text transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {isLoading ? "Creating account..." : "Create Account"}
//                 </button>
//               </form>

//               {/* Login */}
//               <p className="mt-7 text-center text-sm text-text-secondary">
//                 Already have an admin account?{" "}
//                 <button
//                   type="button"
//                   onClick={() => navigate("/admin-login")}
//                   className="font-medium text-text-primary underline underline-offset-4 transition hover:text-accent"
//                 >
//                   Sign In
//                 </button>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminRegister;
