import { useEffect, useState } from "react";
import {
  Sparkles,
  BriefcaseBusiness,
  MapPin,
  Target,
  Building2,
  TrendingUp,
  Lightbulb,
  Award,
} from "lucide-react";

export default function JobMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Please log in to view your job matches.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/opportunities/matches/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || data.error || "Could not load job matches.",
          );
        }

        setMatches(data.results ?? data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        <p className="text-sm font-medium text-slate-500">
          Finding your best opportunities...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center"
        role="alert"
      >
        <p className="font-semibold text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#101f43] via-[#17366b] to-blue-700 p-7 text-white shadow-lg sm:p-9">
        <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 right-36 h-56 w-56 rounded-full bg-blue-400/10" />

        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
              <Sparkles size={14} />
              SMART JOB MATCHING
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Recommended for You
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              Discover career opportunities that align with the skills and
              experience in your profile. Find opportunities worth exploring.
            </p>
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center self-start rounded-2xl border border-white/15 bg-white/10 sm:h-24 sm:w-24">
            <Target size={42} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <BriefcaseBusiness size={23} />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">
              Matched opportunities
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {matches.length}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
            <TrendingUp size={23} />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">
              Matching system
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Profile-based
            </h2>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            Your recommended opportunities
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Ranked according to keyword similarity with your profile.
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Target size={32} strokeWidth={1.5} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No matches available yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              We couldn't find any active opportunities to recommend right now.
              Complete your profile with relevant skills and experience, and
              check back when more opportunities become available.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
              <Lightbulb size={16} />A complete profile helps improve your
              matches
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {matches.map((opportunity) => {
              const score = Number(opportunity.match_score) || 0;
              const progress = Math.min(Math.max(score, 0), 100);

              return (
                <article
                  key={opportunity.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-6"
                >
                  {/* Opportunity Header */}
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <Building2 size={23} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-lg font-bold leading-snug text-slate-900 transition group-hover:text-blue-700">
                          {opportunity.title}
                        </h3>

                        <p className="mt-1 text-sm font-medium text-slate-500">
                          {opportunity.organization}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                          <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                            <MapPin size={15} className="text-blue-600" />
                            {opportunity.location || "Location not specified"}
                          </span>

                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {opportunity.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:min-w-[150px] sm:flex-col sm:items-center sm:gap-1">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
                        <Award size={23} />
                      </div>

                      <div className="sm:text-center">
                        <p className="text-xs font-semibold text-blue-700">
                          Keyword match
                        </p>

                        <p className="text-2xl font-extrabold tracking-tight text-blue-800">
                          {opportunity.match_score}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Match Progress */}
                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-slate-600">
                        Profile similarity
                      </span>

                      <span className="text-xs font-bold text-blue-700">
                        {opportunity.match_score}%
                      </span>
                    </div>

                    <div
                      className="h-2 overflow-hidden rounded-full bg-slate-100"
                      role="progressbar"
                      aria-label="Keyword match score"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-700 to-blue-400 transition-all duration-700"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <h4 className="mb-2 text-sm font-bold text-slate-800">
                      About this opportunity
                    </h4>

                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                      {opportunity.description}
                    </p>
                  </div>

                  {/* Eligibility */}
                  {opportunity.eligibility && (
                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <h4 className="mb-2 text-sm font-bold text-slate-800">
                        Eligibility requirements
                      </h4>

                      <p className="text-sm leading-6 text-slate-600">
                        {opportunity.eligibility}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
