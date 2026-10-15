import { useEffect, useState } from "react";

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);

  useEffect(() => {
   fetch(`http://127.0.0.1:8000/api/opportunities/?page=${currentPage}`)
     .then((response) => {
       if (!response.ok) {
         throw new Error("Failed to load opportunities.");
       }
       return response.json();
     })
     .then((data) => {
       setOpportunities(data.results ?? data);
       setNextPageUrl(data.next ?? null);
       setPreviousPageUrl(data.previous ?? null);
     })
     .catch(() => {
       setError("Could not load opportunities. Please try again.");
     })
     .finally(() => {
       setLoading(false);
     });
  }, [ currentPage ]);

  const buttonStyle =
    "inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

  const secondaryButtonStyle =
    "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50";

  const filteredOpportunities = opportunities.filter((opportunity) => {
    const query = searchTerm.trim().toLowerCase();

    const matchesSearch =
      (opportunity.title || "").toLowerCase().includes(query) ||
      (opportunity.organization || "").toLowerCase().includes(query);

    const category = (opportunity.category || "").toUpperCase();

    const matchesCategory =
      categoryFilter === "ALL" || category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl bg-white p-8">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        <p className="text-sm font-medium text-slate-500">
          Finding opportunities for you...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl text-red-600">
          !
        </div>
        <h2 className="mt-4 text-lg font-bold text-slate-800">
          Unable to load opportunities
        </h2>
        <p className="mt-2 text-sm text-slate-600">{error}</p>
        <button
          type="button"
          className={`${buttonStyle} mt-5`}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (selectedOpportunity) {
    const opportunity = selectedOpportunity;

    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setSelectedOpportunity(null)}
          className={secondaryButtonStyle}
        >
          <span className="mr-2" aria-hidden="true">
            ←
          </span>
          Back to Opportunities
        </button>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-800 px-6 py-10 sm:px-10">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-100">
              {opportunity.category || "Opportunity"}
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl">
              {opportunity.title}
            </h1>

            <p className="mt-3 text-base text-blue-100">
              {opportunity.organization || "Organization not specified"}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/90">
              <span className="rounded-lg bg-white/10 px-3 py-2">
                📍 {opportunity.location || "Location not specified"}
              </span>
              <span className="rounded-lg bg-white/10 px-3 py-2">
                📅 Deadline: {opportunity.deadline || "Not specified"}
              </span>
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_280px]">
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-bold text-slate-900">
                  About this opportunity
                </h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {opportunity.description ||
                    "No description has been provided yet."}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900">
                  Eligibility Requirements
                </h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {opportunity.eligibility ||
                    "Eligibility requirements have not been specified."}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900">
                  How to Apply
                </h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {opportunity.how_to_apply ||
                    "Follow the application link for further instructions."}
                </p>
              </section>
            </div>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-slate-900">
                Ready to apply?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Review the requirements before submitting your application.
              </p>

              {opportunity.application_link ? (
                <a
                  href={opportunity.application_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${buttonStyle} mt-5 w-full`}
                >
                  Apply Now <span className="ml-2">↗</span>
                </a>
              ) : (
                <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                  An application link has not been provided yet.
                </p>
              )}

              <div className="mt-5 border-t border-slate-200 pt-4 text-sm">
                <p className="text-slate-500">Application deadline</p>
                <p className="mt-1 font-semibold text-slate-800">
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
    <div className="space-y-8">
      <header className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-blue-800 px-6 py-10 sm:px-10 sm:py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
          Your next career move
        </p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Browse Opportunities
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
          Discover jobs and internships, explore new possibilities, and take the
          next step toward your career goals.
        </p>

        <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {opportunities.length}{" "}
          {opportunities.length === 1 ? "opportunity" : "opportunities"}{" "}
          available
        </div>
      </header>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[1fr_220px]">
        <div>
          <label
            htmlFor="opportunity-search"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Search opportunities
          </label>

          <input
            id="opportunity-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by title or organization..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="opportunity-category"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Category
          </label>

          <select
            id="opportunity-category"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="ALL">All opportunities</option>
            <option value="JOB">Jobs</option>
            <option value="INTERNSHIP">Internships</option>
          </select>
        </div>
      </div>

      {filteredOpportunities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
            💼
          </div>
          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No opportunities yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            There are no active opportunities to display right now. Please check
            back later.
          </p>
        </div>
      ) : (
        <section>
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Available Opportunities
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Explore the details and find your next opportunity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {filteredOpportunities.map((opportunity) => (
              <article
                key={opportunity.id}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold text-blue-700">
                    {(opportunity.organization || opportunity.title || "O")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {opportunity.category || "Opportunity"}
                    </span>

                    <h3 className="mt-3 text-lg font-bold leading-snug text-slate-900 transition group-hover:text-blue-700">
                      {opportunity.title}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {opportunity.organization || "Organization not specified"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex-1 space-y-3 border-t border-slate-100 pt-5">
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <span aria-hidden="true">📍</span>
                    <span>
                      {opportunity.location || "Location not specified"}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <span aria-hidden="true">📅</span>
                    <span>
                      Deadline: {opportunity.deadline || "Not specified"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOpportunity(opportunity)}
                  className={`${buttonStyle} mt-6 w-full`}
                >
                  View Details <span className="ml-2">→</span>
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="flex items-center justify-between gap-4 pt-4">
        <button
          type="button"
          disabled={!previousPageUrl}
          onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Previous
        </button>

        <span className="text-sm font-medium text-slate-600">
          Page {currentPage}
        </span>

        <button
          type="button"
          disabled={!nextPageUrl}
          onClick={() => setCurrentPage((page) => page + 1)}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default Opportunities;
