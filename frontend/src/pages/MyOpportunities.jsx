import { useEffect, useState } from "react";

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

  if (loading) {
    return <p>Loading your opportunities...</p>;
  }

  if (error && opportunities.length === 0) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800">My Opportunities</h2>

      {message && <p className="mt-4 text-green-700">{message}</p>}

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {opportunities.length === 0 ? (
        <p className="mt-4 text-slate-600">
          You haven't posted any opportunities yet.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {opportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="rounded-xl border border-slate-200 p-5"
            >
              {editingId === opportunity.id ? (
                <form onSubmit={saveChanges} className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Edit Opportunity
                  </h3>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Job or internship title
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Organization
                    </label>
                    <input
                      name="organization"
                      value={form.organization}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Category
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 p-3"
                    >
                      <option value="JOB">Job</option>
                      <option value="INTERNSHIP">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Location
                    </label>
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Application deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={form.deadline}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Application link
                    </label>
                    <input
                      type="url"
                      name="application_link"
                      value={form.application_link}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={4}
                      required
                      className="w-full rounded-lg border border-slate-300 p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Eligibility
                    </label>
                    <textarea
                      name="eligibility"
                      value={form.eligibility}
                      onChange={handleChange}
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      How to apply
                    </label>
                    <textarea
                      name="how_to_apply"
                      value={form.how_to_apply}
                      onChange={handleChange}
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 p-3"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setError("");
                      }}
                      className="rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {opportunity.title}
                  </h3>

                  <p className="mt-1 text-slate-600">
                    {opportunity.organization}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    {opportunity.category} · {opportunity.location || "Remote"}
                  </p>

                  <p className="mt-2 text-sm">
                    Status: {opportunity.is_active ? "Active" : "Inactive"}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => startEditing(opportunity)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Edit Opportunity
                    </button>

                    {opportunity.is_active ? (
                      <button
                        type="button"
                        onClick={() => deactivateOpportunity(opportunity.id)}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              setError("");
                              setMessage("");

                              const token = localStorage.getItem("accessToken");

                              const response = await fetch(
                                `${API_URL}my/${opportunity.id}/reactivate/`,
                                {
                                  method: "PATCH",
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                },
                              );

                              const data = await response.json();

                              if (!response.ok) {
                                throw new Error(
                                  data.detail ||
                                    "Failed to reactivate the opportunity.",
                                );
                              }

                              await fetchMyOpportunities();
                              setMessage(
                                "Opportunity reactivated successfully.",
                              );
                            } catch (err) {
                              setError(err.message);
                            }
                          }}
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                          Reactivate
                        </button>

                        <button
                          type="button"
                          onClick={async () => {
                            const confirmed = window.confirm(
                              "Permanently delete this inactive opportunity? This cannot be undone.",
                            );

                            if (!confirmed) return;

                            try {
                              setError("");
                              setMessage("");

                              const token = localStorage.getItem("accessToken");

                              const response = await fetch(
                                `${API_URL}my/${opportunity.id}/delete/`,
                                {
                                  method: "DELETE",
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                },
                              );

                              if (!response.ok) {
                                throw new Error(
                                  "Failed to delete the opportunity.",
                                );
                              }

                              await fetchMyOpportunities();
                              setMessage("Opportunity deleted successfully.");
                            } catch (err) {
                              setError(err.message);
                            }
                          }}
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
