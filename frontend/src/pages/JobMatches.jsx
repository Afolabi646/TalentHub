import { useEffect, useState } from "react";

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
    return <p className="p-6">Finding your best opportunities...</p>;
  }

  if (error) {
    return (
      <p className="p-6 text-red-600" role="alert">
        {error}
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Recommended for You</h2>

      <p className="mt-2 text-slate-600">
        Opportunities ranked by how closely their keywords match your profile.
      </p>

      {matches.length === 0 ? (
        <p className="mt-6 rounded-xl bg-white p-6 text-slate-600 shadow-sm">
          No active opportunities found. Complete your profile and check back
          when opportunities are available.
        </p>
      ) : (
        <div className="mt-6 space-y-5">
          {matches.map((opportunity) => (
            <article
              key={opportunity.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {opportunity.title}
                  </h3>

                  <p className="mt-1 text-slate-600">
                    {opportunity.organization}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {opportunity.location || "Location not specified"}
                    {" · "}
                    {opportunity.category}
                  </p>
                </div>

                <div className="self-start rounded-lg bg-blue-50 px-4 py-2">
                  <p className="text-xs font-medium text-blue-700">
                    Keyword match
                  </p>
                  <p className="text-xl font-bold text-blue-700">
                    {opportunity.match_score}%
                  </p>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {opportunity.description}
              </p>

              {opportunity.eligibility && (
                <p className="mt-3 text-sm text-slate-600">
                  <span className="font-semibold">Eligibility:</span>{" "}
                  {opportunity.eligibility}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
