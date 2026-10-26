import { useEffect, useState } from "react";

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

  if (loading) {
    return <p className="text-slate-600">Loading your applications...</p>;
  }

  if (error) {
    return (
      <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">
        {error}
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">My Applications</h2>

      <p className="mt-2 text-slate-600">
        Track the jobs and internships you've applied for.
      </p>

      {applications.length === 0 ? (
        <p className="mt-6 rounded-xl bg-slate-50 p-5 text-slate-600">
          You haven't applied for any opportunities yet.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {applications.map((application) => (
            <article
              key={application.id}
              className="rounded-xl border border-slate-200 p-5"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {application.opportunity_title}
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Applied on:{" "}
                {new Date(application.applied_at).toLocaleDateString()}
              </p>

              <p className="mt-3 text-sm text-slate-600">
                Status:{" "}
                <span className="font-semibold text-blue-700">
                  {application.status}
                </span>
              </p>

              {application.cover_letter && (
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                  {application.cover_letter}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
