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
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowUpRight,
  Layers3,
  Clock3,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api/opportunities/";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50";

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
                `${field}: ${
                  Array.isArray(errors) ? errors.join(", ") : errors
                }`,
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
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />
        <p className="text-sm font-medium text-slate-500">
          Loading your opportunities...
        </p>
      </div>
    );
  }

  if (error && opportunities.length === 0) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-7">
        <AlertCircle className="mb-3 h-8 w-8 text-red-600" />
        <h3 className="font-bold text-red-900">Unable to load opportunities</h3>
        <p className="mt-2 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Opportunities",
      value: opportunities.length,
      description: "All your job and internship postings",
      icon: BriefcaseBusiness,
      iconStyle: "bg-blue-50 text-blue-700",
      accent: "border-l-blue-600",
    },
    {
      title: "Active Postings",
      value: activeCount,
      description: "Currently published opportunities",
      icon: CheckCircle2,
      iconStyle: "bg-emerald-50 text-emerald-700",
      accent: "border-l-emerald-500",
    },
    {
      title: "Inactive Postings",
      value: inactiveCount,
      description: "Paused or unpublished opportunities",
      icon: Power,
      iconStyle: "bg-amber-50 text-amber-700",
      accent: "border-l-amber-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 p-6 text-white shadow-lg sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[35px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-32 right-32 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
              <BriefcaseBusiness size={14} />
              RECRUITMENT MANAGEMENT
            </div>

            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              My Opportunities
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-blue-100/80 sm:text-base">
              Manage your job postings, monitor their publishing status and keep
              your recruitment opportunities up to date.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
            <div className="rounded-xl bg-white/10 p-2.5">
              <ClipboardList size={23} />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {opportunities.length}
              </p>
              <p className="text-xs font-medium text-blue-100">
                Total Postings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className={`rounded-2xl border border-slate-200 border-l-4 ${stat.accent} bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <h3 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                    {stat.value}
                  </h3>
                </div>

                <div className={`rounded-xl p-3 ${stat.iconStyle}`}>
                  <Icon size={22} />
                </div>
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                {stat.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* FEEDBACK MESSAGES */}
      {message && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          <p>{message}</p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* OPPORTUNITY LIST SECTION */}
      <section>
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
              <Layers3 size={16} />
              YOUR RECRUITMENT
            </div>

            <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Your Job Postings
            </h3>

            <p className="mt-1.5 text-sm text-slate-500">
              Review and manage all your job and internship opportunities.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            {opportunities.length}{" "}
            {opportunities.length === 1 ? "Opportunity" : "Opportunities"}
          </div>
        </div>

        {/* EMPTY STATE */}
        {opportunities.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-700">
              <BriefcaseBusiness size={34} />
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-900">
              No opportunities yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven't posted any jobs or internships. Create your first
              opportunity to start attracting qualified applicants.
            </p>
          </div>
        ) : (
          /* OPPORTUNITY CARDS */
          <div className="space-y-5">
            {opportunities.map((opportunity) => (
              <article
                key={opportunity.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:border-blue-200 hover:shadow-lg"
              >
                {editingId === opportunity.id ? (
                  /* EDIT FORM */
                  <form onSubmit={saveChanges} className="p-5 sm:p-8">
                    <div className="mb-7 flex items-center justify-between gap-3 border-b border-slate-100 pb-5">
                      <div>
                        <div className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                          Opportunity Management
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">
                          Edit Opportunity
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Update your posting information below.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setError("");
                        }}
                        className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        aria-label="Close editing form"
                      >
                        <X size={20} />
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
                          className={inputClass}
                          placeholder="e.g. Frontend Developer"
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
                          className={inputClass}
                          placeholder="Organization name"
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
                          className={inputClass}
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
                          className={inputClass}
                          placeholder="e.g. Lagos / Remote"
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
                          className={inputClass}
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
                          className={inputClass}
                          placeholder="https://example.com/apply"
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
                          className={inputClass}
                          placeholder="Describe the opportunity..."
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
                          className={inputClass}
                          placeholder="Who is eligible to apply?"
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
                          className={inputClass}
                          placeholder="Explain the application process..."
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row">
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Save size={17} />
                        {saving ? "Saving Changes..." : "Save Changes"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setError("");
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        <X size={17} />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  /* OPPORTUNITY DISPLAY CARD */
                  <div className="p-5 sm:p-7">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                      <div className="flex min-w-0 gap-4">
                        <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700 sm:flex">
                          <BriefcaseBusiness size={25} />
                        </div>

                        <div className="min-w-0">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                                opportunity.is_active
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  opportunity.is_active
                                    ? "bg-emerald-500"
                                    : "bg-slate-400"
                                }`}
                              />
                              {opportunity.is_active ? "Active" : "Inactive"}
                            </span>

                            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                              {opportunity.category === "INTERNSHIP"
                                ? "Internship"
                                : "Job"}
                            </span>
                          </div>

                          <h3 className="break-words text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                            {opportunity.title}
                          </h3>

                          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                            <Building2
                              size={16}
                              className="shrink-0 text-slate-400"
                            />
                            {opportunity.organization}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => startEditing(opportunity)}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Pencil size={16} />
                        Edit Posting
                      </button>
                    </div>

                    {/* OPPORTUNITY DETAILS */}
                    <div className="mt-6 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                        <div className="rounded-lg bg-white p-2 text-slate-500 shadow-sm">
                          <MapPin size={17} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-400">Location</p>
                          <p className="truncate text-sm font-semibold text-slate-700">
                            {opportunity.location || "Remote"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                        <div className="rounded-lg bg-white p-2 text-slate-500 shadow-sm">
                          <CalendarDays size={17} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-400">
                            Application deadline
                          </p>
                          <p className="truncate text-sm font-semibold text-slate-700">
                            {opportunity.deadline || "No deadline specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5">
                      {opportunity.is_active ? (
                        <button
                          type="button"
                          onClick={() => deactivateOpportunity(opportunity.id)}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
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
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <RotateCcw size={16} />
                            Reactivate
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteOpportunity(opportunity.id)}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
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
                          className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 sm:ml-auto"
                        >
                          View Application Link
                          <ArrowUpRight size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
