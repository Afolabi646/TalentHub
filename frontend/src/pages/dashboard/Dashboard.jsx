import { useState, useEffect, useRef } from "react";
import ApplicantProfile from "../../components/applicant/ApplicantProfile";
import CreateOpportunity from "../CreateOpportunity";
import Opportunities from "../Opportunities";
import SavedOpportunities from "../SavedOpportunities";
import MyOpportunities from "../MyOpportunities";
import MyApplications from "../MyApplications";
import EmployerApplications from "../EmployerApplications";
import JobMatches from "../JobMatches";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";


const STATUS_COLORS = {
  PENDING: "#F59E0B",
  REVIEWING: "#3B82F6",
  ACCEPTED: "#10B981",
  REJECTED: "#EF4444",
};

const STATUS_LABELS = {
  PENDING: "Pending",
  REVIEWING: "Reviewing",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

export default function Dashboard({ user, onLogout, onUserUpdate }) {
  const isEmployer = user?.role === "EMPLOYER";

  const fileInputRef = useRef(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [pictureMessage, setPictureMessage] = useState("");

  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState("");

  useEffect(() => {
    if (!isEmployer) return;

    async function fetchAnalytics() {
      setAnalyticsLoading(true);
      setAnalyticsError("");

      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch(
          "http://127.0.0.1:8000/api/applications/employer/analytics/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Could not load recruitment analytics.",
          );
        }

        setAnalytics(data);
      } catch (error) {
        setAnalyticsError(error.message);
      } finally {
        setAnalyticsLoading(false);
      }
    }

    fetchAnalytics();
  }, [isEmployer]);

  async function handlePictureChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPictureMessage("Please select a valid image.");
      return;
    }

    setUploadingPicture(true);
    setPictureMessage("");

    try {
      const formData = new FormData();
      formData.append("profile_picture", file);

      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch("http://127.0.0.1:8000/api/me/", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const updatedUser = await response.json();

      if (!response.ok) {
        throw new Error(
          updatedUser.profile_picture?.[0] ||
            updatedUser.detail ||
            "Could not upload your profile picture.",
        );
      }

      onUserUpdate?.(updatedUser);
      setPictureMessage("Profile picture updated successfully.");
    } catch (error) {
      setPictureMessage(error.message);
    } finally {
      setUploadingPicture(false);
      event.target.value = "";
    }
  }

  const [activePage, setActivePage] = useState(
    sessionStorage.getItem("dashboardPage") || "dashboard",
  );

  useEffect(() => {
    if (activePage !== "dashboard") {
      document.getElementById("dashboard-content")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activePage]);

  const firstName = user?.first_name || "User";

  const fullName =
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "User";

    const statusData = ["PENDING", "REVIEWING", "ACCEPTED", "REJECTED"].map(
      (status) => {
        const application = analytics?.application_statuses?.find(
          (item) => item.status === status,
        );

        return {
          status,
          name: STATUS_LABELS[status],
          count: application?.count ?? 0,
          color: STATUS_COLORS[status],
        };
      },
    );

    const totalStatusApplications = statusData.reduce(
      (total, item) => total + item.count,
      0,
    );

  const navigate = (page) => {
    sessionStorage.setItem("dashboardPage", page);
    setActivePage(page);
  };

  const navigation = isEmployer
    ? [
        { id: "dashboard", label: "Overview", icon: "⌂" },
        { id: "createOpportunity", label: "Post Opportunity", icon: "+" },
        { id: "myOpportunities", label: "My Opportunities", icon: "▤" },
        { id: "employerApplications", label: "Applications", icon: "▣" },
      ]
    : [
        { id: "dashboard", label: "Overview", icon: "⌂" },
        { id: "opportunities", label: "Find Opportunities", icon: "⌕" },
        { id: "jobMatches", label: "AI Job Matches", icon: "✧" },
        { id: "myApplications", label: "My Applications", icon: "▣" },
        { id: "savedOpportunities", label: "Saved Opportunities", icon: "♡" },
        { id: "profile", label: "My Profile", icon: "◉" },
      ];

  const pageTitles = {
    dashboard: "Overview",
    opportunities: "Find Opportunities",
    jobMatches: "AI Job Matches",
    myApplications: "My Applications",
    savedOpportunities: "Saved Opportunities",
    profile: "My Profile",
    createOpportunity: "Post Opportunity",
    myOpportunities: "My Opportunities",
    employerApplications: "Applications",
  };

  const renderPage = () => {
    if (activePage === "profile" && !isEmployer) {
      return <ApplicantProfile />;
    }

    if (activePage === "opportunities" && !isEmployer) {
      return <Opportunities />;
    }

    if (activePage === "jobMatches" && !isEmployer) {
      return <JobMatches user={user} />;
    }

    if (activePage === "myApplications" && !isEmployer) {
      return <MyApplications />;
    }

    if (activePage === "savedOpportunities" && !isEmployer) {
      return <SavedOpportunities />;
    }

    if (activePage === "createOpportunity" && isEmployer) {
      return (
        <CreateOpportunity
          onBack={() => navigate("dashboard")}
          onCreated={() => {}}
        />
      );
    }

    if (activePage === "myOpportunities" && isEmployer) {
      return <MyOpportunities />;
    }

    if (activePage === "employerApplications" && isEmployer) {
      return <EmployerApplications />;
    }

    return null;
  };

  return (
    <main className="min-h-screen bg-slate-50 lg:flex">
      {/* SIDEBAR */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePictureChange}
        className="hidden"
      />
      <aside className="flex w-full flex-col border-r border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:w-64">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-blue-700">
            AI TalentHub<span className="text-slate-900">.</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPicture}
            title="Change profile picture"
            className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-lg font-bold text-blue-700"
          >
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              firstName.charAt(0).toUpperCase()
            )}
          </button>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">
              {fullName}
            </p>
            <p className="text-xs text-slate-500">
              {isEmployer ? "Employer Account" : "Applicant Account"}
            </p>
          </div>
        </div>

        <nav className="grid grid-cols-2 gap-2 p-4 lg:flex lg:flex-1 lg:flex-col">
          <p className="col-span-2 mb-2 px-3 text-xs font-bold uppercase tracking-widest text-slate-400">
            Workspace
          </p>

          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.id)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                activePage === item.id
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <span>↗</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section className="min-w-0 flex-1 lg:ml-64">
        {/* TOP HEADER */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
          <div>
            <p className="text-xs font-medium text-slate-400">
              AI TALENTHUB / WORKSPACE
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              {pageTitles[activePage] || "Overview"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-slate-600 sm:block">
              {firstName}
            </span>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              {firstName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div
          id="dashboard-content"
          className="mx-auto max-w-7xl p-5 sm:p-8 scroll-mt-4"
        >
          {/* APPLICANT OVERVIEW */}
          {!isEmployer && activePage === "dashboard" && (
            <div className="space-y-9">
              {/* WELCOME HERO */}
              <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 p-7 text-white shadow-xl sm:p-10 lg:p-12">
                <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 right-1/4 -z-10 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />

                <div className="relative max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    APPLICANT WORKSPACE
                  </div>

                  <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                    Welcome back, {firstName}!
                  </h1>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
                    Your next career opportunity could be closer than you think.
                    Discover opportunities, explore AI-powered job matches and
                    take the next step in your professional journey.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => navigate("opportunities")}
                      className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                    >
                      Explore Opportunities →
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("profile")}
                      className="rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                      View My Profile
                    </button>
                  </div>
                </div>
              </section>

              {/* CAREER TOOLS */}
              <section>
                <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
                      YOUR WORKSPACE
                    </p>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                      Your Career Tools
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Everything you need to manage and grow your career.
                    </p>
                  </div>
                </div>

                {(() => {
                  const tools = [
                    {
                      title: "Find Opportunities",
                      description:
                        "Explore available jobs and internships that align with your career goals.",
                      action: "opportunities",
                      actionLabel: "Browse opportunities",
                      icon: "⌕",
                      color: "bg-blue-50 text-blue-700",
                    },
                    {
                      title: "AI Job Matches",
                      description:
                        "Discover opportunities matched to your skills and professional interests.",
                      action: "jobMatches",
                      actionLabel: "Explore job matches",
                      icon: "✧",
                      color: "bg-violet-50 text-violet-700",
                    },
                    {
                      title: "My Applications",
                      description:
                        "Keep track of opportunities you've applied for and their progress.",
                      action: "myApplications",
                      actionLabel: "Track applications",
                      icon: "▣",
                      color: "bg-emerald-50 text-emerald-700",
                    },
                    {
                      title: "Saved Opportunities",
                      description:
                        "Keep interesting opportunities organised so you can revisit them later.",
                      action: "savedOpportunities",
                      actionLabel: "View saved jobs",
                      icon: "♡",
                      color: "bg-rose-50 text-rose-700",
                    },
                    {
                      title: "My Profile",
                      description:
                        "Manage your professional information, skills, experience and portfolio.",
                      action: "profile",
                      actionLabel: "Manage profile",
                      icon: "◉",
                      color: "bg-amber-50 text-amber-700",
                    },
                  ];

                  return (
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {tools.map((tool) => (
                        <button
                          key={tool.action}
                          type="button"
                          onClick={() => navigate(tool.action)}
                          className="group flex min-h-64 flex-col rounded-2xl border border-slate-200/80 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
                        >
                          <div className="flex items-start justify-between">
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${tool.color}`}
                            >
                              {tool.icon}
                            </div>

                            <span className="text-lg text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-700">
                              →
                            </span>
                          </div>

                          <h3 className="mt-6 text-lg font-bold text-slate-900">
                            {tool.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {tool.description}
                          </p>

                          <p className="mt-auto pt-6 text-sm font-bold text-blue-700">
                            {tool.actionLabel} →
                          </p>
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </section>

              {/* PROFILE PROMPT */}
              <section className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-xl">
                    <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                      CAREER DEVELOPMENT
                    </div>

                    <h2 className="mt-4 text-xl font-extrabold text-slate-900 sm:text-2xl">
                      Make your professional profile stand out.
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Help employers understand your strengths. Keep your
                      skills, experience and portfolio information up to date.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("profile")}
                    className="shrink-0 rounded-xl bg-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-800"
                  >
                    Update My Profile →
                  </button>
                </div>
              </section>
            </div>
          )}
          {/* EMPLOYER OVERVIEW */}
          {isEmployer && activePage === "dashboard" && (
            <div className="space-y-8">
              {/* WELCOME HERO */}
              <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 p-7 text-white shadow-xl sm:p-10 lg:p-12">
                <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 right-1/4 -z-10 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />

                <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-200">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      EMPLOYER WORKSPACE
                    </div>

                    <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                      Welcome back, {firstName}!
                    </h1>

                    <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
                      Your next great hire could be just around the corner.
                      Manage your opportunities, review applicants and find the
                      right talent to grow your organisation.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => navigate("createOpportunity")}
                        className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                      >
                        + Post an Opportunity
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate("employerApplications")}
                        className="rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20"
                      >
                        Review Applications →
                      </button>
                    </div>
                  </div>

                  <div className="hidden h-36 w-36 shrink-0 items-center justify-center rounded-3xl border border-white/15 bg-white/10 lg:flex">
                    <span className="text-7xl">🏢</span>
                  </div>
                </div>
              </section>

              {/* RECRUITMENT ANALYTICS */}
              <section>
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
                    RECRUITMENT OVERVIEW
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                    Your Recruitment Analytics
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Monitor your recruitment activity and performance.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      title: "Active Opportunities",
                      description: "Currently published opportunities",
                      value: analytics?.active_opportunities ?? 0,
                      icon: "▤",
                      color: "bg-blue-50 text-blue-700",
                    },
                    {
                      title: "Total Applications",
                      description: "Applications received",
                      value: analytics?.total_applications ?? 0,
                      icon: "▣",
                      color: "bg-violet-50 text-violet-700",
                    },
                    {
                      title: "Job Post Views",
                      description: "People viewing your opportunities",
                      value: analytics?.total_views ?? 0,
                      icon: "◉",
                      color: "bg-emerald-50 text-emerald-700",
                    },
                    {
                      title: "Reviewed Applications",
                      description: "Applications with an updated status",
                      value: analytics?.reviewed_applications ?? 0,
                      icon: "✧",
                      color: "bg-amber-50 text-amber-700",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${item.color}`}
                        >
                          {item.icon}
                        </div>

                        <span className="text-xs font-semibold text-slate-400">
                          Analytics
                        </span>
                      </div>

                      <p className="mt-5 text-3xl font-extrabold text-slate-900">
                        {analyticsLoading ? "..." : item.value}
                      </p>

                      <h3 className="mt-2 text-sm font-bold text-slate-800">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* APPLICATION STATUS CHART */}
                <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900">
                      Application Status
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Overview of applications across different recruitment
                      stages.
                    </p>
                  </div>

                  {analyticsLoading ? (
                    <p className="py-12 text-center text-sm text-slate-500">
                      Loading application statistics...
                    </p>
                  ) : analytics && totalStatusApplications > 0 ? (
                    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
                      {/* DOUGHNUT CHART */}
                      <div className="relative h-64 w-full max-w-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={statusData}
                              dataKey="count"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={65}
                              outerRadius={95}
                              paddingAngle={3}
                              stroke="none"
                            >
                              {statusData.map((item) => (
                                <Cell key={item.status} fill={item.color} />
                              ))}
                            </Pie>

                            <Tooltip
                              formatter={(value, name) => [value, name]}
                            />
                          </PieChart>
                        </ResponsiveContainer>

                        {/* CHART CENTER */}
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-extrabold text-slate-900">
                            {totalStatusApplications}
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            Total Applications
                          </span>
                        </div>
                      </div>

                      {/* STATUS NUMBERS */}
                      <div className="w-full max-w-xs space-y-5">
                        {statusData.map((item) => (
                          <div
                            key={item.status}
                            className="flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm font-medium text-slate-600">
                                {item.name}
                              </span>
                            </div>

                            <span className="text-lg font-bold text-slate-900">
                              {item.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-sm font-semibold text-slate-700">
                        No applications yet
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        Application statistics will appear here when candidates
                        apply.
                      </p>
                    </div>
                  )}
                </div>

                {analyticsError && (
                  <p className="mt-3 text-sm text-red-600">{analyticsError}</p>
                )}

                {analyticsLoading && (
                  <p className="mt-3 text-sm text-slate-500">
                    Loading recruitment analytics...
                  </p>
                )}
              </section>

              {/* OPPORTUNITY VIEWS CHART */}
              <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    Opportunity Performance
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    See how many people are viewing each of your opportunities.
                  </p>
                </div>

                {analyticsLoading ? (
                  <p className="py-12 text-center text-sm text-slate-500">
                    Loading opportunity views...
                  </p>
                ) : analytics?.views_by_opportunity?.length > 0 ? (
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analytics.views_by_opportunity}
                        layout="vertical"
                        margin={{ top: 5, right: 25, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                          stroke="#E2E8F0"
                        />

                        <XAxis
                          type="number"
                          allowDecimals={false}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748B", fontSize: 12 }}
                        />

                        <YAxis
                          type="category"
                          dataKey="title"
                          width={140}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#475569", fontSize: 12 }}
                        />

                        <Tooltip
                          formatter={(value) => [
                            `${value} views`,
                            "Total Views",
                          ]}
                          cursor={{ fill: "#EFF6FF" }}
                        />

                        <Bar
                          dataKey="views_count"
                          fill="#2563EB"
                          radius={[0, 6, 6, 0]}
                          barSize={28}
                        >
                          <LabelList
                            dataKey="views_count"
                            position="right"
                            fill="#334155"
                            fontSize={13}
                            fontWeight={600}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-sm font-semibold text-slate-700">
                      No opportunity views yet
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Views will appear here as people visit your opportunities.
                    </p>
                  </div>
                )}
              </section>

              {/* RECRUITMENT WORKSPACE */}
              <section>
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
                    MANAGE YOUR BUSINESS
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                    Recruitment Workspace
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Everything you need to manage your hiring process.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {[
                    {
                      title: "Post an Opportunity",
                      description:
                        "Create and publish job openings or internships to attract talented applicants.",
                      action: "createOpportunity",
                      button: "Create Opportunity",
                      icon: "+",
                      color: "bg-blue-50 text-blue-700",
                    },
                    {
                      title: "My Opportunities",
                      description:
                        "View, edit, activate or manage the opportunities you've published.",
                      action: "myOpportunities",
                      button: "Manage Opportunities",
                      icon: "▤",
                      color: "bg-violet-50 text-violet-700",
                    },
                    {
                      title: "Manage Applications",
                      description:
                        "Review candidates, assess applications and update recruitment decisions.",
                      action: "employerApplications",
                      button: "Review Applicants",
                      icon: "▣",
                      color: "bg-emerald-50 text-emerald-700",
                    },
                  ].map((item) => (
                    <div
                      key={item.action}
                      className="group flex min-h-64 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${item.color}`}
                        >
                          {item.icon}
                        </div>

                        <span className="text-lg text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-700">
                          →
                        </span>
                      </div>

                      <h3 className="mt-6 text-lg font-bold text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>

                      <button
                        type="button"
                        onClick={() => navigate(item.action)}
                        className="mt-auto self-start rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
                      >
                        {item.button} →
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* HIRING TIP */}
              <section className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-xl">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                      HIRING INSIGHT
                    </span>

                    <h2 className="mt-4 text-xl font-extrabold text-slate-900">
                      Find the right talent for your organisation.
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Keep your opportunity descriptions clear and your
                      eligibility requirements specific. This helps candidates
                      understand your expectations before applying.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("myOpportunities")}
                    className="shrink-0 rounded-xl border border-blue-200 bg-white px-6 py-3.5 text-sm font-bold text-blue-800 transition hover:bg-blue-100"
                  >
                    View My Opportunities →
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* OTHER DASHBOARD PAGES */}
          {activePage !== "dashboard" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <button
                type="button"
                onClick={() => navigate("dashboard")}
                className="mb-6 text-sm font-semibold text-blue-700 hover:text-blue-900"
              >
                ← Back to Overview
              </button>

              {renderPage()}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
