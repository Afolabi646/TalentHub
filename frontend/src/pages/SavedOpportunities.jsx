import { useEffect, useState } from "react";
import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  MapPin,
  CalendarDays,
  ExternalLink,
  Trash2,
  Sparkles,
  BookmarkX,
} from "lucide-react";

function SavedOpportunities() {
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const fetchSavedOpportunities = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("Please log in to view your saved opportunities.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/opportunities/saved/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Could not load saved opportunities.");
        }

        const data = await response.json();
        setSavedOpportunities(data.results ?? data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedOpportunities();
  }, []);

  const handleRemove = async (opportunityId) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Please log in to remove saved opportunities.");
      return;
    }

    setRemovingId(opportunityId);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/opportunities/saved/${opportunityId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || "Could not remove this saved opportunity.",
        );
      }

      setSavedOpportunities((current) =>
        current.filter((item) => item.opportunity.id !== opportunityId),
      );

      alert("Opportunity removed from saved opportunities.");
    } catch (error) {
      alert(error.message);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        <p className="text-sm font-medium text-slate-500">
          Loading your saved opportunities...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <p className="font-semibold text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#101f43] via-[#17366b] to-blue-700 p-7 text-white shadow-lg sm:p-9">
        <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 right-36 h-56 w-56 rounded-full bg-blue-400/10" />

        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
              <Bookmark size={14} />
              YOUR COLLECTION
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Saved Opportunities
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              Keep your career opportunities organized. Revisit interesting jobs
              and internships whenever you're ready to apply.
            </p>
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center self-start rounded-2xl border border-white/15 bg-white/10 sm:h-24 sm:w-24">
            <Bookmark size={42} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Bookmark size={23} />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">
              Saved opportunities
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {savedOpportunities.length}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
            <BriefcaseBusiness size={23} />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">
              Career opportunities
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {savedOpportunities.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Opportunities */}
      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Your saved list
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Opportunities you've bookmarked for later.
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            {savedOpportunities.length} saved
          </span>
        </div>

        {savedOpportunities.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <BookmarkX size={32} strokeWidth={1.5} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No saved opportunities yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven't bookmarked any opportunities. Explore available jobs
              and internships, then save the ones that interest you.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
              <Sparkles size={16} />
              Your next career opportunity could be waiting
            </div>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {savedOpportunities.map((item) => {
              const opportunity = item.opportunity;

              return (
                <div
                  key={item.id}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-6"
                >
                  {/* Card Header */}
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <Building2 size={21} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-lg font-bold leading-snug text-slate-900 transition group-hover:text-blue-700">
                          {opportunity.title}
                        </h3>

                        <p className="mt-1 text-sm font-medium text-slate-500">
                          {opportunity.organization}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                      {opportunity.category}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="mb-4 flex flex-wrap gap-x-5 gap-y-3 border-y border-slate-100 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin size={16} className="shrink-0 text-blue-600" />
                      <span>{opportunity.location || "Not specified"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <CalendarDays
                        size={16}
                        className="shrink-0 text-blue-600"
                      />
                      <span>
                        Deadline: {opportunity.deadline || "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mb-6 flex-1 text-sm leading-7 text-slate-600">
                    {opportunity.description}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
                    {opportunity.application_link && (
                      <a
                        href={opportunity.application_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17366b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        Apply Now
                        <ExternalLink size={15} />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemove(opportunity.id)}
                      disabled={removingId === opportunity.id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      {removingId === opportunity.id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedOpportunities;
