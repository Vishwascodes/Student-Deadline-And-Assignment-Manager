import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiPlus,
  FiBookOpen,
  FiArrowRight,
} from 'react-icons/fi';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { DeadlineBadge, PriorityBadge } from '../components/Badges';
import { StatusPieChart, PriorityBarChart } from '../components/Charts';
import { getDeadlineInfo, formatDate } from '../utils/dateUtils';
import useAuth from '../hooks/useAuth';
import assignmentService from '../services/assignmentService';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await assignmentService.getStats();
        setStats(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <Loader fullScreen={false} size="lg" />
      </DashboardLayout>
    );
  }

  const greeting = () => {
    const hour = now.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <DashboardLayout>
      <div className="animate-fadeIn">
        {/* Welcome header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {greeting()}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {' • '}
              {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/assignments" className="btn-primary">
              <FiPlus size={16} /> New Assignment
            </Link>
            <Link to="/subjects" className="btn-secondary">
              <FiBookOpen size={16} /> Add Subject
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={FiFileText} label="Total Assignments" value={stats.total} color="indigo" delay={0} />
          <StatCard icon={FiClock} label="Pending" value={stats.pending} color="amber" delay={50} />
          <StatCard icon={FiCheckCircle} label="Completed" value={stats.completed} color="green" delay={100} />
          <StatCard icon={FiAlertCircle} label="Overdue" value={stats.overdue} color="red" delay={150} />
        </div>

        {/* Charts + Progress */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="card p-5 lg:col-span-1">
            <h2 className="mb-2 text-sm font-semibold text-gray-700">Status Breakdown</h2>
            {stats.total > 0 ? (
              <StatusPieChart completed={stats.completed} pending={stats.pending} inProgress={stats.inProgress} />
            ) : (
              <p className="py-16 text-center text-sm text-gray-400">No data yet</p>
            )}
          </div>

          <div className="card p-5 lg:col-span-1">
            <h2 className="mb-2 text-sm font-semibold text-gray-700">Priority Distribution</h2>
            {stats.total > 0 ? (
              <PriorityBarChart priorityBreakdown={stats.priorityBreakdown} />
            ) : (
              <p className="py-16 text-center text-sm text-gray-400">No data yet</p>
            )}
          </div>

          <div className="card flex flex-col items-center justify-center gap-3 p-5 text-center lg:col-span-1">
            <h2 className="text-sm font-semibold text-gray-700">Completion Rate</h2>
            <div className="relative flex h-36 w-36 items-center justify-center">
              <svg className="h-full w-full -rotate-90">
                <circle cx="72" cy="72" r="60" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="#4f46e5"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={2 * Math.PI * 60 * (1 - stats.completionPercentage / 100)}
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
              </svg>
              <span className="absolute text-2xl font-bold text-gray-900">{stats.completionPercentage}%</span>
            </div>
            <p className="text-xs text-gray-500">
              {stats.completed} of {stats.total} assignments completed
            </p>
          </div>
        </div>

        {/* Upcoming + Recent */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">Upcoming Deadlines</h2>
              <Link to="/assignments" className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700">
                View all <FiArrowRight size={12} />
              </Link>
            </div>
            {stats.upcomingDeadlines.length === 0 ? (
              <EmptyState
                icon={FiCheckCircle}
                title="All caught up!"
                message="No upcoming deadlines right now."
              />
            ) : (
              <div className="space-y-2.5">
                {stats.upcomingDeadlines.map((a) => {
                  const deadline = getDeadlineInfo(a.dueDate, a.status);
                  return (
                    <div
                      key={a._id}
                      onClick={() => navigate('/assignments')}
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 p-3 transition-colors hover:bg-gray-50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">{a.title}</p>
                        <p className="text-xs text-gray-400">{a.subject?.name}</p>
                      </div>
                      <DeadlineBadge label={deadline.label} level={deadline.level} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">Recent Assignments</h2>
              <Link to="/assignments" className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700">
                View all <FiArrowRight size={12} />
              </Link>
            </div>
            {stats.recentAssignments.length === 0 ? (
              <EmptyState
                icon={FiFileText}
                title="No assignments yet"
                message="Create your first assignment to get started."
              />
            ) : (
              <div className="space-y-2.5">
                {stats.recentAssignments.map((a) => (
                  <div
                    key={a._id}
                    onClick={() => navigate('/assignments')}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 p-3 transition-colors hover:bg-gray-50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-800">{a.title}</p>
                      <p className="text-xs text-gray-400">
                        {a.subject?.name} • {formatDate(a.dueDate)}
                      </p>
                    </div>
                    <PriorityBadge priority={a.priority} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
