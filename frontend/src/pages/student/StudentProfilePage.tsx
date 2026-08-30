import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User as UserIcon, Mail, Phone, GraduationCap, Building2, BookOpen, Save, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  course: z.string().min(1, 'Course is required'),
  year: z.string().min(1, 'Year is required'),
  semester: z.string().min(1, 'Semester is required'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const StudentProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      department: user?.department || 'Computer Science',
      course: user?.course || 'B.Tech CSE',
      year: user?.year || '1st Year',
      semester: user?.semester || '1st Sem',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSaving(true);
      const updated = await authService.updateProfile(data);
      updateUser(updated);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Profile
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review your enrolled academic details and contact preferences
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {/* Profile Banner */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-8 text-white flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-extrabold text-2xl border border-white/30 text-white">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-blue-200 text-xs mt-0.5">{user?.email}</p>
            {user?.studentId && (
              <span className="inline-block mt-2 font-mono text-[11px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
                ID: {user.studentId}
              </span>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              error={errors.name?.message}
              required
              {...register('name')}
            />

            <Input
              label="Student ID (Permanent)"
              value={user?.studentId || 'N/A'}
              disabled
              helperText="Assigned by registrar office"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              value={user?.email || ''}
              disabled
              leftIcon={<Mail className="w-4 h-4" />}
              helperText="College email identifier"
            />

            <Input
              label="Phone Number"
              placeholder="+91 98765 43210"
              leftIcon={<Phone className="w-4 h-4" />}
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Department" error={errors.department?.message} required {...register('department')}>
              <option value="Computer Science">Computer Science & Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Business Administration">Business Administration (MBA/BBA)</option>
              <option value="Basic Sciences & Humanities">Basic Sciences & Humanities</option>
            </Select>

            <Input
              label="Course / Degree"
              placeholder="e.g. B.Tech CSE"
              leftIcon={<BookOpen className="w-4 h-4" />}
              error={errors.course?.message}
              required
              {...register('course')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Year of Study" error={errors.year?.message} required {...register('year')}>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </Select>

            <Select label="Semester" error={errors.semester?.message} required {...register('semester')}>
              <option value="1st Sem">1st Sem</option>
              <option value="2nd Sem">2nd Sem</option>
              <option value="3rd Sem">3rd Sem</option>
              <option value="4th Sem">4th Sem</option>
              <option value="5th Sem">5th Sem</option>
              <option value="6th Sem">6th Sem</option>
              <option value="7th Sem">7th Sem</option>
              <option value="8th Sem">8th Sem</option>
            </Select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={async () => {
                await logout();
                window.location.href = '/login';
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
            >
              Sign Out of Account
            </button>

            <Button
              type="submit"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
