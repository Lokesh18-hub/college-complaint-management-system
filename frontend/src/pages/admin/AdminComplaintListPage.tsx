import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowUpDown,
  Building2,
  Users,
  Eye,
  SlidersHorizontal,
  RotateCcw,
  X,
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import { departmentService } from '../../services/departmentService';
import { Complaint, Department, Pagination as PaginationType } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { SearchInput } from '../../components/ui/SearchInput';
import { Pagination } from '../../components/ui/Pagination';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { CopyButton } from '../../components/ui/CopyButton';

export const AdminComplaintListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'ALL';
  const initialPriority = searchParams.get('priority') || 'ALL';

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [priority, setPriority] = useState(initialPriority);
  const [category, setCategory] = useState('ALL');
  const [departmentId, setDepartmentId] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  const statusTabs = [
    { label: 'All Master Tickets', value: 'ALL' },
    { label: 'New Submitted', value: 'SUBMITTED' },
    { label: 'Under Review', value: 'UNDER_REVIEW' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Resolved', value: 'RESOLVED' },
    { label: 'Closed', value: 'CLOSED' },
  ];

  // Fetch departments for filter
  useEffect(() => {
    departmentService.getAll().then(setDepartments).catch(console.error);
  }, []);

  const fetchComplaints = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await complaintService.getComplaints({
        search,
        status: status === 'ALL' ? undefined : status,
        priority: priority === 'ALL' ? undefined : priority,
        category: category === 'ALL' ? undefined : category,
        departmentId: departmentId === 'ALL' ? undefined : departmentId,
        sortBy,
        sortOrder,
        page,
        limit: 10,
      });
      setComplaints(res.complaints);
      setPagination(res.pagination);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [search, status, priority, category, departmentId, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleResetFilters = () => {
    setSearch('');
    setStatus('ALL');
    setPriority('ALL');
    setCategory('ALL');
    setDepartmentId('ALL');
    setPage(1);
    setSearchParams({});
  };

  const handleTabChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
    if (newStatus === 'ALL') {
      setSearchParams({});
    } else {
      setSearchParams({ status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Master Complaint Queue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full view of all student complaints across college departments with assignment and resolution tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 bg-white rounded-xl text-slate-700 border border-slate-200 shadow-2xs">
            Total Tickets: <strong className="text-blue-600 font-mono">{pagination.total}</strong>
          </span>
        </div>
      </div>

      {/* Quick Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              status === tab.value
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/90'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-subtle space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search by ticket ID, student name, roll number, or keyword..."
            className="flex-1"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <select
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                setPage(1);
              }}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>

            <select
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value);
                setPage(1);
              }}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="ALL">All Categories</option>
              <option value="IT Services">IT Services</option>
              <option value="Facility Maintenance">Facility Maintenance</option>
              <option value="Electrical Department">Electrical</option>
              <option value="Plumbing & Sanitation">Plumbing</option>
              <option value="Hostel Administration">Hostel</option>
              <option value="Transport & Logistics">Transport</option>
              <option value="Housekeeping & Hygiene">Housekeeping</option>
              <option value="Library & Learning Resources">Library</option>
              <option value="Campus Security">Security</option>
              <option value="Student Affairs & Academics">Academics</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [f, o] = e.target.value.split('-');
                setSortBy(f);
                setSortOrder(o as 'asc' | 'desc');
                setPage(1);
              }}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="updatedAt-desc">Recently Updated</option>
            </select>
          </div>
        </div>

        {(search || status !== 'ALL' || priority !== 'ALL' || category !== 'ALL' || departmentId !== 'ALL') && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="font-medium">Filtered results active ({pagination.total} complaints)</span>
            <button
              onClick={handleResetFilters}
              className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {isLoading ? (
          <LoadingSpinner size="md" text="Fetching complaint queue..." />
        ) : complaints.length === 0 ? (
          <EmptyState
            title="No matching complaints in queue"
            description="Try changing your search parameters or reset all filters."
            actionText="Reset All Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Ticket</th>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Title & Location</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Department & Staff</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <span className="text-blue-600">{c.complaintNumber}</span>
                          <CopyButton text={c.complaintNumber} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{c.student?.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {c.student?.studentId} • {c.student?.department}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <Link
                          to={`/admin/complaints/${c.id}`}
                          className="font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                        >
                          {c.title}
                        </Link>
                        <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                          {c.location}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                        {c.category}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {c.department ? (
                          <div>
                            <span className="font-bold text-slate-800">
                              {c.department.name}
                            </span>
                            {c.assignedStaff && (
                              <span className="text-[10px] text-slate-400 block font-medium">
                                Tech: {c.assignedStaff.name}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-amber-700 font-bold text-[10px] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
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
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                        {new Date(c.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          to={`/admin/complaints/${c.id}`}
                          className="inline-flex items-center gap-1 font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-xl transition-all shadow-2xs text-xs"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-100 px-4 py-2">
              <Pagination
                pagination={pagination}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
