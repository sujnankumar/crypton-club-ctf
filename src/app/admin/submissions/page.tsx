'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { format } from 'date-fns';

interface Submission {
  _id: string;
  user_id: {
    name: string;
    email: string;
  };
  challenge_id: {
    title: string;
    category: string;
    points: number;
  };
  submitted_flag: string;
  is_correct: boolean;
  points_awarded: number;
  timestamp: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch('/api/admin/submissions');
        if (res.ok) {
          const data = await res.json();
          setSubmissions(data);
        }
      } catch (error) {
        console.error('Failed to fetch submissions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading submissions...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Submissions Log</h2>
      <div className="rounded-md border border-slate-800 bg-slate-900/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Challenge</TableHead>
              <TableHead>Flag</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Submitted At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length > 0 ? (
              submissions.map((submission) => (
                <TableRow key={submission._id}>
                  <TableCell>
                    <div className="font-medium text-white">{submission.user_id.name}</div>
                    <div className="text-xs text-slate-500">{submission.user_id.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-white">{submission.challenge_id.title}</div>
                    <div className="text-xs text-slate-500">{submission.challenge_id.category}</div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-slate-800 px-2 py-1 rounded">
                      {submission.submitted_flag}
                    </code>
                  </TableCell>
                  <TableCell>
                    {submission.is_correct ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-green-500 bg-green-500/10 rounded-full">
                        Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-red-500 bg-red-500/10 rounded-full">
                        Incorrect
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{submission.points_awarded}</TableCell>
                  <TableCell className="text-sm text-slate-400">
                    {submission.timestamp ? format(new Date(submission.timestamp), 'MMM dd, HH:mm') : 'Unknown'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  No submissions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
