import { useEffect, useState } from "react";

function SavedOpportunities() {
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const fetchSavedOpportunities = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("Please log in to view your saved opportunities.");
        setLoading(false);
        return;
      }

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
          throw new Error("Could not load saved opportunities.");
        }

        const data = await response.json();
        setSavedOpportunities(data.results ?? data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedOpportunities();
  }, []);

  const handleRemove = async (opportunityId) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Please log in to remove saved opportunities.");
      return;
    }

    setRemovingId(opportunityId);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/opportunities/saved/${opportunityId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || "Could not remove this saved opportunity.",
        );
      }

      setSavedOpportunities((current) =>
        current.filter((item) => item.opportunity.id !== opportunityId),
      );

      alert("Opportunity removed from saved opportunities.");
    } catch (error) {
      alert(error.message);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return <p className="p-6 text-center">Loading saved opportunities...</p>;
  }

  if (error) {
    return <p className="p-6 text-center text-red-600">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Saved Opportunities
        </h1>

        <p className="mb-6 text-gray-600">
          Keep track of jobs and internships you want to apply for.
        </p>

        {savedOpportunities.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <h2 className="mb-2 text-xl font-semibold text-gray-800">
              No saved opportunities yet
            </h2>
            <p className="text-gray-600">
              Browse opportunities and save the ones that interest you.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {savedOpportunities.map((item) => {
              const opportunity = item.opportunity;

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {opportunity.title}
                    </h2>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                      {opportunity.category}
                    </span>
                  </div>

                  <p className="mb-2 font-medium text-gray-700">
                    {opportunity.organization}
                  </p>

                  <p className="mb-2 text-sm text-gray-600">
                    Location: {opportunity.location || "Not specified"}
                  </p>

                  <p className="mb-4 text-sm text-gray-600">
                    Deadline: {opportunity.deadline || "Not specified"}
                  </p>

                  <p className="mb-5 text-gray-700">
                    {opportunity.description}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {opportunity.application_link && (
                      <a
                        href={opportunity.application_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                      >
                        Apply Now
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemove(opportunity.id)}
                      disabled={removingId === opportunity.id}
                      className="rounded-lg border border-red-600 px-4 py-2 font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {removingId === opportunity.id
                        ? "Removing..."
                        : "Remove from Saved"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedOpportunities;
