import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Users,
  Building2,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { dashboardService } from '../../services/dashboardService';
import { AdminDashboardData } from '../../types';
import { StatsCard } from '../../components/ui/StatsCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { CopyButton } from '../../components/ui/CopyButton';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await dashboardService.getAdminDashboard();
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
    return <LoadingSpinner size="lg" text="Loading administrative control center..." />;
  }

  const kpis = data?.kpis || {
    total: 0,
    submitted: 0,
    underReview: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    critical: 0,
    totalStudents: 0,
    totalStaff: 0,
    totalDepartments: 0,
  };

  const statusColors = ['#94a3b8', '#0ea5e9', '#8b5cf6', '#3b82f6', '#10b981', '#475569'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              <ShieldCheck className="w-3.5 h-3.5" /> Administrative Command Hub
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Grievance Operations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time incident dispatching, departmental allocation, and resolution performance analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/complaints"
            className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-500/25 flex items-center gap-2"
          >
            Manage Master Queue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Grievances"
          value={kpis.total}
          icon={<FileText className="w-5 h-5" />}
          color="slate"
          description="All time lodged issues"
          onClick={() => navigate('/admin/complaints')}
        />
        <StatsCard
          title="Active Dispatch"
          value={kpis.inProgress + kpis.assigned + kpis.underReview}
          icon={<Clock className="w-5 h-5" />}
          color="blue"
          description={`${kpis.assigned} assigned to specialists`}
          onClick={() => navigate('/admin/complaints?status=IN_PROGRESS')}
        />
        <StatsCard
          title="Critical Alerts"
          value={kpis.critical}
          icon={<AlertOctagon className="w-5 h-5 text-rose-600" />}
          color="rose"
          description="Urgent safety / facility hazards"
          onClick={() => navigate('/admin/complaints?priority=CRITICAL')}
        />
        <StatsCard
          title="Resolved & Verified"
          value={kpis.resolved + kpis.closed}
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="emerald"
          description={`${kpis.resolved} waiting student check`}
          onClick={() => navigate('/admin/complaints?status=RESOLVED')}
        />
      </div>

      {/* Campus Resource Snapshot Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Enrolled Students
            </span>
            <h4 className="text-xl font-extrabold text-slate-900">{kpis.totalStudents}</h4>
          </div>
        </div>

        <Link
          to="/admin/departments"
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex items-center justify-between gap-3.5 hover:border-purple-300 transition-colors group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Functional Departments
              </span>
              <h4 className="text-xl font-extrabold text-slate-900">{kpis.totalDepartments}</h4>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/admin/staff"
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex items-center justify-between gap-3.5 hover:border-amber-300 transition-colors group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Staff Specialists
              </span>
              <h4 className="text-xl font-extrabold text-slate-900">{kpis.totalStaff}</h4>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Donut */}
        <Card>
          <CardHeader
            title="Lifecycle Stage Breakdown"
            subtitle="Current active queue categorized by resolution phase"
          />
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.statusDistribution || []}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {data?.statusDistribution?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || statusColors[index % statusColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Complaints by Category Bar Chart */}
        <Card>
          <CardHeader
            title="Department Incident Workload"
            subtitle="Total tickets filed by facility category"
          />
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data?.categoryDistribution || []}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                    }}
                  />
                  <Bar dataKey="count" fill="#2563eb" radius={[0, 6, 6, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Complaints Live Queue */}
      <Card>
        <CardHeader
          title="Recent Complaints Live Queue"
          subtitle="Newest issues logged across campus facilities"
          action={
            <Link
              to="/admin/complaints"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
            >
              View Full Queue ({kpis.total}){' '}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          }
        />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Title & Location</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Department & Staff</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.recentComplaints?.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <span className="text-blue-600">{c.complaintNumber}</span>
                        <CopyButton text={c.complaintNumber} />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      <div>{c.student?.name}</div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {c.student?.studentId || 'ID: Registered'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 max-w-xs truncate">
                      <div>{c.title}</div>
                      <span className="text-[10px] text-slate-400 font-normal">{c.location}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap font-medium">
                      {c.category}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {c.department ? (
                        <div>
                          <span className="font-semibold text-slate-800">{c.department.name}</span>
                          {c.assignedStaff && (
                            <span className="text-slate-400 block text-[10px]">
                              Crew: {c.assignedStaff.name}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-amber-700 font-bold text-[11px] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={c.priority} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        to={`/admin/complaints/${c.id}`}
                        className="inline-flex items-center gap-1 font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition-colors shadow-2xs"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
