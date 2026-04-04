"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { upsertProfile } from '@/app/actions/profile';

interface ProfileFormProps {
  initialData?: {
    display_name?: string;
    college?: string;
    branch?: string;
    year?: number;
    semester?: number;
    division?: string;
  };
  userName?: string;
}

export default function ProfileForm({ initialData, userName }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    display_name: initialData?.display_name || userName || '',
    college: initialData?.college || 'KBTCOE, Nashik',
    branch: initialData?.branch || '',
    year: initialData?.year || 2,
    semester: initialData?.semester || 3,
    division: initialData?.division || '',
  });

  // Auto-suggest semester based on year
  useEffect(() => {
    if (!initialData?.semester) {
      const suggestedSem = formData.year * 2 - 1; // Simplistic: Year 1 -> Sem 1, Year 2 -> Sem 3
      setFormData(prev => ({ ...prev, semester: suggestedSem }));
    }
  }, [formData.year, initialData?.semester]);

  const branches = [
    "Information Technology",
    "Computer Science",
    "ENTC",
    "Mechanical Engineering",
    "Civil Engineering"
  ];

  const years = [
    { label: "1st Year", value: 1 },
    { label: "2nd Year", value: 2 },
    { label: "3rd Year", value: 3 },
    { label: "4th Year", value: 4 }
  ];

  const divisions = ["A", "B", "C", "Skip"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'year' || name === 'semester' ? parseInt(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.branch) {
        setError("Please select your branch");
        return;
      }

      await upsertProfile(formData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl !p-10 shadow-[var(--shadow-float)] border border-[var(--border-light)]">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[var(--text)] tracking-tight">Complete Profile</h2>
          <p className="text-[var(--text-muted)] mt-2">Just a few more details to personalize your terminal.</p>
        </div>

        {error && (
          <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-xl px-4 py-3 text-sm text-[var(--accent)] font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Display Name */}
          <div className="md:col-span-2">
            <label className="block text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-2">Display Name</label>
            <input 
              type="text" 
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              className="w-full bg-[var(--bg)] text-[var(--text)] font-semibold px-4 py-3 rounded-xl border border-[var(--border-light)]/20 shadow-[var(--shadow-recessed)] outline-none focus:border-[var(--accent)]/50 transition-all"
              required
            />
          </div>

          {/* College (Disabled for now) */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-2">College</label>
            <select 
              name="college"
              value={formData.college}
              className="w-full bg-[var(--bg)] text-[var(--text)] font-semibold px-4 py-3 rounded-xl border border-[var(--border-light)]/20 shadow-[var(--shadow-recessed)] outline-none opacity-60 cursor-not-allowed"
              disabled
            >
              <option value="KBTCOE, Nashik">KBTCOE, Nashik</option>
            </select>
          </div>

          {/* Branch */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-2">Branch</label>
            <select 
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full bg-[var(--bg)] text-[var(--text)] font-semibold px-4 py-3 rounded-xl border border-[var(--border-light)]/20 shadow-[var(--shadow-recessed)] outline-none focus:border-[var(--accent)]/50 transition-all cursor-pointer"
              required
            >
              <option value="" disabled>Select Branch</option>
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-2">Year</label>
            <select 
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full bg-[var(--bg)] text-[var(--text)] font-semibold px-4 py-3 rounded-xl border border-[var(--border-light)]/20 shadow-[var(--shadow-recessed)] outline-none focus:border-[var(--accent)]/50 transition-all cursor-pointer"
            >
              {years.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-2">Semester</label>
            <select 
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full bg-[var(--bg)] text-[var(--text)] font-semibold px-4 py-3 rounded-xl border border-[var(--border-light)]/20 shadow-[var(--shadow-recessed)] outline-none focus:border-[var(--accent)]/50 transition-all cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>

          {/* Division */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-2">Division</label>
            <select 
              name="division"
              value={formData.division}
              onChange={handleChange}
              className="w-full bg-[var(--bg)] text-[var(--text)] font-semibold px-4 py-3 rounded-xl border border-[var(--border-light)]/20 shadow-[var(--shadow-recessed)] outline-none focus:border-[var(--accent)]/50 transition-all cursor-pointer"
            >
              <option value="" disabled>Select Division</option>
              {divisions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border-light)]/10">
          <Button 
            variant="primary" 
            type="submit"
            className="w-full h-14 shadow-[var(--shadow-glow)] uppercase tracking-widest font-extrabold"
            disabled={isLoading}
          >
            {isLoading ? "Synchronizing..." : "Initialize Terminal →"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
