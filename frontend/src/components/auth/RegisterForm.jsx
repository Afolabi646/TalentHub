import { useState } from "react";
import {
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  BriefcaseBusiness,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  UserRound,
} from "lucide-react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "APPLICANT",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setMessageType("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errors = Object.entries(data)
          .map(([field, error]) => {
            const details = Array.isArray(error)
              ? error.join(", ")
              : typeof error === "object"
                ? JSON.stringify(error)
                : error;

            return `${field}: ${details}`;
          })
          .join(" | ");

        setMessage(errors || "Registration failed. Please try again.");
        setMessageType("error");
        return;
      }

      setMessage("Account created successfully! You can now sign in.");
      setMessageType("success");

      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "APPLICANT",
      });
    } catch {
      setMessage(
        "Could not connect to Django. Make sure your backend server is running.",
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name fields */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="first_name" className={labelClass}>
            First name
          </label>

          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First name"
              autoComplete="given-name"
              required
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="last_name" className={labelClass}>
            Last name
          </label>

          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last name"
              autoComplete="family-name"
              required
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="registerEmail" className={labelClass}>
          Email address
        </label>

        <div className="relative">
          <Mail
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            id="registerEmail"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
            className={inputClass}
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label htmlFor="registerPassword" className={labelClass}>
          Password
        </label>

        <div className="relative">
          <LockKeyhole
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="registerPassword"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            autoComplete="new-password"
            required
            minLength={8}
            className={`${inputClass} pr-12`}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <p className="mt-2 text-xs text-slate-400">
          Use at least 8 characters.
        </p>
      </div>

      {/* Account type */}
      <div>
        <label className={labelClass}>Choose your account type</label>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              setFormData((previousData) => ({
                ...previousData,
                role: "APPLICANT",
              }))
            }
            className={`rounded-xl border p-4 text-left transition ${
              formData.role === "APPLICANT"
                ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${
                formData.role === "APPLICANT"
                  ? "bg-blue-700 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <UserRound size={20} />
            </div>

            <p className="text-sm font-bold text-slate-800">Applicant</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Find jobs and internships
            </p>

            {formData.role === "APPLICANT" && (
              <CheckCircle2 size={17} className="mt-3 text-blue-700" />
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              setFormData((previousData) => ({
                ...previousData,
                role: "EMPLOYER",
              }))
            }
            className={`rounded-xl border p-4 text-left transition ${
              formData.role === "EMPLOYER"
                ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${
                formData.role === "EMPLOYER"
                  ? "bg-blue-700 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <BriefcaseBusiness size={20} />
            </div>

            <p className="text-sm font-bold text-slate-800">Employer</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Hire talented people
            </p>

            {formData.role === "EMPLOYER" && (
              <CheckCircle2 size={17} className="mt-3 text-blue-700" />
            )}
          </button>
        </div>
      </div>

      {/* Feedback */}
      {message && (
        <div
          role="status"
          aria-live="polite"
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
            messageType === "success"
              ? "border-green-100 bg-green-50 text-green-700"
              : "border-red-100 bg-red-50 text-red-700"
          }`}
        >
          {messageType === "success" ? (
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
          )}

          <p>{message}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <LoaderCircle size={19} className="animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Your Account"
        )}
      </button>

      <p className="text-center text-xs leading-5 text-slate-400">
        By creating an account, you can access opportunities and recruitment
        tools on AI TalentHub.
      </p>
    </form>
  );
}
