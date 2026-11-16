import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  MapPin,
  CalendarDays,
  Building2,
  Pencil,
  Trash2,
  Power,
  RotateCcw,
  X,
  Save,
  Plus,
  ClipboardList,
  Clock3,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api/opportunities/";

export default function MyOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchMyOpportunities() {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(`${API_URL}my/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to load your opportunities.");
    }

    setOpportunities(data.results ?? data);
  }

  useEffect(() => {
    async function load() {
      try {
        await fetchMyOpportunities();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function startEditing(opportunity) {
    setEditingId(opportunity.id);
    setMessage("");
    setError("");

    setForm({
      title: opportunity.title || "",
      organization: opportunity.organization || "",
      category: opportunity.category || "JOB",
      location: opportunity.location || "",
      deadline: opportunity.deadline || "",
      application_link: opportunity.application_link || "",
      description: opportunity.description || "",
      eligibility: opportunity.eligibility || "",
      how_to_apply: opportunity.how_to_apply || "",
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function deactivateOpportunity(opportunityId) {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this opportunity?",
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${API_URL}my/${opportunityId}/deactivate/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to deactivate the opportunity.");
      }

      await fetchMyOpportunities();
      setMessage("Opportunity deactivated successfully.");
    } catch (err) {
      setError(err.message);
    }
  }

  async function saveChanges(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${API_URL}my/${editingId}/edit/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        const detail =
          data.detail ||
          Object.entries(data)
            .map(
              ([field, errors]) =>
                `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`,
            )
            .join(" ");

        throw new Error(detail || "Could not save your changes.");
      }

      await fetchMyOpportunities();
      setEditingId(null);
      setMessage("Opportunity updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function reactivateOpportunity(opportunityId) {
    try {
      setError("");
      setMessage("");

      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${API_URL}my/${opportunityId}/reactivate/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to reactivate the opportunity.");
      }

      await fetchMyOpportunities();
      setMessage("Opportunity reactivated successfully.");
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteOpportunity(opportunityId) {
    const confirmed = window.confirm(
      "Permanently delete this inactive opportunity? This cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${API_URL}my/${opportunityId}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the opportunity.");
      }

      await fetchMyOpportunities();
      setMessage("Opportunity deleted successfully.");
    } catch (err) {
      setError(err.message);
    }
  }

  const activeCount = opportunities.filter(
    (opportunity) => opportunity.is_active,
  ).length;

  const inactiveCount = opportunities.length - activeCount;

  if (loading) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        <p className="text-sm font-medium text-slate-500">
          Loading your opportunities...
        </p>
      </div>
    );
  }

  if (error && opportunities.length === 0) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
        <AlertCircle className="mb-3 h-7 w-7 text-red-600" />
        <h3 className="font-semibold text-red-800">
          Unable to load opportunities
        </h3>
        <p className="mt-1 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-700">
            <BriefcaseBusiness size={16} />
            Recruitment Management
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Opportunities
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Manage your job postings, keep opportunities updated and control
            their publishing status.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm sm:self-auto">
          <ClipboardList size={18} className="text-blue-600" />
          {opportunities.length} Total Postings
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Total Opportunities
            </p>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
              <BriefcaseBusiness size={20} />
            </div>
          </div>
          <h3 className="mt-4 text-3xl font-bold text-slate-900">
            {opportunities.length}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            All your job and internship postings
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Active Postings
            </p>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <h3 className="mt-4 text-3xl font-bold text-slate-900">
            {activeCount}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Currently published opportunities
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Inactive Postings
            </p>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
              <Power size={20} />
            </div>
          </div>
          <h3 className="mt-4 text-3xl font-bold text-slate-900">
            {inactiveCount}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Paused or unpublished opportunities
          </p>
        </div>
      </div>

      {/* FEEDBACK MESSAGES */}
      {message && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          {message}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* OPPORTUNITIES LIST */}
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Your Job Postings
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              View and manage all your published opportunities.
            </p>
          </div>
        </div>

        {opportunities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <BriefcaseBusiness size={30} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No opportunities yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              You haven't posted any jobs or internships. Create your first
              opportunity to start attracting applicants.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                {editingId === opportunity.id ? (
                  /* EDIT FORM */
                  <form onSubmit={saveChanges} className="p-5 sm:p-7">
                    <div className="mb-6 flex items-center justify-between gap-3 border-b border-slate-100 pb-5">
                      <div>
                        <p className="text-sm font-medium text-blue-700">
                          Opportunity Management
                        </p>
                        <h3 className="mt-1 text-xl font-bold text-slate-900">
                          Edit Opportunity
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setError("");
                        }}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                        aria-label="Close editing form"
                      >
                        <X size={21} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Job or internship title *
                        </label>
                        <input
                          name="title"
                          value={form.title}
                          onChange={handleChange}
                          required
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Organization *
                        </label>
                        <input
                          name="organization"
                          value={form.organization}
                          onChange={handleChange}
                          required
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Category
                        </label>
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                        >
                          <option value="JOB">Job</option>
                          <option value="INTERNSHIP">Internship</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Location
                        </label>
                        <input
                          name="location"
                          value={form.location}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Application deadline
                        </label>
                        <input
                          type="date"
                          name="deadline"
                          value={form.deadline}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Application link
                        </label>
                        <input
                          type="url"
                          name="application_link"
                          value={form.application_link}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Description *
                        </label>
                        <textarea
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          rows={5}
                          required
                          className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Eligibility
                        </label>
                        <textarea
                          name="eligibility"
                          value={form.eligibility}
                          onChange={handleChange}
                          rows={3}
                          className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          How to apply
                        </label>
                        <textarea
                          name="how_to_apply"
                          value={form.how_to_apply}
                          onChange={handleChange}
                          rows={3}
                          className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                        />
                      </div>
                    </div>

                    <div className="mt-7 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Save size={17} />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setError("");
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        <X size={17} />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  /* OPPORTUNITY CARD */
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div className="flex gap-4">
                        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 sm:flex">
                          <BriefcaseBusiness size={23} />
                        </div>

                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                opportunity.is_active
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {opportunity.is_active ? "Active" : "Inactive"}
                            </span>

                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                              {opportunity.category === "INTERNSHIP"
                                ? "Internship"
                                : "Job"}
                            </span>
                          </div>

                          <h3 className="break-words text-lg font-bold text-slate-900 sm:text-xl">
                            {opportunity.title}
                          </h3>

                          <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-600">
                            <Building2 size={15} className="shrink-0" />
                            {opportunity.organization}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => startEditing(opportunity)}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-100 pt-4 text-sm text-slate-500">
                      <span className="flex items-center gap-2">
                        <MapPin size={16} className="text-slate-400" />
                        {opportunity.location || "Remote"}
                      </span>

                      <span className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-slate-400" />
                        {opportunity.deadline
                          ? `Deadline: ${opportunity.deadline}`
                          : "No deadline specified"}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                      {opportunity.is_active ? (
                        <button
                          type="button"
                          onClick={() => deactivateOpportunity(opportunity.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          <Power size={16} />
                          Deactivate
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              reactivateOpportunity(opportunity.id)
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <RotateCcw size={16} />
                            Reactivate
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteOpportunity(opportunity.id)}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </>
                      )}

                      {opportunity.application_link && (
                        <a
                          href={opportunity.application_link}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-auto inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                        >
                          View application link
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
