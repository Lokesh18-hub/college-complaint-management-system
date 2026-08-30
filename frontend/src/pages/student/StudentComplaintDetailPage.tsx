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
  Download,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import { Complaint, Status } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { CopyButton } from '../../components/ui/CopyButton';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const StudentComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Close complaint state
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [closeFeedback, setCloseFeedback] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  const fetchComplaint = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const res = await complaintService.getComplaintById(id);
      setComplaint(res);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load complaint details');
      navigate('/student/complaints');
    } finally {
      setIsLoading(false);
    }
  }, [id, toast, navigate]);

  useEffect(() => {
    fetchComplaint();
  }, [fetchComplaint]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentText.trim()) return;

    try {
      setIsSubmittingComment(true);
      await complaintService.addComment(id, commentText.trim());
      setCommentText('');
      toast.success('Comment added to ticket timeline');
      fetchComplaint();
    } catch (error: any) {
      toast.error(error.message || 'Failed to post comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCloseComplaint = async () => {
    if (!id) return;
    try {
      setIsClosing(true);
      await complaintService.closeComplaint(id, closeFeedback.trim() || undefined);
      toast.success('Complaint confirmed and closed! Thank you.');
      setShowCloseModal(false);
      fetchComplaint();
    } catch (error: any) {
      toast.error(error.message || 'Failed to close complaint');
    } finally {
      setIsClosing(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading ticket details..." />;
  }

  if (!complaint) return null;

  // Lifecycle Progress Steps Calculation
  const lifecycleSteps = [
    { key: 'SUBMITTED', label: 'Submitted' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'RESOLVED', label: 'Resolved' },
    { key: 'CLOSED', label: 'Closed' },
  ];

  const getStepIndex = (st: Status) => {
    switch (st) {
      case 'SUBMITTED':
        return 0;
      case 'UNDER_REVIEW':
        return 1;
      case 'ASSIGNED':
      case 'IN_PROGRESS':
        return 2;
      case 'RESOLVED':
        return 3;
      case 'CLOSED':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(complaint.status);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/student/dashboard" className="hover:text-slate-900 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/student/complaints" className="hover:text-slate-900 transition-colors">
          Grievances
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-mono text-blue-600 font-bold">{complaint.complaintNumber}</span>
      </nav>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-lg">
                <span className="font-mono font-extrabold text-blue-700 text-sm">
                  {complaint.complaintNumber}
                </span>
                <CopyButton text={complaint.complaintNumber} />
              </div>
              <PriorityBadge priority={complaint.priority} />
              <StatusBadge status={complaint.status} />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {complaint.title}
            </h1>
          </div>

          {/* Close Complaint CTA if Resolved */}
          {complaint.status === 'RESOLVED' && (
            <Button
              onClick={() => setShowCloseModal(true)}
              variant="success"
              className="shadow-md shadow-emerald-600/20 font-bold"
              leftIcon={<CheckCircle2 className="w-5 h-5" />}
            >
              Verify & Close Complaint
            </Button>
          )}
        </div>

        {/* Visual Lifecycle Stepper */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="grid grid-cols-5 gap-2 text-center">
            {lifecycleSteps.map((step, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step.key} className="space-y-2">
                  <div className="relative flex items-center justify-center">
                    {/* Connecting line */}
                    {idx > 0 && (
                      <div
                        className={`absolute right-1/2 left-[-50%] top-1/2 -translate-y-1/2 h-0.5 ${
                          idx <= currentStepIdx ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      />
                    )}
                    <div
                      className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm'
                          : isPast
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isPast ? '✓' : idx + 1}
                    </div>
                  </div>
                  <span
                    className={`block text-[11px] font-bold ${
                      isCurrent
                        ? 'text-blue-600 font-extrabold'
                        : isPast
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RESOLUTION BANNER (If resolved or closed) */}
      {(complaint.status === 'RESOLVED' || complaint.status === 'CLOSED') &&
        complaint.resolutionDetails && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl flex-shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-emerald-950">
                    Official Department Resolution
                  </h3>
                  {complaint.resolvedAt && (
                    <span className="text-xs font-medium text-emerald-700">
                      Completed on{' '}
                      {new Date(complaint.resolvedAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
                <p className="text-sm text-emerald-900 leading-relaxed font-normal bg-white/70 p-4 rounded-xl border border-emerald-200/60 mt-2">
                  {complaint.resolutionDetails}
                </p>
                {complaint.resolvedBy && (
                  <p className="text-xs text-emerald-800 font-semibold pt-1">
                    Resolved by technician: {complaint.resolvedBy}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      {/* Main Grid: Details Left, Timeline Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Metadata & Attachments */}
        <div className="lg:col-span-1 space-y-6">
          {/* Ticket Information */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Incident Information
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                  Category
                </span>
                <span className="font-bold text-slate-800">{complaint.category}</span>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                  Location & Facility
                </span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {complaint.location}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                  Dispatched Department
                </span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {complaint.department?.name || (
                    <span className="text-slate-400 italic font-normal">Pending Assignment</span>
                  )}
                </span>
              </div>

              {complaint.assignedStaff && (
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                    Assigned Technician
                  </span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {complaint.assignedStaff.name}
                  </span>
                </div>
              )}

              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                  Submitted On
                </span>
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(complaint.createdAt).toLocaleString([], {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Student Issue Description</h3>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {complaint.description}
            </p>
          </div>

          {/* Attachments */}
          {complaint.attachments && complaint.attachments.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Attached Photo Evidence</h3>
              <div className="space-y-2.5">
                {complaint.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[180px]">
                        {att.fileName}
                      </span>
                      <a
                        href={att.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Full View
                      </a>
                    </div>
                    {att.fileType.includes('image') && (
                      <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 max-h-48">
                        <img
                          src={att.fileUrl}
                          alt={att.fileName}
                          className="w-full h-auto object-cover max-h-48"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Timeline and Updates */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
            <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Audit-Grade Resolution Timeline
            </h3>

            {/* Timeline Tree */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {complaint.updates?.map((up, idx) => {
                const isAdmin = up.user?.role === 'ADMIN';
                return (
                  <div key={up.id} className="relative group">
                    {/* Dot */}
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-xs ${
                        isAdmin ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>

                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">
                            {up.user?.name || 'System Auto-Log'}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isAdmin
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {isAdmin ? 'Administration' : 'Student'}
                          </span>
                          {up.status && <StatusBadge status={up.status} size="sm" />}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
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

            {/* Add Comment / Follow-up Input */}
            {complaint.status !== 'CLOSED' && (
              <form onSubmit={handleAddComment} className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                <label className="text-xs font-bold text-slate-800 block">
                  Add Note or Follow-Up Response to Maintenance Crew
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Type a message or response..."
                    className="flex-1 text-xs bg-white border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                  />
                  <Button
                    type="submit"
                    isLoading={isSubmittingComment}
                    disabled={!commentText.trim()}
                    size="sm"
                    rightIcon={<Send className="w-3.5 h-3.5" />}
                  >
                    Post Note
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Close Complaint Confirmation Modal */}
      <Modal
        isOpen={showCloseModal}
        onClose={() => setShowCloseModal(false)}
        title="Verify Resolution & Close Grievance"
        subtitle={`Ticket #${complaint.complaintNumber}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            By closing this ticket, you confirm that the maintenance work for{' '}
            <strong className="text-slate-900">{complaint.title}</strong> has been satisfactorily verified by you.
          </p>

          <Textarea
            label="Verification Feedback (Optional)"
            placeholder="Share feedback on technician conduct, quality of work, and resolution speed..."
            value={closeFeedback}
            onChange={(e) => setCloseFeedback(e.target.value)}
            rows={3}
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCloseModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="success"
              isLoading={isClosing}
              onClick={handleCloseComplaint}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm Closure
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
