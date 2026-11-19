import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  BriefcaseBusiness,
  MapPin,
  Target,
  Building2,
  TrendingUp,
  Lightbulb,
  Award,
  CheckCircle2,
  XCircle,
  Code2,
  CalendarDays,
  ArrowUpRight,
  Search,
} from "lucide-react";

export default function JobMatches({ user }) {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function handleApply(applicationLink) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      sessionStorage.setItem("dashboardPage", "jobMatches");
      navigate("/auth");
      return;
    }

    if (user?.role !== "APPLICANT") {
      alert("Only applicant accounts can apply for opportunities.");
      return;
    }

    window.open(applicationLink, "_blank", "noopener,noreferrer");
  }

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
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
          <Sparkles className="text-blue-700" size={30} />
          <div className="absolute inset-0 animate-ping rounded-2xl border-2 border-blue-300 opacity-30" />
        </div>

        <div className="text-center">
          <p className="font-semibold text-slate-800">
            Finding your best opportunities
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Comparing your skills with employer requirements...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center"
        role="alert"
      >
        <XCircle className="mx-auto mb-3 text-red-500" size={32} />
        <p className="font-semibold text-red-700">{error}</p>
      </div>
    );
  }

  const averageScore =
    matches.length > 0
      ? (
          matches.reduce(
            (total, item) => total + (Number(item.match_score) || 0),
            0,
          ) / matches.length
        ).toFixed(1)
      : "0";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 pb-8">
      {/* Page Header */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#101f43] via-[#17366b] to-blue-700 p-6 text-white shadow-xl sm:p-9">
        <div className="absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-white/[0.06]" />
        <div className="absolute -bottom-32 right-1/4 -z-10 h-64 w-64 rounded-full bg-blue-300/[0.10]" />

        <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold tracking-wider text-blue-100">
              <Sparkles size={14} />
              AI-POWERED SKILL MATCHING
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Opportunities that match your skills.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
              Discover jobs and internships that match the skills in your
              applicant profile. See what you already qualify for and identify
              the skills you can develop next.
            </p>
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center self-start rounded-2xl border border-white/15 bg-white/10 shadow-inner sm:h-28 sm:w-28">
            <Target size={48} strokeWidth={1.4} />
          </div>
        </div>
      </section>

      {/* Overview Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <BriefcaseBusiness size={23} />
            </div>
            <span className="text-xs font-semibold text-slate-400">
              OPPORTUNITIES
            </span>
          </div>

          <p className="mt-5 text-3xl font-extrabold text-slate-900">
            {matches.length}
          </p>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Opportunities assessed
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp size={23} />
            </div>
            <span className="text-xs font-semibold text-slate-400">
              AVERAGE MATCH
            </span>
          </div>

          <p className="mt-5 text-3xl font-extrabold text-slate-900">
            {averageScore}%
          </p>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Average skill compatibility
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <Code2 size={23} />
            </div>
            <span className="text-xs font-semibold text-slate-400">
              MATCHING METHOD
            </span>
          </div>

          <p className="mt-5 text-xl font-extrabold text-slate-900">
            Skill-based
          </p>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Your skills vs employer requirements
          </p>
        </div>
      </section>

      {/* Opportunities */}
      <section>
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-700">
              <Sparkles size={16} />
              PERSONALIZED RECOMMENDATIONS
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Your job matches
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Opportunities ranked by how closely your skills match what
              employers require.
            </p>
          </div>

          {matches.length > 0 && (
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700">
              <Search size={14} />
              {matches.length} opportunities found
            </span>
          )}
        </div>

        {matches.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Target size={32} strokeWidth={1.5} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No opportunities available yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
              There are currently no active opportunities to recommend. Complete
              your profile and check back when employers publish new
              opportunities.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <Lightbulb size={16} />
              Keep your skills profile updated
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map((opportunity) => {
              const score = Number(opportunity.match_score) || 0;
              const progress = Math.min(Math.max(score, 0), 100);

              const matchedSkills = opportunity.matched_skills || [];
              const missingSkills = opportunity.missing_skills || [];

              const scoreColor =
                score >= 75
                  ? "text-emerald-700"
                  : score >= 40
                    ? "text-amber-700"
                    : "text-slate-700";

              const scoreBackground =
                score >= 75
                  ? "bg-emerald-50 border-emerald-100"
                  : score >= 40
                    ? "bg-amber-50 border-amber-100"
                    : "bg-slate-50 border-slate-200";

              const progressColor =
                score >= 75
                  ? "bg-emerald-500"
                  : score >= 40
                    ? "bg-amber-500"
                    : "bg-blue-600";

              return (
                <article
                  key={opportunity.id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                >
                  {/* Card Top */}
                  <div className="p-5 sm:p-7">
                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-800">
                          <Building2 size={27} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-xl font-extrabold leading-snug text-slate-900 transition group-hover:text-blue-700">
                            {opportunity.title}
                          </h3>

                          <p className="mt-1.5 font-semibold text-slate-500">
                            {opportunity.organization}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                              <MapPin size={14} className="text-blue-600" />
                              {opportunity.location || "Location not specified"}
                            </span>

                            {opportunity.category && (
                              <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                                {opportunity.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Match Score */}
                      <div
                        className={`flex shrink-0 items-center gap-3 rounded-2xl border p-4 lg:min-w-[165px] lg:flex-col lg:items-center lg:gap-1 ${scoreBackground}`}
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                          <Award size={24} className={scoreColor} />
                        </div>

                        <div className="lg:text-center">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Skill match
                          </p>
                          <p
                            className={`text-3xl font-extrabold tracking-tight ${scoreColor}`}
                          >
                            {score.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-7 rounded-2xl bg-slate-50 p-4 sm:p-5">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            Skill compatibility
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Percentage of required skills you already have
                          </p>
                        </div>

                        <span
                          className={`text-sm font-extrabold ${scoreColor}`}
                        >
                          {score.toFixed(2)}%
                        </span>
                      </div>

                      <div
                        className="h-2.5 overflow-hidden rounded-full bg-slate-200"
                        role="progressbar"
                        aria-label="Skill match score"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${progressColor}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Skills Breakdown */}
                    <div className="mt-7 grid gap-5 md:grid-cols-2">
                      {/* Matched Skills */}
                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
                        <div className="mb-4 flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                            <CheckCircle2 size={18} />
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-slate-900">
                              Matched skills
                            </h4>
                            <p className="text-xs text-slate-500">
                              Skills already in your profile
                            </p>
                          </div>

                          <span className="ml-auto rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                            {matchedSkills.length}
                          </span>
                        </div>

                        {matchedSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {matchedSkills.map((skill, index) => (
                              <span
                                key={`${skill}-${index}`}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-800"
                              >
                                <CheckCircle2 size={13} />
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500">
                            No matching skills found yet.
                          </p>
                        )}
                      </div>

                      {/* Missing Skills */}
                      <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
                        <div className="mb-4 flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                            <XCircle size={18} />
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-slate-900">
                              Skills to develop
                            </h4>
                            <p className="text-xs text-slate-500">
                              Requirements not in your profile
                            </p>
                          </div>

                          <span className="ml-auto rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                            {missingSkills.length}
                          </span>
                        </div>

                        {missingSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {missingSkills.map((skill, index) => (
                              <span
                                key={`${skill}-${index}`}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs font-semibold text-amber-800"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm font-medium text-emerald-700">
                            Excellent! You have all the required skills.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Required Skills */}
                    {opportunity.required_skills && (
                      <div className="mt-5 border-t border-slate-100 pt-5">
                        <div className="mb-3 flex items-center gap-2">
                          <Code2 size={17} className="text-blue-700" />
                          <h4 className="text-sm font-bold text-slate-800">
                            Employer's required skills
                          </h4>
                        </div>

                        <p className="text-sm leading-7 text-slate-600">
                          {opportunity.required_skills}
                        </p>
                      </div>
                    )}

                    {/* Description */}
                    {opportunity.description && (
                      <div className="mt-5 border-t border-slate-100 pt-5">
                        <h4 className="mb-2 text-sm font-bold text-slate-800">
                          About this opportunity
                        </h4>

                        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                          {opportunity.description}
                        </p>
                      </div>
                    )}

                    {/* Eligibility */}
                    {opportunity.eligibility && (
                      <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                        <h4 className="mb-2 text-sm font-bold text-slate-800">
                          Eligibility requirements
                        </h4>

                        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                          {opportunity.eligibility}
                        </p>
                      </div>
                    )}

                    {/* Deadline */}
                    {opportunity.deadline && (
                      <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDays size={16} className="text-blue-600" />
                        <span className="font-medium">
                          Application deadline:
                        </span>
                        <span className="font-semibold text-slate-700">
                          {new Date(
                            `${opportunity.deadline}T00:00:00`,
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="flex flex-col justify-between gap-4 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:px-7">
                    <p className="text-xs leading-5 text-slate-500">
                      Your match is calculated from your listed skills.
                    </p>

                    {opportunity.application_link ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleApply(opportunity.application_link)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-md"
                      >
                        Apply Now
                        <ArrowUpRight size={17} />
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-500">
                        Application link unavailable
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
