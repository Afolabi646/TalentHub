import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Search,
  Bookmark,
  ArrowRight,
  MapPin,
  CalendarDays,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Building2,
  Clock3,
  Sparkles,
  ExternalLink,
} from "lucide-react";

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [savingId, setSavingId] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [appliedIds, setAppliedIds] = useState([]);

  useEffect(() => {
    async function fetchOpportunities() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        params.set("page", currentPage);

        if (submittedSearch.trim()) {
          params.set("search", submittedSearch.trim());
        }

        const response = await fetch(
          `http://127.0.0.1:8000/api/opportunities/?${params.toString()}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load opportunities.");
        }

        const data = await response.json();

        setOpportunities(data.results ?? data);
        setNextPageUrl(data.next ?? null);
        setPreviousPageUrl(data.previous ?? null);
      } catch {
        setError("Could not load opportunities. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchOpportunities();
  }, [currentPage, submittedSearch]);

  useEffect(() => {
    const fetchSavedOpportunities = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) return;

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
          throw new Error("Failed to load saved opportunities.");
        }

        const data = await response.json();
        const savedOpportunities = data.results ?? data;

        setSavedIds(savedOpportunities.map((item) => item.opportunity.id));
      } catch (error) {
        console.error(error);
      }
    };

    fetchSavedOpportunities();
  }, []);

  const handleSaveOpportunity = async (opportunityId) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("Please log in to save opportunities.");
      return;
    }

    setSavingId(opportunityId);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/opportunities/save/${opportunityId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.error || "Could not save opportunity.",
        );
      }

      setSavedIds((ids) =>
        ids.includes(opportunityId) ? ids : [...ids, opportunityId],
      );

      alert(data.message);
    } catch (error) {
      alert(error.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleViewOpportunity = async (opportunity) => {
    setSelectedOpportunity(opportunity);
    setApplicationMessage("");

    try {
      const token = localStorage.getItem("accessToken");

      await fetch(
        `http://127.0.0.1:8000/api/opportunities/${opportunity.id}/view/`,
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
    } catch (error) {
      console.error("Could not record opportunity view:", error);
    }
  };

  const handleApply = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setApplicationMessage("Please log in to apply.");
      return;
    }

    if (!selectedOpportunity) return;

    setApplying(true);
    setApplicationMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/applications/apply/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            opportunity: selectedOpportunity.id,
            cover_letter: coverLetter,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.detail ||
          data.non_field_errors?.[0] ||
          "Could not submit your application.";

        throw new Error(errorMessage);
      }

      setAppliedIds((ids) =>
        ids.includes(selectedOpportunity.id)
          ? ids
          : [...ids, selectedOpportunity.id],
      );

      setApplicationMessage("Your application was submitted successfully!");
      setCoverLetter("");
    } catch (error) {
      setApplicationMessage(error.message);
    } finally {
      setApplying(false);
    }
  };

  const buttonStyle =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60";

  const filteredOpportunities = opportunities.filter((opportunity) => {
    const category = (opportunity.category || "").toUpperCase();

    return categoryFilter === "ALL" || category === categoryFilter;
  });

  if (loading) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center gap-5 rounded-2xl border border-slate-100 bg-white p-8">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-blue-100 border-t-blue-600" />
        </div>

        <div className="text-center">
          <p className="font-semibold text-slate-800">
            Finding opportunities for you
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Please wait while we load the latest opportunities.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <BriefcaseBusiness className="h-6 w-6" />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Unable to load opportunities
        </h2>

        <p className="mt-2 text-sm text-slate-500">{error}</p>

        <button
          type="button"
          className={`${buttonStyle} mt-6`}
          onClick={() => window.location.reload()}
        >
          Try Again
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (selectedOpportunity) {
    const opportunity = selectedOpportunity;

    return (
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <button
          type="button"
          onClick={() => {
            setSelectedOpportunity(null);
            setApplicationMessage("");
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Opportunities
        </button>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <header className="relative isolate overflow-hidden bg-[#101D3A] px-6 py-10 sm:px-10 sm:py-14">
            <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 right-1/4 -z-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="relative max-w-4xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-200">
                  {opportunity.category || "Opportunity"}
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <Sparkles className="h-3.5 w-3.5 text-blue-300" />
                  AI TalentHub Opportunity
                </span>
              </div>

              <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {opportunity.title}
              </h1>

              <div className="mt-4 flex items-center gap-2 text-base font-medium text-blue-200">
                <Building2 className="h-5 w-5" />
                {opportunity.organization || "Organization not specified"}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <MapPin className="h-4 w-4 text-blue-300" />
                  {opportunity.location || "Location not specified"}
                </span>

                <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <CalendarDays className="h-4 w-4 text-blue-300" />
                  Deadline: {opportunity.deadline || "Not specified"}
                </span>
              </div>
            </div>
          </header>

          <div className="grid items-start gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10 lg:p-10">
            <main className="min-w-0 space-y-9">
              <section className="border-b border-slate-100 pb-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </div>

                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    About this opportunity
                  </h2>
                </div>

                <p className="mt-5 whitespace-pre-line text-sm leading-8 text-slate-600">
                  {opportunity.description ||
                    "No description has been provided yet."}
                </p>
              </section>

              <section className="border-b border-slate-100 pb-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>

                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    Eligibility Requirements
                  </h2>
                </div>

                <p className="mt-5 whitespace-pre-line text-sm leading-8 text-slate-600">
                  {opportunity.eligibility ||
                    "Eligibility requirements have not been specified."}
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>

                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    How to Apply
                  </h2>
                </div>

                <p className="mt-5 whitespace-pre-line text-sm leading-8 text-slate-600">
                  {opportunity.how_to_apply ||
                    "Follow the application link for further instructions."}
                </p>
              </section>
            </main>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 lg:sticky lg:top-6">
              <div className="rounded-xl bg-[#101D3A] p-5 text-white">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-blue-200">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>

                <h2 className="mt-4 text-lg font-bold">
                  Ready to take the next step?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Review the requirements and submit your application.
                </p>
              </div>

              {opportunity.application_link ? (
                <a
                  href={opportunity.application_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${buttonStyle} mt-5 w-full`}
                >
                  Apply on External Website
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800">
                  An external application link has not been provided yet.
                </p>
              )}

              <div className="mt-7 border-t border-slate-200 pt-6">
                <h3 className="text-base font-bold text-slate-900">
                  Apply inside AI TalentHub
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Submit your application directly through this platform.
                </p>

                {appliedIds.includes(opportunity.id) ? (
                  <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <span className="text-sm font-bold">
                        Application submitted
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-emerald-800">
                      You have already applied for this opportunity.
                    </p>
                  </div>
                ) : (
                  <>
                    <label
                      htmlFor="cover-letter"
                      className="mt-5 block text-sm font-semibold text-slate-700"
                    >
                      Cover letter
                      <span className="ml-1 font-normal text-slate-400">
                        (Optional)
                      </span>
                    </label>

                    <textarea
                      id="cover-letter"
                      value={coverLetter}
                      onChange={(event) => setCoverLetter(event.target.value)}
                      placeholder="Explain why you are suitable for this opportunity..."
                      rows={6}
                      className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={handleApply}
                      disabled={applying}
                      className={`${buttonStyle} mt-4 w-full`}
                    >
                      {applying ? "Submitting..." : "Submit Application"}
                      {!applying && <ArrowRight className="h-4 w-4" />}
                    </button>
                  </>
                )}

                {applicationMessage && (
                  <p
                    role="status"
                    className="mt-3 rounded-lg bg-white p-3 text-sm leading-6 text-slate-700"
                  >
                    {applicationMessage}
                  </p>
                )}
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock3 className="h-4 w-4" />
                  <p className="text-xs font-bold uppercase tracking-wider">
                    Application deadline
                  </p>
                </div>

                <p className="mt-2 text-sm font-bold text-slate-900">
                  {opportunity.deadline || "Not specified"}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <header className="relative isolate overflow-hidden rounded-3xl bg-[#101D3A] px-6 py-10 shadow-xl shadow-blue-950/10 sm:px-10 sm:py-12 lg:px-12">
        <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-1/4 -z-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-xs font-bold tracking-wider text-blue-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            CAREER OPPORTUNITIES
          </div>

          <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Find opportunities.
            <span className="block text-blue-300">Build your future.</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            Discover meaningful jobs and internships, connect with exciting
            organizations, and take the next step in your professional journey.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-200">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xl font-bold text-white">
                  {opportunities.length}
                </p>
                <p className="text-xs text-slate-400">
                  Opportunities on this page
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-200">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Your next step
                </p>
                <p className="text-xs text-slate-400">Starts here</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Search className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Find your next opportunity
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Search for opportunities that match your career interests.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-[1fr_230px]">
          <div>
            <label
              htmlFor="opportunity-search"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Search opportunities
            </label>

            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                id="opportunity-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setCurrentPage(1);
                    setSubmittedSearch(searchTerm);
                  }
                }}
                placeholder="Search by title or organization..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="opportunity-category"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Opportunity type
            </label>

            <select
              id="opportunity-category"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
            >
              <option value="ALL">All opportunities</option>
              <option value="JOB">Jobs</option>
              <option value="INTERNSHIP">Internships</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
          <p className="text-xs leading-5 text-slate-500">
            Find jobs and internships that match your career goals.
          </p>

          <button
            type="button"
            onClick={() => {
              setCurrentPage(1);
              setSubmittedSearch(searchTerm);
            }}
            className="inline-flex items-center justify-center rounded-xl bg-[#142747] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            Search Opportunities
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </section>

      {filteredOpportunities.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <Search className="h-7 w-7" />
          </div>

          <h2 className="mt-6 text-xl font-bold text-slate-900">
            {submittedSearch || categoryFilter !== "ALL"
              ? "No matching opportunities"
              : "No opportunities available"}
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
            {submittedSearch
              ? `We couldn't find opportunities matching "${submittedSearch}". Try another search term.`
              : categoryFilter !== "ALL"
                ? "There are currently no opportunities in this category. Try exploring other categories."
                : "There are currently no active opportunities to display. Please check back later."}
          </p>

          {(submittedSearch || categoryFilter !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSubmittedSearch("");
                setCategoryFilter("ALL");
                setCurrentPage(1);
              }}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#142747] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <section>
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Available Opportunities
                </h2>

                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                  {filteredOpportunities.length}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Explore the details and find your next opportunity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {filteredOpportunities.map((opportunity) => (
              <article
                key={opportunity.id}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5"
              >
                <div className="h-1 w-full bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-400" />

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#142747] text-lg font-bold text-white shadow-sm transition group-hover:bg-blue-700">
                        {(opportunity.organization || opportunity.title || "O")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {opportunity.organization ||
                            "Organization not specified"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Opportunity #{opportunity.id}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${
                        (opportunity.category || "").toUpperCase() ===
                        "INTERNSHIP"
                          ? "border-purple-100 bg-purple-50 text-purple-700"
                          : "border-blue-100 bg-blue-50 text-blue-700"
                      }`}
                    >
                      {opportunity.category || "Opportunity"}
                    </span>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-bold leading-snug tracking-tight text-slate-900 transition group-hover:text-blue-800">
                      {opportunity.title}
                    </h3>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                      {opportunity.description ||
                        "Explore this opportunity and discover how it can support your professional growth."}
                    </p>
                  </div>

                  <div className="mt-6 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm">
                        <MapPin className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Location
                        </p>

                        <p className="mt-1 break-words text-sm font-semibold text-slate-700">
                          {opportunity.location || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm">
                        <CalendarDays className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Application deadline
                        </p>

                        <p className="mt-1 break-words text-sm font-semibold text-slate-700">
                          {opportunity.deadline || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => handleSaveOpportunity(opportunity.id)}
                      disabled={
                        savingId === opportunity.id ||
                        savedIds.includes(opportunity.id)
                      }
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Bookmark
                        className="h-4 w-4"
                        fill={
                          savedIds.includes(opportunity.id)
                            ? "currentColor"
                            : "none"
                        }
                      />

                      {savedIds.includes(opportunity.id)
                        ? "Saved"
                        : savingId === opportunity.id
                          ? "Saving..."
                          : "Save Opportunity"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleViewOpportunity(opportunity)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#142747] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-6">
        <button
          type="button"
          disabled={!previousPageUrl}
          onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>

        <span className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700">
          Page {currentPage}
        </span>

        <button
          type="button"
          disabled={!nextPageUrl}
          onClick={() => setCurrentPage((page) => page + 1)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#142747] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default Opportunities;
