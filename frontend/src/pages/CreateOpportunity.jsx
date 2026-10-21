import { useState } from "react";

export default function CreateOpportunity({ onBack, onCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    category: "JOB",
    location: "",
    deadline: "",
    application_link: "",
    description: "",
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
    "w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        ← Back to Dashboard
      </button>

      <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-800">
          Create an Opportunity
        </h2>

        <p className="mt-2 mb-6 text-slate-600">
          Publish a job or internship for applicants to discover.
        </p>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {success && (
          <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Opportunity Title *
            </label>
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
            <label className="mb-2 block font-medium text-slate-700">
              Organization *
            </label>
            <input
              className={inputClass}
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Company or organization name"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Category *
            </label>
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
            <label className="mb-2 block font-medium text-slate-700">
              Location *
            </label>
            <input
              className={inputClass}
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Remote or Lagos, Nigeria"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Application Deadline
            </label>
            <input
              className={inputClass}
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Application Link
            </label>
            <input
              className={inputClass}
              type="url"
              name="application_link"
              value={formData.application_link}
              onChange={handleChange}
              placeholder="https://example.com/apply"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Description *
            </label>
            <textarea
              className={inputClass}
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the opportunity and responsibilities"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Eligibility
            </label>
            <textarea
              className={inputClass}
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              rows={3}
              placeholder="Who can apply?"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              How to Apply
            </label>
            <textarea
              className={inputClass}
              name="how_to_apply"
              value={formData.how_to_apply}
              onChange={handleChange}
              rows={3}
              placeholder="Explain the application process"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Publishing..." : "Publish Opportunity"}
          </button>
        </form>
      </div>
    </div>
  );
}
