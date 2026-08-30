import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock, Phone, GraduationCap, Building2, BookOpen, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  studentId: z.string().min(2, 'Student ID is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  department: z.string().min(1, 'Please select your department'),
  course: z.string().min(1, 'Please specify your course'),
  year: z.string().min(1, 'Please select your year'),
  semester: z.string().min(1, 'Please select your semester'),
  phone: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      year: '1st Year',
      semester: '1st Sem',
      department: 'Computer Science',
      course: 'B.Tech CSE',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      const res = await registerAuth(data);
      toast.success(`Account created! Welcome, ${res.user.name}`);
      navigate('/student/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-slate-200/90 shadow-card p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-3 border border-blue-100">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Registration
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Create an official student account to report problems and track resolution progress
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. Aarav Sharma"
              leftIcon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              required
              {...register('name')}
            />

            <Input
              label="Student ID / Roll No."
              placeholder="e.g. STU-2024-001"
              leftIcon={<GraduationCap className="w-4 h-4" />}
              error={errors.studentId?.message}
              required
              {...register('studentId')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="College Email"
              type="email"
              placeholder="student@college.edu"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              required
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min 6 characters"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              required
              {...register('password')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Department"
              error={errors.department?.message}
              required
              {...register('department')}
            >
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
              placeholder="e.g. B.Tech CSE, MBA, B.Sc"
              leftIcon={<BookOpen className="w-4 h-4" />}
              error={errors.course?.message}
              required
              {...register('course')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

            <Input
              label="Phone Number"
              placeholder="+91 98765 43210"
              leftIcon={<Phone className="w-4 h-4" />}
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full mt-4"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Complete Registration
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
