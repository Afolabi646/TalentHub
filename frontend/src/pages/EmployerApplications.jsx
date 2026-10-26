import { useEffect, useState } from "react";

export default function EmployerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Please log in to view applications.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/applications/employer/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

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
      const response = await fetch(
        `http://127.0.0.1:8000/api/applications/${applicationId}/status/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

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

  if (loading) {
    return <p className="p-6">Loading applications...</p>;
  }

  if (error && applications.length === 0) {
    return (
      <p className="p-6 text-red-600" role="alert">
        {error}
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">
        Applications Received
      </h2>

      <p className="mt-2 text-slate-600">
        Review applicants for your opportunities and update their status.
      </p>

      {message && (
        <p className="mt-4 text-sm text-green-700" role="status">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {applications.length === 0 ? (
        <p className="mt-6 rounded-xl bg-white p-6 text-slate-600 shadow-sm">
          You have not received any applications yet.
        </p>
      ) : (
        <div className="mt-6 space-y-5">
          {applications.map((application) => (
            <article
              key={application.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-900">
                {application.applicant_name}
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Opportunity: {application.opportunity_title}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Applied on:{" "}
                {new Date(application.applied_at).toLocaleDateString()}
              </p>

              <div className="mt-4">
                <h4 className="font-semibold text-slate-800">Cover Letter</h4>

                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                  {application.cover_letter || "No cover letter provided."}
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <label
                  htmlFor={`status-${application.id}`}
                  className="text-sm font-semibold text-slate-700"
                >
                  Application Status
                </label>

                <select
                  id={`status-${application.id}`}
                  value={application.status}
                  disabled={updatingId === application.id}
                  onChange={(event) =>
                    handleStatusChange(application.id, event.target.value)
                  }
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="PENDING">Pending</option>
                  <option value="REVIEWING">Reviewing</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>

                {updatingId === application.id && (
                  <span className="text-sm text-slate-500">Updating...</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
