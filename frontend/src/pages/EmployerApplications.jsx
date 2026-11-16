import { useEffect, useState } from "react";
import {
  Users,
  Clock3,
  Eye,
  CheckCircle2,
  XCircle,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  AlertCircle,
  UserRound,
  RefreshCw,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api/applications/";

export default function EmployerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const fetchApplications = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Please log in to view applications.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}employer/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Could not load applications.");
        }

        setApplications(data.results ?? data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusChange = async (applicationId, newStatus) => {
    const accessToken = localStorage.getItem("accessToken");

    setUpdatingId(applicationId);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}${applicationId}/status/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Could not update application status.");
      }

      setApplications((current) =>
        current.map((application) =>
          application.id === applicationId
            ? { ...application, status: data.status }
            : application,
        ),
      );

      setMessage("Application status updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = {
    ALL: applications.length,
    PENDING: applications.filter((a) => a.status === "PENDING").length,
    REVIEWING: applications.filter((a) => a.status === "REVIEWING").length,
    ACCEPTED: applications.filter((a) => a.status === "ACCEPTED").length,
    REJECTED: applications.filter((a) => a.status === "REJECTED").length,
  };

  const filteredApplications =
    filter === "ALL"
      ? applications
      : applications.filter((application) => application.status === filter);

  const statusStyles = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-100",
    REVIEWING: "bg-blue-50 text-blue-700 border-blue-100",
    ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    REJECTED: "bg-red-50 text-red-700 border-red-100",
  };

  const formatStatus = (status) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />
        <p className="text-sm font-medium text-slate-500">
          Loading applicant information...
        </p>
      </div>
    );
  }

  if (error && applications.length === 0) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
        <AlertCircle className="mb-3 h-7 w-7 text-red-600" />
        <h3 className="font-semibold text-red-800">
          Unable to load applications
        </h3>
        <p className="mt-1 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* HEADER */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-700">
          <Users size={17} />
          Talent Acquisition
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Applications Received
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Review candidates, evaluate their applications and manage your
          recruitment process from one place.
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Total</p>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
              <Users size={20} />
            </div>
          </div>
          <h3 className="mt-4 text-3xl font-bold text-slate-900">
            {counts.ALL}
          </h3>
          <p className="mt-1 text-xs text-slate-500">All applications</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Pending</p>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
              <Clock3 size={20} />
            </div>
          </div>
          <h3 className="mt-4 text-3xl font-bold text-slate-900">
            {counts.PENDING}
          </h3>
          <p className="mt-1 text-xs text-slate-500">Awaiting review</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Reviewing</p>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
              <Eye size={20} />
            </div>
          </div>
          <h3 className="mt-4 text-3xl font-bold text-slate-900">
            {counts.REVIEWING}
          </h3>
          <p className="mt-1 text-xs text-slate-500">Under consideration</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Accepted</p>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <h3 className="mt-4 text-3xl font-bold text-slate-900">
            {counts.ACCEPTED}
          </h3>
          <p className="mt-1 text-xs text-slate-500">Successful candidates</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Rejected</p>
            <div className="rounded-xl bg-red-50 p-2.5 text-red-700">
              <XCircle size={20} />
            </div>
          </div>
          <h3 className="mt-4 text-3xl font-bold text-slate-900">
            {counts.REJECTED}
          </h3>
          <p className="mt-1 text-xs text-slate-500">Unsuccessful candidates</p>
        </div>
      </div>

      {/* FEEDBACK */}
      {message && (
        <div
          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          role="status"
        >
          <CheckCircle2 size={19} />
          {message}
        </div>
      )}

      {error && (
        <div
          className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          <AlertCircle size={19} />
          {error}
        </div>
      )}

      {/* APPLICATION LIST HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Candidate Applications
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Select a status to filter and manage candidates.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {["ALL", "PENDING", "REVIEWING", "ACCEPTED", "REJECTED"].map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  filter === status
                    ? "bg-blue-700 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"
                }`}
              >
                {status === "ALL" ? "All" : formatStatus(status)}
                <span className="ml-1.5 opacity-80">({counts[status]})</span>
              </button>
            ),
          )}
        </div>
      </div>

      {/* APPLICATION CARDS */}
      {filteredApplications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <FileText size={30} />
          </div>

          <h3 className="mt-5 text-lg font-bold text-slate-900">
            {applications.length === 0
              ? "No applications received yet"
              : "No applications in this category"}
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            {applications.length === 0
              ? "When candidates apply for your opportunities, their applications will appear here."
              : "Try selecting another status to see more applications."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <article
              key={application.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-6"
            >
              {/* APPLICANT DETAILS */}
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                    <UserRound size={23} />
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      {application.applicant_name}
                    </h4>

                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <BriefcaseBusiness size={15} />
                      {application.opportunity_title}
                    </p>

                    <p className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                      <CalendarDays size={14} />
                      Applied on:{" "}
                      {new Date(application.applied_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <span
                  className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    statusStyles[application.status] ||
                    "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {formatStatus(application.status)}
                </span>
              </div>

              {/* COVER LETTER */}
              <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
                <div className="mb-3 flex items-center gap-2">
                  <FileText size={17} className="text-blue-700" />
                  <h5 className="text-sm font-bold text-slate-800">
                    Cover Letter
                  </h5>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {application.cover_letter || "No cover letter provided."}
                </p>
              </div>

              {/* STATUS MANAGEMENT */}
              <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Manage Application
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Update this candidate's recruitment status.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    id={`status-${application.id}`}
                    aria-label={`Status for ${application.applicant_name}`}
                    value={application.status}
                    disabled={updatingId === application.id}
                    onChange={(event) =>
                      handleStatusChange(application.id, event.target.value)
                    }
                    className="min-w-[160px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:opacity-50"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="REVIEWING">Reviewing</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>

                  {updatingId === application.id && (
                    <span className="flex items-center gap-2 text-xs font-medium text-blue-700">
                      <RefreshCw size={14} className="animate-spin" />
                      Updating...
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
