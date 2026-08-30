import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Building2,
  User,
  Clock,
  CheckCircle,
  FileText,
  Send,
  UserCheck,
  ShieldAlert,
  Edit3,
  CheckCircle2,
  ExternalLink,
  Phone,
  Mail,
  GraduationCap,
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import { departmentService } from '../../services/departmentService';
import { staffService } from '../../services/staffService';
import { Complaint, Department, Staff, Status, Priority } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

export const AdminComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Administrative actions state
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [assignComment, setAssignComment] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState<Status>('SUBMITTED');
  const [statusComment, setStatusComment] = useState<string>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [selectedPriority, setSelectedPriority] = useState<Priority>('MEDIUM');
  const [isUpdatingPriority, setIsUpdatingPriority] = useState(false);

  // Resolution modal
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionDetails, setResolutionDetails] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  // Comment state
  const [adminComment, setAdminComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  const fetchComplaintAndMetadata = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const [compRes, deptRes] = await Promise.all([
        complaintService.getComplaintById(id),
        departmentService.getAll(),
      ]);

      setComplaint(compRes);
      setDepartments(deptRes);

      setSelectedDeptId(compRes.departmentId || '');
      setSelectedStaffId(compRes.assignedStaffId || '');
      setSelectedStatus(compRes.status);
      setSelectedPriority(compRes.priority);

      if (compRes.departmentId) {
        const staffRes = await staffService.getAll(compRes.departmentId);
        setStaffList(staffRes);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load complaint details');
      navigate('/admin/complaints');
    } finally {
      setIsLoading(false);
    }
  }, [id, toast, navigate]);

  useEffect(() => {
    fetchComplaintAndMetadata();
  }, [fetchComplaintAndMetadata]);

  // Handle department change to fetch relevant staff
  const handleDepartmentChange = async (deptId: string) => {
    setSelectedDeptId(deptId);
    setSelectedStaffId('');
    if (deptId) {
      const staffRes = await staffService.getAll(deptId);
      setStaffList(staffRes);
    } else {
      setStaffList([]);
    }
  };

  const handleSaveAssignment = async () => {
    if (!id) return;
    try {
      setIsAssigning(true);
      const updated = await complaintService.assignComplaint(
        id,
        selectedDeptId || null,
        selectedStaffId || null,
        assignComment.trim() || undefined
      );
      setComplaint(updated);
      setSelectedStatus(updated.status);
      setAssignComment('');
      toast.success('Department and staff assigned successfully!');
      fetchComplaintAndMetadata();
    } catch (error: any) {
      toast.error(error.message || 'Assignment failed');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!id) return;
    if (selectedStatus === 'RESOLVED') {
      setShowResolveModal(true);
      return;
    }
    try {
      setIsUpdatingStatus(true);
      const updated = await complaintService.updateStatus(
        id,
        selectedStatus,
        statusComment.trim() || undefined
      );
      setComplaint(updated);
      setStatusComment('');
      toast.success(`Status updated to ${selectedStatus}`);
      fetchComplaintAndMetadata();
    } catch (error: any) {
      toast.error(error.message || 'Status update failed');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleUpdatePriority = async () => {
    if (!id) return;
    try {
      setIsUpdatingPriority(true);
      const updated = await complaintService.updatePriority(id, selectedPriority);
      setComplaint(updated);
      toast.success(`Priority updated to ${selectedPriority}`);
      fetchComplaintAndMetadata();
    } catch (error: any) {
      toast.error(error.message || 'Priority update failed');
    } finally {
      setIsUpdatingPriority(false);
    }
  };

  const handleResolveSubmit = async () => {
    if (!id || !resolutionDetails.trim()) {
      toast.error('Please enter the resolution details.');
      return;
    }
    try {
      setIsResolving(true);
      const updated = await complaintService.resolveComplaint(id, resolutionDetails.trim());
      setComplaint(updated);
      setSelectedStatus('RESOLVED');
      setShowResolveModal(false);
      setResolutionDetails('');
      toast.success('Complaint officially marked as RESOLVED!');
      fetchComplaintAndMetadata();
    } catch (error: any) {
      toast.error(error.message || 'Resolution failed');
    } finally {
      setIsResolving(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !adminComment.trim()) return;
    try {
      setIsPostingComment(true);
      await complaintService.addComment(id, adminComment.trim());
      setAdminComment('');
      toast.success('Admin comment logged to timeline');
      fetchComplaintAndMetadata();
    } catch (error: any) {
      toast.error(error.message || 'Comment posting failed');
    } finally {
      setIsPostingComment(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading complaint workspace..." />;
  }

  if (!complaint) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top back button */}
      <div>
        <Link
          to="/admin/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Master Queue
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono font-extrabold text-blue-600 text-sm bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                {complaint.complaintNumber}
              </span>
              <PriorityBadge priority={complaint.priority} />
              <StatusBadge status={complaint.status} />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {complaint.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {complaint.status !== 'RESOLVED' && complaint.status !== 'CLOSED' && (
              <Button
                variant="success"
                onClick={() => setShowResolveModal(true)}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                className="shadow-sm shadow-emerald-600/20 font-bold"
              >
                Resolve Complaint
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Management Controls & Student Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Admin Assignment Control Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <UserCheck className="w-4 h-4 text-blue-600" />
              Dispatch & Assignment
            </h3>

            <div className="space-y-3">
              <Select
                label="Assign Department"
                value={selectedDeptId}
                onChange={(e) => handleDepartmentChange(e.target.value)}
              >
                <option value="">-- Select Department --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Select>

              <Select
                label="Assign Staff Member"
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                disabled={!selectedDeptId}
              >
                <option value="">-- Select Staff Member --</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.email})
                  </option>
                ))}
              </Select>

              <Input
                label="Assignment Note (Optional)"
                placeholder="Instructions for department crew..."
                value={assignComment}
                onChange={(e) => setAssignComment(e.target.value)}
              />

              <Button
                size="sm"
                className="w-full"
                isLoading={isAssigning}
                onClick={handleSaveAssignment}
              >
                Update Assignment
              </Button>
            </div>
          </div>

          {/* Status & Priority Controls Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldAlert className="w-4 h-4 text-purple-600" />
              Status & Priority Hub
            </h3>

            <div className="space-y-3">
              <Select
                label="Lifecycle Status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as Status)}
              >
                <option value="SUBMITTED">SUBMITTED</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </Select>

              <Input
                label="Status Transition Comment"
                placeholder="Reason or update details..."
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
              />

              <Button
                size="sm"
                variant="outline"
                className="w-full"
                isLoading={isUpdatingStatus}
                onClick={handleUpdateStatus}
              >
                Transition Status
              </Button>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <Select
                  label="Urgency / Priority"
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as Priority)}
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </Select>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  isLoading={isUpdatingPriority}
                  onClick={handleUpdatePriority}
                >
                  Update Priority
                </Button>
              </div>
            </div>
          </div>

          {/* Student Profile Information Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              Student Filer Information
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Name:</span>
                <span className="font-bold text-slate-900">{complaint.student?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Student Roll No:</span>
                <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {complaint.student?.studentId || 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="text-slate-800 font-medium">{complaint.student?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="text-slate-800 font-medium">{complaint.student?.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Course & Year:</span>
                <span className="text-slate-800 font-medium">
                  {complaint.student?.course} ({complaint.student?.year})
                </span>
              </div>
              {complaint.student?.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="text-slate-800 font-medium">{complaint.student.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Ticket Overview & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resolution Card if already recorded */}
          {complaint.resolutionDetails && (
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Resolution Details
                </span>
                {complaint.resolvedAt && (
                  <span className="text-xs text-emerald-700">
                    {new Date(complaint.resolvedAt).toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed whitespace-pre-line bg-white/70 p-3.5 rounded-xl border border-emerald-200/50">
                {complaint.resolutionDetails}
              </p>
              {complaint.resolvedBy && (
                <p className="text-[11px] text-emerald-700 font-semibold">
                  Resolved by: {complaint.resolvedBy}
                </p>
              )}
            </div>
          )}

          {/* Description & Location */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Incident Overview</h3>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 font-medium block">Category</span>
                <span className="font-bold text-slate-800">{complaint.category}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Location</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {complaint.location}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1.5">
                Detailed Problem Description
              </span>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                {complaint.description}
              </p>
            </div>

            {/* Attachments */}
            {complaint.attachments && complaint.attachments.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Attached Photo Evidence
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {complaint.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {att.fileName}
                        </span>
                        <a
                          href={att.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> View
                        </a>
                      </div>
                      {att.fileType.includes('image') && (
                        <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 max-h-40">
                          <img
                            src={att.fileUrl}
                            alt={att.fileName}
                            className="w-full h-auto object-cover max-h-40"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timeline & Admin Update Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Official Audit Timeline
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {complaint.updates?.map((up) => {
                const isAdmin = up.user?.role === 'ADMIN';
                return (
                  <div key={up.id} className="relative">
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-xs ${
                        isAdmin ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>

                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">
                            {up.user?.name || 'Admin'}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                              isAdmin
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {isAdmin ? 'Admin' : 'Student'}
                          </span>
                          {up.status && <StatusBadge status={up.status} size="sm" />}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(up.createdAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{up.comment}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Admin Update */}
            <form onSubmit={handleAddComment} className="pt-4 border-t border-slate-100 space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Post Internal / Student Visible Update
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder="Record an inspection update or message student..."
                  className="flex-1 text-xs bg-white border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                />
                <Button
                  type="submit"
                  size="sm"
                  isLoading={isPostingComment}
                  disabled={!adminComment.trim()}
                  rightIcon={<Send className="w-3.5 h-3.5" />}
                >
                  Post
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* RESOLUTION MODAL */}
      <Modal
        isOpen={showResolveModal}
        onClose={() => setShowResolveModal(false)}
        title="Resolve Grievance & Notify Student"
        subtitle={`Ticket #${complaint.complaintNumber}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Please document the specific actions taken by the maintenance/IT crew to resolve this issue. This will be presented to the student for confirmation.
          </p>

          <Textarea
            label="Resolution Details & Actions Taken"
            placeholder="e.g. Electrical wiring inspected, burnt MCB contactor replaced, and lab power restored..."
            value={resolutionDetails}
            onChange={(e) => setResolutionDetails(e.target.value)}
            rows={4}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowResolveModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="success"
              isLoading={isResolving}
              onClick={handleResolveSubmit}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm Resolution
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
