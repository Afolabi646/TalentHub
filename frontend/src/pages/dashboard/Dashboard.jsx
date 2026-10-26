import { useState } from "react";
import ApplicantProfile from "../../components/applicant/ApplicantProfile";
import CreateOpportunity from "../CreateOpportunity";
import Opportunities from "../Opportunities";
import SavedOpportunities from "../SavedOpportunities";
import MyOpportunities from "../MyOpportunities";
import MyApplications from "../MyApplications";
import EmployerApplications from "../EmployerApplications";
import JobMatches from "../JobMatches";


export default function Dashboard({ user, onLogout }) {
  const isEmployer = user?.role === "EMPLOYER";
  const [showProfile, setShowProfile] = useState(
    sessionStorage.getItem("dashboardPage") === "profile",
  );

  const [showMyOpportunities, setShowMyOpportunities] = useState(
    sessionStorage.getItem("dashboardPage") === "myOpportunities",
  );

  const [showEmployerApplications, setShowEmployerApplications] = useState(
    sessionStorage.getItem("dashboardPage") === "employerApplications",
  );

  const [showOpportunities, setShowOpportunities] = useState(
    sessionStorage.getItem("dashboardPage") === "opportunities",
  );

  const [showSavedOpportunities, setShowSavedOpportunities] = useState(
    sessionStorage.getItem("dashboardPage") === "savedOpportunities",
  );

  const [showMyApplications, setShowMyApplications] = useState(
    sessionStorage.getItem("dashboardPage") === "myApplications",
  );

  const [showJobMatches, setShowJobMatches] = useState(
    sessionStorage.getItem("dashboardPage") === "jobMatches",
  );

  const [showCreateOpportunity, setShowCreateOpportunity] = useState(
    sessionStorage.getItem("dashboardPage") === "createOpportunity",
  );

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
        {!isEmployer && showJobMatches ? (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem("dashboardPage", "dashboard");
                setShowJobMatches(false);
              }}
              className="mb-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              ← Back to Dashboard
            </button>

            <JobMatches />
          </div>
        ) : isEmployer && showEmployerApplications ? (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem("dashboardPage", "dashboard");
                setShowEmployerApplications(false);
              }}
              className="mb-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              ← Back to Dashboard
            </button>

            <EmployerApplications />
          </div>
        ) : isEmployer && showMyOpportunities ? (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem("dashboardPage", "dashboard");
                setShowMyOpportunities(false);
              }}
              className="mb-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              ← Back to Dashboard
            </button>

            <MyOpportunities />
          </div>
        ) : isEmployer && showCreateOpportunity ? (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <CreateOpportunity
              onBack={() => {
                sessionStorage.setItem("dashboardPage", "dashboard");
                setShowCreateOpportunity(false);
              }}
              onCreated={() => {}}
            />
          </div>
        ) : !isEmployer && showMyApplications ? (
          <div>
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem("dashboardPage", "dashboard");
                setShowMyApplications(false);
              }}
              className="mb-6 rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300"
            >
              ← Back to Dashboard
            </button>

            <MyApplications />
          </div>
        ) : !isEmployer && showSavedOpportunities ? (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem("dashboardPage", "dashboard");
                setShowSavedOpportunities(false);
              }}
              className="mb-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              ← Back to Dashboard
            </button>

            <SavedOpportunities />
          </div>
        ) : !isEmployer && showOpportunities ? (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem("dashboardPage", "dashboard");
                setShowOpportunities(false);
              }}
              className="mb-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              ← Back to Dashboard
            </button>

            <Opportunities />
          </div>
        ) : !isEmployer && showProfile ? (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem("dashboardPage", "dashboard");
                setShowProfile(false);
              }}
              className="mb-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              ← Back to Dashboard
            </button>

            <ApplicantProfile />
          </div>
        ) : (
          <>
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
                      onClick={() => {
                        sessionStorage.setItem(
                          "dashboardPage",
                          "createOpportunity",
                        );
                        setShowCreateOpportunity(true);
                      }}
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
                      Review applications, read cover letters, and update
                      applicant status.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        sessionStorage.setItem(
                          "dashboardPage",
                          "employerApplications",
                        );
                        setShowCreateOpportunity(false);
                        setShowMyOpportunities(false);
                        setShowEmployerApplications(true);
                      }}
                      className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                    >
                      View Applications
                    </button>
                  </div>

                  <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800">
                      My Opportunities
                    </h3>

                    <p className="mt-2 text-slate-600">
                      View and manage the jobs and internships you have posted.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        sessionStorage.setItem(
                          "dashboardPage",
                          "myOpportunities",
                        );
                        setShowCreateOpportunity(false);
                        setShowMyOpportunities(true);
                      }}
                      className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                    >
                      View My Opportunities
                    </button>
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
                      onClick={() => {
                        sessionStorage.setItem(
                          "dashboardPage",
                          "opportunities",
                        );
                        setShowProfile(false);
                        setShowOpportunities(true);
                      }}
                      className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                    >
                      Browse Opportunities
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sessionStorage.setItem("dashboardPage", "jobMatches");
                        setShowProfile(false);
                        setShowOpportunities(false);
                        setShowSavedOpportunities(false);
                        setShowMyApplications(false);
                        setShowJobMatches(true);
                      }}
                      className="mt-3 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                    >
                      Find My Job Matches
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sessionStorage.setItem(
                          "dashboardPage",
                          "savedOpportunities",
                        );
                        setShowOpportunities(false);
                        setShowProfile(false);
                        setShowSavedOpportunities(true);
                      }}
                      className="mt-3 rounded-lg border border-blue-600 px-5 py-3 font-medium text-blue-600 hover:bg-blue-50"
                    >
                      Saved Opportunities
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sessionStorage.setItem("dashboardPage", "profile");
                        setShowOpportunities(false);
                        setShowProfile(true);
                      }}
                      className="mt-3 rounded-lg border border-blue-600 px-5 py-3 font-medium text-blue-600 hover:bg-blue-50"
                    >
                      Edit Applicant Profile
                    </button>
                  </div>

                  <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">
                      My Applications
                    </h3>

                    <p className="mt-2 text-sm text-slate-600">
                      Keep track of the opportunities you apply for.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        sessionStorage.setItem(
                          "dashboardPage",
                          "myApplications",
                        );
                        setShowMyApplications(true);
                        setShowProfile(false);
                        setShowOpportunities(false);
                        setShowSavedOpportunities(false);
                      }}
                      className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      View My Applications
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
