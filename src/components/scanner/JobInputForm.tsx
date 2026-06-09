"use client"

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { FileText, Settings, ShieldAlert, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { JobFormData } from '@/types';

const formSchema = zod.object({
  title: zod.string().min(3, "Job title must be at least 3 characters."),
  description: zod.string().min(50, "Job description must be at least 50 characters."),
  company: zod.string().optional(),
  location: zod.string().optional(),
  salary_range: zod.string().optional(),
  employment_type: zod.string().optional(),
  required_experience: zod.string().optional(),
  industry: zod.string().optional(),
  requirements: zod.string().optional(),
  company_profile: zod.string().optional(),
  has_company_logo: zod.boolean().optional().default(false),
  telecommuting: zod.boolean().optional().default(false),
  contact_email: zod.string().optional().refine(val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Invalid contact email address format."
  })
});

interface JobInputFormProps {
  onSubmit: (data: JobFormData) => void;
  isLoading: boolean;
}

export default function JobInputForm({ onSubmit, isLoading }: JobInputFormProps) {
  const [scanMode, setScanMode] = useState<'quick' | 'advanced'>('quick');
  const [accuracy, setAccuracy] = useState(30);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<JobFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      company: '',
      location: '',
      salary_range: '',
      employment_type: 'Full-time',
      required_experience: 'Entry',
      industry: '',
      requirements: '',
      company_profile: '',
      has_company_logo: false,
      telecommuting: false,
      contact_email: ''
    }
  });

  // Watch fields to dynamically update the Scan Accuracy meter
  const watchedFields = watch();

  useEffect(() => {
    let score = 30; // base for title + desc
    if (watchedFields.company) score += 10;
    if (watchedFields.location) score += 10;
    if (watchedFields.salary_range) score += 10;
    if (watchedFields.industry) score += 10;
    if (watchedFields.requirements) score += 10;
    if (watchedFields.company_profile) score += 10;
    if (watchedFields.contact_email) score += 10;
    
    setAccuracy(Math.min(100, score));
  }, [watchedFields]);

  return (
    <Card className="glass-panel border-slate-blue/30 overflow-hidden shadow-2xl">
      <CardHeader className="bg-void/50 border-b border-slate-blue/20 py-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-bone">Audit Configuration</CardTitle>
          <CardDescription className="text-[10px] text-muted-blue">Configure scan parameters</CardDescription>
        </div>
        
        {/* Toggle Mode buttons */}
        <div className="flex gap-1 bg-void border border-slate-blue/20 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setScanMode('quick')}
            className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
              scanMode === 'quick' 
                ? 'bg-slate-blue text-bone' 
                : 'text-muted-blue hover:text-bone'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Quick
          </button>
          <button
            type="button"
            onClick={() => setScanMode('advanced')}
            className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
              scanMode === 'advanced' 
                ? 'bg-slate-blue text-bone' 
                : 'text-muted-blue hover:text-bone'
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> Advanced
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Accuracy meter */}
          <div className="space-y-1.5 p-3 rounded-lg bg-void/50 border border-slate-blue/10">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-blue">
              <span>Scan Accuracy Index</span>
              <span className="text-bone">{accuracy}%</span>
            </div>
            <div className="w-full bg-void rounded-full h-2 overflow-hidden border border-slate-blue/10">
              <div 
                className="bg-gradient-to-r from-slate-blue to-muted-blue h-full transition-all duration-500"
                style={{ width: `${accuracy}%` }}
              ></div>
            </div>
            <p className="text-[9px] text-muted-blue/60 leading-normal">
              {accuracy < 60 ? "💡 Add company profile, email, or salary range in Advanced Mode to calibrate models." : "✅ High metadata depth. Ready for ensemble ML assessment."}
            </p>
          </div>

          {/* Job Title */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold text-muted-blue tracking-wider block">Job Title *</label>
            <Input
              placeholder="e.g. Senior Software Engineer"
              {...register('title')}
              className="bg-void border-slate-blue/20 text-xs text-bone"
            />
            {errors.title && <p className="text-[10px] text-red-400 mt-0.5">{errors.title.message}</p>}
          </div>

          {/* Advanced Mode Fields */}
          {scanMode === 'advanced' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-muted-blue tracking-wider block">Company Name</label>
                  <Input placeholder="e.g. Google" {...register('company')} className="bg-void border-slate-blue/20 text-xs text-bone" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-muted-blue tracking-wider block">Location</label>
                  <Input placeholder="e.g. London, UK" {...register('location')} className="bg-void border-slate-blue/20 text-xs text-bone" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-muted-blue tracking-wider block">Salary Range</label>
                  <Input placeholder="e.g. $120,000 - $140,000" {...register('salary_range')} className="bg-void border-slate-blue/20 text-xs text-bone" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-muted-blue tracking-wider block">Contact Email</label>
                  <Input type="text" placeholder="e.g. hr@company.com" {...register('contact_email')} className="bg-void border-slate-blue/20 text-xs text-bone" />
                  {errors.contact_email && <p className="text-[10px] text-red-400 mt-0.5">{errors.contact_email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-muted-blue tracking-wider block">Employment Type</label>
                  <select
                    {...register('employment_type')}
                    className="w-full bg-void border border-slate-blue/20 rounded-md p-2 text-xs text-bone focus:outline-none focus:ring-1 focus:ring-slate-blue"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-muted-blue tracking-wider block">Required Experience</label>
                  <select
                    {...register('required_experience')}
                    className="w-full bg-void border border-slate-blue/20 rounded-md p-2 text-xs text-bone focus:outline-none focus:ring-1 focus:ring-slate-blue"
                  >
                    <option value="None">None</option>
                    <option value="Entry">Entry Level</option>
                    <option value="Mid">Mid Level</option>
                    <option value="Senior">Senior Level</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs text-muted-blue cursor-pointer select-none">
                  <input type="checkbox" {...register('has_company_logo')} className="rounded border-slate-blue/20 bg-void text-slate-blue" />
                  Has Company Logo
                </label>
                <label className="flex items-center gap-2 text-xs text-muted-blue cursor-pointer select-none">
                  <input type="checkbox" {...register('telecommuting')} className="rounded border-slate-blue/20 bg-void text-slate-blue" />
                  Telecommuting (Remote)
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-muted-blue tracking-wider block">Company Profile Details</label>
                <textarea
                  placeholder="Paste details about the employer..."
                  {...register('company_profile')}
                  className="w-full h-16 bg-void border border-slate-blue/20 rounded-md p-2 text-xs text-bone focus:outline-none focus:ring-1 focus:ring-slate-blue resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-muted-blue tracking-wider block">Role Requirements</label>
                <textarea
                  placeholder="Paste details about job requirements..."
                  {...register('requirements')}
                  className="w-full h-16 bg-void border border-slate-blue/20 rounded-md p-2 text-xs text-bone focus:outline-none focus:ring-1 focus:ring-slate-blue resize-none"
                />
              </div>
            </>
          )}

          {/* Job Description */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold text-muted-blue tracking-wider block">Job Description Text *</label>
            <textarea
              placeholder="Paste the full description body details to check vocabulary features (min 50 chars)..."
              {...register('description')}
              className="w-full h-40 bg-void border border-slate-blue/20 rounded-md p-3 text-xs text-bone focus:outline-none focus:ring-1 focus:ring-slate-blue resize-none"
            />
            {errors.description && <p className="text-[10px] text-red-400 mt-0.5">{errors.description.message}</p>}
          </div>

          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-gradient-to-r from-slate-blue to-muted-blue text-xs font-bold uppercase tracking-wider font-display py-2.5 shadow-lg shadow-slate-blue/20"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-1.5"><Cpu className="w-4 h-4 animate-spin" /> Processing Ensemble Models...</span>
            ) : (
              <span className="flex items-center justify-center gap-1">Trigger Risk Scan <ShieldAlert className="w-4 h-4" /></span>
            )}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}
