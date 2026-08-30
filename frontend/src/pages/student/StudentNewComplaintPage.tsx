import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FileText,
  MapPin,
  Tag,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Droplets,
  Wifi,
  Fan,
  Layers,
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import { UploadResult } from '../../services/uploadService';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { FileUploader } from '../../components/ui/FileUploader';
import { Modal } from '../../components/ui/Modal';
import { CopyButton } from '../../components/ui/CopyButton';

const newComplaintSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  category: z.string().min(1, 'Please select a category'),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location is too long'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  description: z
    .string()
    .min(15, 'Please provide a detailed description (at least 15 characters)')
    .max(2000, 'Description is too long'),
});

type NewComplaintFormValues = z.infer<typeof newComplaintSchema>;

export const StudentNewComplaintPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [attachment, setAttachment] = useState<UploadResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<{
    id: string;
    complaintNumber: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewComplaintFormValues>({
    resolver: zodResolver(newComplaintSchema),
    defaultValues: {
      title: '',
      category: 'IT Services',
      location: '',
      priority: 'MEDIUM',
      description: '',
    },
  });

  const descriptionValue = watch('description');

  const quickTemplates = [
    { title: 'Wi-Fi connectivity dropped in Library 2nd floor', cat: 'IT Services', loc: 'Central Library, 2nd Floor', pri: 'MEDIUM' as const },
    { title: 'Ceiling fan making loud grinding noise', cat: 'Electrical Department', loc: 'Hostel Block B, Room 304', pri: 'LOW' as const },
    { title: 'Tap water leakage flooding chemistry lab sink', cat: 'Plumbing & Sanitation', loc: 'Science Block, Lab 201', pri: 'HIGH' as const },
    { title: 'AC unit not cooling in main lecture auditorium', cat: 'Facility Maintenance', loc: 'Main Auditorium', pri: 'MEDIUM' as const },
  ];

  const applyTemplate = (tpl: typeof quickTemplates[0]) => {
    setValue('title', tpl.title);
    setValue('category', tpl.cat);
    setValue('location', tpl.loc);
    setValue('priority', tpl.pri);
  };

  const onSubmit = async (data: NewComplaintFormValues) => {
    try {
      setIsSubmitting(true);
      const res = await complaintService.createComplaint({
        ...data,
        attachment: attachment || undefined,
      });

      toast.success(`Complaint #${res.complaintNumber} logged successfully!`);
      setSubmittedComplaint({
        id: res.id,
        complaintNumber: res.complaintNumber,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/student/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Grievances
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Lodge Campus Grievance
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Provide complete location and description so campus maintenance crews can quickly dispatch
        </p>
      </div>

      {/* Quick Templates Chip Bar */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 space-y-2">
        <p className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Quick-Fill Common Grievances:
        </p>
        <div className="flex flex-wrap gap-2">
          {quickTemplates.map((tpl, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applyTemplate(tpl)}
              className="text-[11px] font-semibold bg-white text-slate-700 hover:text-blue-700 hover:border-blue-300 border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition-all text-left truncate max-w-xs"
            >
              {tpl.title}
            </button>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Grievance Title"
            placeholder="e.g. Projector lamp burnt out in Seminar Room 204"
            error={errors.title?.message}
            required
            helperText="Summarize the issue in a clear, concise headline"
            {...register('title')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Issue Category"
              error={errors.category?.message}
              required
              {...register('category')}
            >
              <option value="IT Services">IT Services</option>
              <option value="Facility Maintenance">Facility Maintenance</option>
              <option value="Electrical Department">Electrical</option>
              <option value="Plumbing & Sanitation">Plumbing & Sanitation</option>
              <option value="Hostel Administration">Hostel Administration</option>
              <option value="Transport & Logistics">Transport & Logistics</option>
              <option value="Housekeeping & Hygiene">Housekeeping & Hygiene</option>
              <option value="Library & Learning Resources">Library</option>
              <option value="Campus Security">Campus Security</option>
              <option value="Student Affairs & Academics">Student Affairs</option>
              <option value="Other">Other / General</option>
            </Select>

            <Input
              label="Location / Room / Area"
              placeholder="e.g. Block B, 3rd Floor Lab"
              leftIcon={<MapPin className="w-4 h-4" />}
              error={errors.location?.message}
              required
              {...register('location')}
            />

            <Select
              label="Priority Level"
              error={errors.priority?.message}
              required
              {...register('priority')}
            >
              <option value="LOW">Low (Minor inconvenience)</option>
              <option value="MEDIUM">Medium (Standard attention)</option>
              <option value="HIGH">High (Urgent academic disruption)</option>
              <option value="CRITICAL">Critical (Safety hazard / blackout)</option>
            </Select>
          </div>

          <Textarea
            label="Detailed Description"
            placeholder="Describe what happened, the equipment affected, and when you first noticed the issue..."
            rows={5}
            maxLength={2000}
            showCount
            value={descriptionValue}
            error={errors.description?.message}
            required
            {...register('description')}
          />

          {/* Attachment upload */}
          <div>
            <label className="text-xs font-semibold text-slate-700 tracking-wide block mb-1.5">
              Photo / Document Evidence (Optional)
            </label>
            <FileUploader onUploadSuccess={(file) => setAttachment(file)} value={attachment} />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link to="/student/complaints">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="px-6 font-bold"
            >
              Submit Grievance Ticket
            </Button>
          </div>
        </form>
      </div>

      {/* Submission Success Modal */}
      <Modal
        isOpen={!!submittedComplaint}
        onClose={() => navigate('/student/complaints')}
        title="✓ Grievance Logged Successfully"
        size="md"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tracking Code</p>
            <div className="inline-flex items-center gap-2 mt-1">
              <h2 className="text-3xl font-extrabold text-blue-600 font-mono">
                {submittedComplaint?.complaintNumber}
              </h2>
              {submittedComplaint?.complaintNumber && (
                <CopyButton text={submittedComplaint.complaintNumber} />
              )}
            </div>
          </div>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            Your grievance has been assigned an audit tracking number and routed to the campus dispatch team.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to={`/student/complaints/${submittedComplaint?.id}`} className="w-full sm:w-auto">
              <Button className="w-full font-bold">View Audit Timeline</Button>
            </Link>
            <Link to="/student/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
};
