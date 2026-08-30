import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail, GraduationCap, ShieldCheck, ArrowRight, Eye, EyeOff, Info, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const res = await login(data.email, data.password);
      toast.success(`Welcome back, ${res.user.name}!`);

      if (res.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (type: 'student' | 'priya' | 'admin') => {
    if (type === 'student') {
      setValue('email', 'student@college.edu');
      setValue('password', 'Student@123');
    } else if (type === 'priya') {
      setValue('email', 'priya.patel@student.college.edu');
      setValue('password', 'Student@123');
    } else {
      setValue('email', 'admin@college.edu');
      setValue('password', 'Admin@123');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/90 shadow-card p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-3 border border-blue-100 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to CCMS
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your campus grievances, resolutions, and management queue
          </p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="mb-6 p-3.5 bg-gradient-to-b from-slate-50 to-slate-100/70 border border-slate-200 rounded-xl">
          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider text-center mb-2.5 flex items-center justify-center gap-1.5">
            <span>⚡ 1-Click Demo Login</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('student')}
              title="Aarav Sharma - student@college.edu (Password: Student@123)"
              className="flex flex-col items-center justify-center gap-1 py-2 px-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-xs transition-all"
            >
              <GraduationCap className="w-4 h-4 text-blue-500" />
              <span>Student (Aarav)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('priya')}
              title="Priya Patel - priya.patel@student.college.edu (Password: Student@123)"
              className="flex flex-col items-center justify-center gap-1 py-2 px-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 hover:border-teal-500 hover:text-teal-600 hover:shadow-xs transition-all"
            >
              <UserCheck className="w-4 h-4 text-teal-500" />
              <span>Student (Priya)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              title="System Admin - admin@college.edu (Password: Admin@123)"
              className="flex flex-col items-center justify-center gap-1 py-2 px-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 hover:border-purple-500 hover:text-purple-600 hover:shadow-xs transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-purple-500" />
              <span>Demo Admin</span>
            </button>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 px-1">
            <span>Student Pass: <code className="font-mono font-bold text-slate-700 bg-white px-1 py-0.5 rounded border border-slate-200">Student@123</code></span>
            <span>Admin Pass: <code className="font-mono font-bold text-slate-700 bg-white px-1 py-0.5 rounded border border-slate-200">Admin@123</code></span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. student@college.edu"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors focus:outline-none"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            error={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full mt-2"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have a student account yet?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};
