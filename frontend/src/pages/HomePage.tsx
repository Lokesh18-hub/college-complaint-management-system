import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Users,
  ArrowRight,
  Sparkles,
  Lock,
  GraduationCap,
  Building2,
  Wrench,
  Zap,
  Droplets,
  Home,
  Bus,
  Shield,
  BookOpen,
  PhoneCall,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import MoltenMetal from '../components/ui/MoltenMetal';

export const HomePage: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  const departments = [
    { name: 'IT & Network Systems', icon: Zap, count: 'Wi-Fi, Lab Systems, Portal' },
    { name: 'Electrical Works', icon: Zap, count: 'Power, Lighting, AC Units' },
    { name: 'Plumbing & Sanitation', icon: Droplets, count: 'Water supply, Washrooms' },
    { name: 'Hostel Administration', icon: Home, count: 'Rooms, Mess, Amenities' },
    { name: 'Facility Maintenance', icon: Wrench, count: 'Carpentry, Desks, Doors' },
    { name: 'Campus Security', icon: Shield, count: 'CCTV, Parking, Access' },
    { name: 'Transport & Fleet', icon: Bus, count: 'Shuttles, Routes, Passes' },
    { name: 'Central Library', icon: BookOpen, count: 'Study halls, Book loans' },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Official Campus Alert Ticker - Positioned cleanly below floating navbar */}
      <div className="px-4 sm:px-6 max-w-6xl mx-auto w-full pt-1 pb-3 z-20">
        <div className="rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg hover:border-white/20 transition-all">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-400/30 tracking-wide uppercase">
              CAMPUS ADVISORY
            </span>
            <span className="text-slate-300 text-xs font-medium truncate">
              Standard SLA for critical incidents is under 4 hours. Maintenance crews are active 24/7.
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Emergency: <strong className="text-white font-bold">ext. 222</strong></span>
            <span className="hidden sm:inline">IT Helpdesk: <strong className="text-white font-bold">ext. 104</strong></span>
          </div>
        </div>
      </div>

      {/* Hero Section with Dynamic MoltenMetal Canvas */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-12 lg:py-20 px-4 sm:px-6">
        {/* MoltenMetal Background Layer */}
        <div className="absolute inset-0 z-0 opacity-70 pointer-events-auto">
          <MoltenMetal
            color1="#1E3A8A"
            color2="#3B82F6"
            color3="#BAE6FD"
            backgroundColor="#0B1120"
            speed={0.25}
            scale={3.5}
            detail={3}
            glow={1.4}
            coreSize={0.08}
            swirl={0.8}
            fold={-0.2}
            blackPoint={0.08}
            brightness={1.15}
            colorMode="molten"
            grain={true}
            grainIntensity={0.04}
            mouseInteraction={true}
            mouseStrength={0.25}
            opacity={0.7}
          />
          {/* Subtle gradient vignette to blend into surrounding layout */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950 pointer-events-none" />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md shadow-xs">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            Official Campus Grievance & Facility Portal
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight drop-shadow-sm">
            Transparent, Accountable <br />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Campus Problem Resolution
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed drop-shadow-xs">
            Report infrastructure, IT, electrical, or hostel disruptions directly to college maintenance teams. Receive a transparent sequential tracking code and verify resolution when completed.
          </p>

          {/* Role Access Cards with Glassmorphism */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-6 text-left">
            {/* Student Portal Card */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/15 hover:border-blue-400/60 transition-all backdrop-blur-md shadow-lg group">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Student Portal</h3>
              <p className="text-xs text-slate-300 mt-1 mb-4">
                Submit complaints, attach photo evidence, track live technician dispatch, and confirm ticket closure.
              </p>
              {isAuthenticated && role === 'STUDENT' ? (
                <Link to="/student/dashboard">
                  <Button size="sm" className="w-full font-bold shadow-md shadow-blue-500/20">
                    Go to Student Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-500/25">
                    Student Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Admin Portal Card */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/15 hover:border-purple-400/60 transition-all backdrop-blur-md shadow-lg group">
              <div className="w-10 h-10 rounded-xl bg-purple-600/30 text-purple-400 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors border border-purple-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Administration & Staff</h3>
              <p className="text-xs text-slate-300 mt-1 mb-4">
                Monitor live incident queue, delegate complaints to departments, manage staff, and audit SLA reports.
              </p>
              {isAuthenticated && role === 'ADMIN' ? (
                <Link to="/admin/dashboard">
                  <Button size="sm" className="w-full font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/20">
                    Go to Admin Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md shadow-purple-500/25">
                    Staff & Admin Access
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Verified Metrics Counter */}
      <section id="stats" className="bg-white border-b border-slate-200/90 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 border-r border-slate-100 last:border-none">
            <p className="text-3xl font-extrabold text-slate-900 font-mono">98.4%</p>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Resolution Rate</p>
          </div>
          <div className="p-4 border-r border-slate-100 last:border-none">
            <p className="text-3xl font-extrabold text-blue-600 font-mono">&lt; 4.2h</p>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Avg. First Response</p>
          </div>
          <div className="p-4 border-r border-slate-100 last:border-none">
            <p className="text-3xl font-extrabold text-slate-900 font-mono">10</p>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Active Departments</p>
          </div>
          <div className="p-4">
            <p className="text-3xl font-extrabold text-emerald-600 font-mono">100%</p>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Audit Accountability</p>
          </div>
        </div>
      </section>

      {/* How It Works Pipeline */}
      <section id="workflow" className="py-16 bg-slate-50 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              A Transparent, 4-Step Resolution Cycle
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Every complaint is assigned a permanent tracking ID and monitored until student confirmation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle space-y-3 relative">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                STEP 01
              </span>
              <h3 className="font-bold text-slate-900 text-base">File Grievance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provide issue description, location details, urgency level, and optional photo evidence.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle space-y-3 relative">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                STEP 02
              </span>
              <h3 className="font-bold text-slate-900 text-base">Triage & Dispatch</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Administration assigns the issue to the relevant department and designates specialized crew.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle space-y-3 relative">
              <span className="font-mono text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                STEP 03
              </span>
              <h3 className="font-bold text-slate-900 text-base">On-Site Rectification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Technicians perform repairs on site and log timestamped updates directly to your ticket timeline.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle space-y-3 relative">
              <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                STEP 04
              </span>
              <h3 className="font-bold text-slate-900 text-base">Student Closure</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspect the completed repair and verify resolution. No ticket is marked CLOSED without your satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Departments Covered */}
      <section id="departments" className="py-16 bg-white px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Functional Campus Departments
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Coordinated services covering all academic, residential, and recreational facilities
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {departments.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.name}
                  className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:shadow-card hover:border-slate-300 transition-all space-y-2.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{d.name}</h4>
                  <p className="text-xs text-slate-500">{d.count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
