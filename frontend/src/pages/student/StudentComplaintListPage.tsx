import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  PlusCircle,
  Filter,
  ArrowUpDown,
  ArrowRight,
  RefreshCw,
  Search,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import { Complaint, Pagination as PaginationType } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { SearchInput } from '../../components/ui/SearchInput';
import { Button } from '../../components/ui/Button';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { CopyButton } from '../../components/ui/CopyButton';

export const StudentComplaintListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'ALL';

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [priority, setPriority] = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  const statusTabs = [
    { label: 'All Grievances', value: 'ALL' },
    { label: 'Under Review', value: 'UNDER_REVIEW' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Resolved', value: 'RESOLVED' },
    { label: 'Closed', value: 'CLOSED' },
  ];

  const fetchComplaints = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await complaintService.getComplaints({
        search,
        status: status === 'ALL' ? undefined : status,
        priority: priority === 'ALL' ? undefined : priority,
        category: category === 'ALL' ? undefined : category,
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
  }, [search, status, priority, category, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleResetFilters = () => {
    setSearch('');
    setStatus('ALL');
    setPriority('ALL');
    setCategory('ALL');
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
            My Grievances & Complaints
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor and track all issue tickets you have filed across campus facilities
          </p>
        </div>
        <Link to="/student/complaints/new">
          <Button
            leftIcon={<PlusCircle className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-sm shadow-blue-500/20 font-bold"
          >
            Lodge New Grievance
          </Button>
        </Link>
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

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search by ticket ID (e.g. CMP-0001), keyword, or location..."
            className="flex-1"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <select
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                setPage(1);
              }}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="CRITICAL">Critical Urgency</option>
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
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-blue-500 col-span-2 sm:col-span-1"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="updatedAt-desc">Recently Updated</option>
            </select>
          </div>
        </div>

        {(search || status !== 'ALL' || priority !== 'ALL' || category !== 'ALL') && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="font-medium">Active filters applied ({pagination.total} results)</span>
            <button
              onClick={handleResetFilters}
              className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
        {isLoading ? (
          <LoadingSpinner size="md" text="Loading grievances..." />
        ) : complaints.length === 0 ? (
          <EmptyState
            title="No grievances match your search"
            description="Try changing your filters or submit a new grievance ticket."
            actionText="Submit Grievance"
            onAction={() => (window.location.href = '/student/complaints/new')}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Ticket ID</th>
                    <th className="py-3.5 px-4">Title & Location</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Assigned Department</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Last Activity</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <span className="text-blue-600 font-bold">{c.complaintNumber}</span>
                          <CopyButton text={c.complaintNumber} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <Link
                          to={`/student/complaints/${c.id}`}
                          className="font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                        >
                          {c.title}
                        </Link>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{c.location}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                        {c.category}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {c.department ? (
                          <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {c.department.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Pending Assignment</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <PriorityBadge priority={c.priority} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={c.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(c.updatedAt || c.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          to={`/student/complaints/${c.id}`}
                          className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          Details <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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
