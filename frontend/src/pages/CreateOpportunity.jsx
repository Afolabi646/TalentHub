import { useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  MapPin,
  CalendarDays,
  Link2,
  FileText,
  Users,
  ListChecks,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

export default function CreateOpportunity({ onBack, onCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    category: "JOB",
    location: "",
    deadline: "",
    application_link: "",
    description: "",
    required_skills: "",
    eligibility: "",
    how_to_apply: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("Please log in again before posting an opportunity.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/opportunities/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          typeof data === "object"
            ? Object.entries(data)
                .map(([field, messages]) => {
                  const detail = Array.isArray(messages)
                    ? messages.join(" ")
                    : typeof messages === "string"
                      ? messages
                      : JSON.stringify(messages);

                  return `${field}: ${detail}`;
                })
                .join(" ")
            : "Could not create the opportunity.";

        throw new Error(message || "Could not create the opportunity.");
      }

      setSuccess("Opportunity created successfully!");

      setFormData({
        title: "",
        organization: "",
        category: "JOB",
        location: "",
        deadline: "",
        application_link: "",
        description: "",
        required_skills: "",
        eligibility: "",
        how_to_apply: "",
      });

      if (onCreated) {
        onCreated(data);
      }
    } catch (error) {
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-10">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
      >
        <ArrowLeft size={17} />
        Back to Dashboard
      </button>

      {/* Page header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#101d3a] via-[#172e57] to-[#244f91] p-7 text-white shadow-lg sm:p-10">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -right-4 -top-8 h-40 w-40 rounded-full border border-white/10" />

        <div className="relative z-10 max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
            <Sparkles size={14} />
            EMPLOYER WORKSPACE
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Create an Opportunity
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
            Share your next job or internship opportunity and connect with
            talented applicants who are ready to make an impact.
          </p>
        </div>

        <div className="relative z-10 mt-7 flex flex-wrap gap-4 text-xs font-medium text-blue-100 sm:text-sm">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={15} />
            Reach qualified candidates
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={15} />
            Manage applications easily
          </span>
        </div>
      </div>

      {/* Form container */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* Form heading */}
        <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <BriefcaseBusiness size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Opportunity Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Complete the details below to publish your opportunity.
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Fields marked with * are required.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-6 sm:p-8">
          {/* Feedback messages */}
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
              <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
              <p>{success}</p>
            </div>
          )}

          {/* Section 1 */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <BriefcaseBusiness size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Basic Details</h3>
                <p className="text-xs text-slate-500">
                  Tell applicants what you are offering.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Opportunity Title *</label>
                <input
                  className={inputClass}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Junior Python Developer"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Organization *</label>
                <div className="relative">
                  <Building2
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    className={`${inputClass} pl-11`}
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Company name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Category *</label>
                <select
                  className={inputClass}
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="JOB">Job</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Location *</label>
                <div className="relative">
                  <MapPin
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    className={`${inputClass} pl-11`}
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Remote or Lagos, Nigeria"
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Application Deadline</label>
                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    className={`${inputClass} pl-11`}
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Section 2 */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <FileText size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  Opportunity Description
                </h3>
                <p className="text-xs text-slate-500">
                  Explain the role and what applicants should know.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Description *</label>
                <textarea
                  className={`${inputClass} resize-y`}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the opportunity, responsibilities, and expectations..."
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Eligibility</label>
                <textarea
                  className={`${inputClass} resize-y`}
                  name="eligibility"
                  value={formData.eligibility}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe the qualifications or requirements for applicants..."
                />
              </div>

              <div>
                <label className={labelClass}>Required Skills</label>
                <textarea
                  className={`${inputClass} resize-y`}
                  name="required_skills"
                  value={formData.required_skills}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. Python, Django, REST API, PostgreSQL"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Enter the specific skills applicants need, separated by
                  commas. These skills will be used to calculate applicant skill
                  matches.
                </p>
              </div>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Section 3 */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <Users size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  Application Instructions
                </h3>
                <p className="text-xs text-slate-500">
                  Guide interested applicants on the next steps.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Application Link</label>
                <div className="relative">
                  <Link2
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    className={`${inputClass} pl-11`}
                    type="url"
                    name="application_link"
                    value={formData.application_link}
                    onChange={handleChange}
                    placeholder="https://example.com/apply"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>How to Apply</label>
                <textarea
                  className={`${inputClass} resize-y`}
                  name="how_to_apply"
                  value={formData.how_to_apply}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Explain the application process and any additional instructions..."
                />
              </div>
            </div>
          </section>

          {/* Submit section */}
          <div className="border-t border-slate-100 pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Ready to publish?
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Review your information before publishing.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send size={17} />
                    Publish Opportunity
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Helpful note */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
        <ListChecks size={19} className="mt-0.5 shrink-0 text-blue-700" />
        <p className="text-xs leading-5 text-blue-900">
          <strong>Helpful tip:</strong> Clear descriptions, eligibility
          requirements, and application instructions help applicants understand
          your opportunity and submit better applications.
        </p>
      </div>
    </div>
  );
}
