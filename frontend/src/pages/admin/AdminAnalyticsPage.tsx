import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { dashboardService } from '../../services/dashboardService';
import { AdminDashboardData } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { StatsCard } from '../../components/ui/StatsCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getAdminDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Generating real-time analytics reports..." />;
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

  const resolutionRate =
    kpis.total > 0
      ? Math.round(((kpis.resolved + kpis.closed) / kpis.total) * 100)
      : 0;

  const statusColors = ['#94a3b8', '#0ea5e9', '#8b5cf6', '#3b82f6', '#10b981', '#475569'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Campus Grievance Analytics & Intelligence
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time incident trends, resolution efficiency, and department workload distributions
        </p>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Overall Resolution Rate"
          value={`${resolutionRate}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="emerald"
          description={`${kpis.resolved + kpis.closed} of ${kpis.total} closed`}
        />
        <StatsCard
          title="In Pipeline"
          value={kpis.underReview + kpis.assigned + kpis.inProgress}
          icon={<Clock className="w-5 h-5" />}
          color="blue"
          description="Active workflow processing"
        />
        <StatsCard
          title="Critical Alerts"
          value={kpis.critical}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="rose"
          description="Urgent campus disruptions"
        />
        <StatsCard
          title="Staff Deployment"
          value={kpis.totalStaff}
          icon={<Layers className="w-5 h-5" />}
          color="indigo"
          description={`Across ${kpis.totalDepartments} departments`}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Workload Bar Chart */}
        <Card>
          <CardHeader
            title="Department Incident Workload"
            subtitle="Total complaints dispatched per department"
          />
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data?.departmentDistribution || []}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Priority Breakdown Bar Chart */}
        <Card>
          <CardHeader
            title="Urgency & Priority Distribution"
            subtitle="Categorized by student impact"
          />
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data?.priorityDistribution || []}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32}>
                    {data?.priorityDistribution?.map((entry, index) => (
                      <Cell key={`pcell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Lifecycle Chart */}
        <Card>
          <CardHeader
            title="Lifecycle Stage Breakdown"
            subtitle="Complaints in each workflow step"
          />
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.statusDistribution || []}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {data?.statusDistribution?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || statusColors[index % statusColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
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

        {/* Category Breakdown */}
        <Card>
          <CardHeader
            title="Complaints by Category"
            subtitle="Campus facility categories receiving reports"
          />
          <CardContent>
            <div className="h-72 w-full">
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
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
