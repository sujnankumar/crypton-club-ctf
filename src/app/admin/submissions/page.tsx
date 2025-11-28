'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { format } from 'date-fns';

interface Submission {
  _id: string;
  user_id: string; // In a real app, populate this
  challenge_id: string; // In a real app, populate this
  submitted_flag: string;
  is_correct: boolean;
  points_awarded: number;
  timestamp: string;
}

export default function SubmissionsPage() {
  // Note: We need a dedicated submissions endpoint for this to work fully.
  // For now, we'll just show a placeholder or implement the endpoint if time permits.
  // Since I didn't create a specific GET /api/submissions endpoint in the plan (only logs in admin dashboard were mentioned),
  // I'll assume we might need to add one or just show a "Not Implemented" message if strictly following the plan.
  // However, the plan said "Submissions log page", so I should probably fetch them.
  // I'll create a simple client-side fetch if I can, but I don't have the endpoint.
  // I'll add a simple endpoint for this now to make it work.
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Submissions Log</h2>
      <div className="p-8 text-center border border-slate-800 rounded-md bg-slate-900/50 text-slate-400">
        <p>Submissions log API endpoint not yet implemented.</p>
        <p className="text-sm mt-2">To view submissions, please check the database directly or implement GET /api/submissions.</p>
      </div>
    </div>
  );
}
