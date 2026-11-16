import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  ClipboardList,
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  Sparkles,
} from "lucide-react";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Please log in to view your applications.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/applications/my/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Could not load your applications.");
        }

        setApplications(data.results ?? data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "ACCEPTED":
        return {
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: CheckCircle2,
          label: "Accepted",
        };

      case "REJECTED":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          icon: XCircle,
          label: "Rejected",
        };

      case "REVIEWING":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Eye,
          label: "Under Review",
        };

      default:
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Clock3,
          label: status || "Pending",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        <p className="text-sm font-medium text-slate-500">
          Loading your applications...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center"
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
              <ClipboardList size={14} />
              APPLICATION TRACKER
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              My Applications
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              Keep track of your job and internship applications. Monitor your
              progress and stay updated as employers review your applications.
            </p>
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center self-start rounded-2xl border border-white/15 bg-white/10 sm:h-24 sm:w-24">
            <BriefcaseBusiness size={42} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <ClipboardList size={23} />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">
              Total applications
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {applications.length}
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
              {applications.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Application List */}
      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Application history
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review the opportunities you've applied for.
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            {applications.length} applications
          </span>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <BriefcaseBusiness size={32} strokeWidth={1.5} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No applications yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven't applied for any opportunities yet. Explore available
              jobs and internships to take your next career step.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
              <Sparkles size={16} />
              Your career journey starts with one application
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {applications.map((application) => {
              const status = getStatusStyle(application.status);
              const StatusIcon = status.icon;

              return (
                <article
                  key={application.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:border-blue-200 hover:shadow-md sm:p-6"
                >
                  {/* Application Heading */}
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <BriefcaseBusiness size={23} />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold leading-snug text-slate-900">
                          {application.opportunity_title}
                        </h3>

                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                          <CalendarDays size={15} className="text-blue-600" />
                          <span>
                            Applied on:{" "}
                            {new Date(
                              application.applied_at,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <span
                      className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${status.color}`}
                    >
                      <StatusIcon size={15} />
                      {status.label}
                    </span>
                  </div>

                  {/* Cover Letter */}
                  {application.cover_letter && (
                    <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <FileText size={17} className="text-blue-700" />
                        <h4 className="text-sm font-bold text-slate-800">
                          Your cover letter
                        </h4>
                      </div>

                      <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                        {application.cover_letter}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 text-xs font-medium text-slate-400">
                    <span>Application ID: #{application.id}</span>
                    <span>•</span>
                    <span>TalentHub Application</span>
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
