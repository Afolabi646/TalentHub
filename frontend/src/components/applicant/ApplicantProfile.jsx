import { useEffect, useState } from "react";

function ApplicantProfile() {
  const [profile, setProfile] = useState({
    bio: "",
    skills: "",
    experience: "",
    portfolio_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setMessage("Please log in to view your profile.");
      setError(true);
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/applicant-profile/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Could not load your profile.");
        }

        return response.json();
      })
      .then((data) => {
        setProfile({
          bio: data.bio || "",
          skills: Array.isArray(data.skills)
            ? data.skills.join(", ")
            : data.skills || "",
          experience: data.experience || "",
          portfolio_url: data.portfolio_url || "",
        });
      })
      .catch((error) => {
        setMessage(error.message);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError(false);
    setSaving(true);

    const token = localStorage.getItem("accessToken");

    if (!token) {
      setMessage("Please log in first.");
      setError(true);
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/applicant-profile/",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profile),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Could not save your profile.");
      }

      setMessage("Your profile has been saved successfully!");
    } catch (error) {
      setMessage(error.message);
      setError(true);
    } finally {
      setSaving(false);
    }
  }

  const inputStyle =
    "mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-gray-500">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Your account
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Applicant Profile
          </h1>

          <p className="mt-3 max-w-xl leading-7 text-gray-500">
            Showcase your skills, experience, and achievements to help employers
            understand what you bring to the table.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Professional information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Keep your information accurate and up to date.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
            {message && (
              <div
                role="status"
                className={`rounded-xl border p-4 text-sm ${
                  error
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-green-200 bg-green-50 text-green-700"
                }`}
              >
                {message}
              </div>
            )}

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-semibold text-gray-800"
              >
                About you
              </label>
              <textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                className={inputStyle}
                placeholder="Introduce yourself and describe your professional interests..."
              />
            </div>

            <div>
              <label
                htmlFor="skills"
                className="block text-sm font-semibold text-gray-800"
              >
                Skills
              </label>
              <input
                id="skills"
                type="text"
                name="skills"
                value={profile.skills}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Python, React, Django"
              />
              <p className="mt-2 text-xs text-gray-500">
                Separate each skill with a comma.
              </p>
            </div>

            <div>
              <label
                htmlFor="experience"
                className="block text-sm font-semibold text-gray-800"
              >
                Work experience
              </label>
              <textarea
                id="experience"
                name="experience"
                value={profile.experience}
                onChange={handleChange}
                rows={4}
                className={inputStyle}
                placeholder="Describe your roles, projects, and achievements..."
              />
            </div>

            <div>
              <label
                htmlFor="portfolio_url"
                className="block text-sm font-semibold text-gray-800"
              >
                Portfolio URL
              </label>
              <input
                id="portfolio_url"
                type="url"
                name="portfolio_url"
                value={profile.portfolio_url}
                onChange={handleChange}
                className={inputStyle}
                placeholder="https://yourportfolio.com"
              />
              <p className="mt-2 text-xs text-gray-500">
                Add a link to your portfolio or personal website.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-gray-400">
          Your professional information helps employers learn about you.
        </p>
      </div>
    </div>
  );
}

export default ApplicantProfile;
