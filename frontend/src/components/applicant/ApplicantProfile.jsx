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
    "mt-2.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

  const labelStyle = "block text-sm font-bold text-slate-800";

  if (loading) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />
        <p className="text-sm font-medium text-slate-500">
          Loading your professional profile...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      {/* PAGE INTRODUCTION */}
      <section>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
          YOUR PROFESSIONAL IDENTITY
        </p>

        <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
              Present your professional identity. Share your skills, experience
              and achievements with potential employers.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Profile management
          </div>
        </div>
      </section>

      {/* PROFILE BANNER */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-400" />

        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-3xl text-blue-700">
            ◉
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Build your professional presence
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              A well-presented profile helps employers understand your
              capabilities and professional background.
            </p>
          </div>
        </div>
      </section>

      {/* PROFILE FORM */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-700">
              ✎
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Professional Information
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Update the information employers need to know.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7 p-6 sm:p-8">
          {/* STATUS MESSAGE */}
          {message && (
            <div
              role="status"
              className={`flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${
                error
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              <span className="font-bold">{error ? "!" : "✓"}</span>
              {message}
            </div>
          )}

          {/* ABOUT */}
          <div>
            <label htmlFor="bio" className={labelStyle}>
              About You
            </label>

            <p className="mt-1 text-xs text-slate-500">
              Introduce yourself and highlight your professional interests.
            </p>

            <textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={5}
              className={inputStyle}
              placeholder="Tell employers about yourself, your interests and what makes you a valuable candidate..."
            />
          </div>

          <div className="border-t border-slate-100" />

          {/* SKILLS */}
          <div>
            <label htmlFor="skills" className={labelStyle}>
              Skills & Expertise
            </label>

            <p className="mt-1 text-xs text-slate-500">
              List the technical and professional skills you have developed.
            </p>

            <input
              id="skills"
              type="text"
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              className={inputStyle}
              placeholder="Python, React, Django, JavaScript..."
            />

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <span>ⓘ</span>
              Separate each skill with a comma.
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* EXPERIENCE */}
          <div>
            <label htmlFor="experience" className={labelStyle}>
              Work Experience
            </label>

            <p className="mt-1 text-xs text-slate-500">
              Describe your previous roles, projects and achievements.
            </p>

            <textarea
              id="experience"
              name="experience"
              value={profile.experience}
              onChange={handleChange}
              rows={6}
              className={inputStyle}
              placeholder="Describe your work experience, responsibilities, projects and notable achievements..."
            />
          </div>

          <div className="border-t border-slate-100" />

          {/* PORTFOLIO */}
          <div>
            <label htmlFor="portfolio_url" className={labelStyle}>
              Portfolio Website
            </label>

            <p className="mt-1 text-xs text-slate-500">
              Give employers a link to explore your work.
            </p>

            <div className="relative mt-2.5">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                ↗
              </span>

              <input
                id="portfolio_url"
                type="url"
                name="portfolio_url"
                value={profile.portfolio_url}
                onChange={handleChange}
                className={`${inputStyle} mt-0 pl-11`}
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-400">
              Remember to save your changes after updating your information.
            </p>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-700/15 transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving Changes...
                </>
              ) : (
                "Save Changes →"
              )}
            </button>
          </div>
        </form>
      </section>

      {/* FOOTER NOTE */}
      <p className="pb-3 text-center text-xs leading-6 text-slate-400">
        Your professional information helps employers understand your
        qualifications and experience.
      </p>
    </div>
  );
}

export default ApplicantProfile;
