export default function Dashboard({ user, onLogout }) {
  const isEmployer = user?.role === "EMPLOYER";

  return (
    <main className="min-h-screen bg-slate-100">
      <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-blue-600">AI TalentHub</h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">
            {user?.first_name || "User"}
          </span>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-3xl font-bold text-slate-800">
          Welcome, {user?.first_name || "User"}!
        </h2>

        <p className="mt-2 text-slate-600">
          {isEmployer
            ? "Manage your opportunities and discover talented people."
            : "Discover jobs, internships, and new career opportunities."}
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {isEmployer ? (
            <>
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800">
                  Post an Opportunity
                </h3>
                <p className="mt-2 text-slate-600">
                  Share a job or internship with potential applicants.
                </p>
                <button
                  type="button"
                  className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                >
                  Create Opportunity
                </button>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800">
                  Manage Applicants
                </h3>
                <p className="mt-2 text-slate-600">
                  Review people interested in your opportunities.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800">
                  Find Opportunities
                </h3>
                <p className="mt-2 text-slate-600">
                  Explore jobs and internships that match your goals.
                </p>
                <button
                  type="button"
                  className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                >
                  Browse Opportunities
                </button>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800">
                  My Applications
                </h3>
                <p className="mt-2 text-slate-600">
                  Keep track of the opportunities you apply for.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
