import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Inbox,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { StudentDashboardData } from '../../types';
import { StatsCard } from '../../components/ui/StatsCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { CopyButton } from '../../components/ui/CopyButton';
import { useAuth } from '../../context/AuthContext';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await dashboardService.getStudentDashboard();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading your dashboard..." />;
  }

  const kpis = data?.kpis || {
    total: 0,
    submitted: 0,
    underReview: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-card">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                Student Portal
              </span>
              {user?.department && (
                <span className="hidden sm:inline-block px-2.5 py-1 bg-black/20 rounded-full text-xs text-blue-200">
                  {user.department}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Student'} 👋
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Report campus infrastructure grievances, track live technician dispatch, and review resolution progress across departments.
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-3">
            <Link to="/student/complaints/new">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg shadow-black/15"
                leftIcon={<PlusCircle className="w-5 h-5 text-blue-600" />}
              >
                Lodge Grievance
              </Button>
            </Link>
          </div>
        </div>

        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-48 h-48 rounded-full bg-indigo-500/20 blur-xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Lodged"
          value={kpis.total}
          icon={<FileText className="w-5 h-5" />}
          color="slate"
          description="All time grievances"
          onClick={() => navigate('/student/complaints')}
        />
        <StatsCard
          title="In Pipeline"
          value={kpis.inProgress + kpis.assigned + kpis.underReview}
          icon={<Clock className="w-5 h-5" />}
          color="blue"
          description={`${kpis.inProgress} active repair, ${kpis.assigned} assigned`}
          onClick={() => navigate('/student/complaints?status=IN_PROGRESS')}
        />
        <StatsCard
          title="Resolved"
          value={kpis.resolved}
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="emerald"
          description="Ready for your verification"
          onClick={() => navigate('/student/complaints?status=RESOLVED')}
        />
        <StatsCard
          title="Completed / Closed"
          value={kpis.closed}
          icon={<TrendingUp className="w-5 h-5" />}
          color="indigo"
          description="Fully satisfied"
          onClick={() => navigate('/student/complaints?status=CLOSED')}
        />
      </div>

      {/* Recent Complaints Table */}
      <Card>
        <CardHeader
          title="Recent Grievances"
          subtitle="Latest updates and technician notes on your reported issues"
          action={
            <Link
              to="/student/complaints"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
            >
              View Full History ({kpis.total}){' '}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          }
        />
        <CardContent className="p-0">
          {!data?.recentComplaints || data.recentComplaints.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-800">No active complaints found</p>
              <p className="text-xs text-slate-400 mt-1 mb-5">
                Notice an issue with Wi-Fi, electricity, lab fixtures, or hostel rooms?
              </p>
              <Link to="/student/complaints/new">
                <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                  Submit Your First Grievance
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Tracking Code</th>
                    <th className="py-3 px-4">Complaint Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Filed On</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.recentComplaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <span className="text-blue-600">{c.complaintNumber}</span>
                          <CopyButton text={c.complaintNumber} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                        {c.title}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{c.category}</td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {c.department?.name || <span className="text-slate-400 italic">Unassigned</span>}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <PriorityBadge priority={c.priority} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={c.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          to={`/student/complaints/${c.id}`}
                          className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors"
                        >
                          View <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
