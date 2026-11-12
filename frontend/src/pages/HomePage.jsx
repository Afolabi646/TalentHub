import { useEffect,  useState } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [submittedLocation, setSubmittedLocation] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchOpportunities() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (submittedSearch.trim()) {
          params.set("search", submittedSearch.trim());
        }

        if (submittedLocation.trim()) {
          params.set("location", submittedLocation.trim());
        }

        const response = await fetch(
          `http://127.0.0.1:8000/api/opportunities/?${params.toString()}`,
        );

        if (!response.ok) {
          throw new Error("Could not load opportunities.");
        }

        const data = await response.json();
        setOpportunities(data.results ?? data);
      } catch {
        setError("We couldn't load opportunities right now.");
      } finally {
        setLoading(false);
      }
    }

    fetchOpportunities();
  }, [submittedSearch, submittedLocation]);


  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <header className="relative border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-blue-950"
            onClick={() => setMobileMenuOpen(false)}
          >
            TalentHub<span className="text-blue-600">.</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#job-seekers"
              className="text-sm font-medium text-slate-600 hover:text-blue-700"
            >
              Job Seekers
            </a>
            <a
              href="#employers"
              className="text-sm font-medium text-slate-600 hover:text-blue-700"
            >
              Employers
            </a>
            <a
              href="#latest-opportunities"
              className="text-sm font-medium text-slate-600 hover:text-blue-700"
            >
              Opportunities
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-5 md:flex">
            <Link
              to="/auth"
              className="text-sm font-semibold text-slate-700 hover:text-blue-700"
            >
              Sign in
            </Link>
            <Link
              to="/auth"
              className="rounded-lg bg-blue-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Get started
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-2xl text-blue-950 md:hidden"
          >
            {mobileMenuOpen ? "×" : "☰"}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-5 shadow-lg md:hidden">
            <div className="flex flex-col gap-5">
              <a
                href="#job-seekers"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-700"
              >
                Job Seekers
              </a>

              <a
                href="#employers"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-700"
              >
                Employers
              </a>

              <a
                href="#latest-opportunities"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-700"
              >
                Opportunities
              </a>

              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="border-t border-slate-200 pt-5 text-sm font-semibold text-slate-700"
              >
                Sign in
              </Link>

              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg bg-blue-950 px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Get started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero and Search */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center md:py-28">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
            Connecting talent with opportunity
          </p>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Find opportunities.
            <span className="block text-blue-800">Discover great talent.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Whether you're building your career or building your team, TalentHub
            helps you take the next step.
          </p>

          {/* Job Search */}
          <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSubmittedSearch(searchTerm);
                setSubmittedLocation(location);

                document
                  .getElementById("latest-opportunities")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
            >
              <div className="flex items-center gap-3 px-3">
                <span className="text-xl text-slate-400">⌕</span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Job title, skill or keyword"
                  aria-label="Search by job title, skill or keyword"
                  className="w-full py-3 text-sm outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-3 border-t border-slate-200 px-3 md:border-l md:border-t-0">
                <span className="text-lg text-slate-400">⌖</span>
                <input
                  type="search"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Location"
                  aria-label="Search by location"
                  className="w-full py-3 text-sm outline-none placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-blue-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Search jobs
              </button>
            </form>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Explore opportunities before creating an account.
          </p>
        </div>
      </section>

      {/* Latest Opportunities */}
      <section
        id="latest-opportunities"
        className="mx-auto max-w-7xl scroll-mt-8 px-6 py-20"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Explore opportunities
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Latest opportunities
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-slate-600">
              Discover jobs and internships published by employers on TalentHub.
            </p>
          </div>

          <Link
            to="/opportunities"
            className="font-semibold text-blue-800 hover:text-blue-600"
          >
            View all opportunities →
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 flex items-center justify-center rounded-2xl border border-slate-200 py-16">
            <p className="text-sm font-medium text-slate-500">
              Loading opportunities...
            </p>
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-medium text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 font-semibold text-red-800 underline"
            >
              Try again
            </button>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
            <h3 className="text-lg font-bold text-slate-900">
              No matching opportunities found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Try another keyword or location.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.slice(0, 6).map((opportunity) => (
              <article
                key={opportunity.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                    {opportunity.category || "Opportunity"}
                  </span>
                  <span className="text-xs text-slate-400">TalentHub</span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-950">
                  {opportunity.title}
                </h3>

                <p className="mt-2 text-sm font-medium text-slate-600">
                  {opportunity.organization || "Organization not specified"}
                </p>

                <div className="mt-5 flex-1 space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-500">
                  <p>Location: {opportunity.location || "Not specified"}</p>
                  <p>Deadline: {opportunity.deadline || "Not specified"}</p>
                </div>

                <Link
                  to="/opportunities"
                  className="mt-6 inline-flex items-center justify-center rounded-lg border border-blue-900 px-5 py-3 text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
                >
                  Explore opportunities →
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Job Seekers and Employers */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              One platform, two experiences
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
              What brings you to TalentHub?
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Whether you're searching for your next role or looking for your
              next great hire, there's a place for you here.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* Job Seekers */}
            <div
              id="job-seekers"
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10"
            >
              <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
                For job seekers
              </p>

              <h3 className="mt-4 text-2xl font-bold text-slate-950">
                Build the career you deserve.
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Discover jobs and internships, find opportunities that match
                your skills, and manage your applications.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                <li>✓ Discover jobs and internships</li>
                <li>✓ Get personalised opportunity matches</li>
                <li>✓ Save opportunities and track applications</li>
                <li>✓ Build your professional profile</li>
              </ul>

              <Link
                to="/auth"
                className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-blue-950 px-6 py-4 font-semibold text-white transition hover:bg-blue-800"
              >
                Join as a job seeker
              </Link>
            </div>

            {/* Employers */}
            <div
              id="employers"
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10"
            >
              <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
                For employers
              </p>

              <h3 className="mt-4 text-2xl font-bold text-slate-950">
                Find people who move you forward.
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Publish opportunities, reach skilled candidates, and manage
                applications from one workspace.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                <li>✓ Publish jobs and internships</li>
                <li>✓ Reach potential candidates</li>
                <li>✓ Review and manage applications</li>
                <li>✓ Track recruitment activities</li>
              </ul>

              <Link
                to="/auth"
                className="mt-8 inline-flex w-full items-center justify-center rounded-lg border border-blue-950 px-6 py-4 font-semibold text-blue-950 transition hover:bg-blue-50"
              >
                Join as an employer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Closing section */}
      <section className="bg-blue-950 px-6 py-20 text-center">
        <h2 className="mx-auto max-w-3xl text-3xl font-bold text-white sm:text-4xl">
          Your next step starts with the right connection.
        </h2>
        <p className="mx-auto mt-5 max-w-xl leading-7 text-blue-100">
          Join a platform designed to bring opportunities and talent closer
          together.
        </p>
        <Link
          to="/auth"
          className="mt-8 inline-flex rounded-lg bg-white px-8 py-4 font-semibold text-blue-950 transition hover:bg-blue-50"
        >
          Get started with TalentHub
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-8 sm:flex-row">
          <p className="text-xl font-bold text-blue-950">
            TalentHub<span className="text-blue-600">.</span>
          </p>
          <p className="text-sm text-slate-500">
            Connecting talent with opportunity.
          </p>
        </div>
      </footer>
    </main>
  );
}
