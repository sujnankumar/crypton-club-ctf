'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Flag, Download, ExternalLink, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Challenge {
  _id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  solved: boolean;
  file_url?: string;
  external_link?: string;
}

export default function ChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [flag, setFlag] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await fetch(`/api/challenges/${params.id}`);
        if (!res.ok) throw new Error('Challenge not found');
        const data = await res.json();
        setChallenge(data);
      } catch (error) {
        console.error('Failed to fetch challenge', error);
      }
    };

    if (params.id) {
      fetchChallenge();
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch(`/api/challenges/${params.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flag }),
      });

      const data = await res.json();

      if (res.ok && data.correct) {
        setStatus('success');
        setMessage(data.message);
        if (challenge) setChallenge({ ...challenge, solved: true });
      } else {
        setStatus('error');
        setMessage(data.message || 'Incorrect flag');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    }
  };

  if (!challenge) {
    return <div className="p-8 text-center text-slate-500">Loading challenge...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-green-400 font-mono relative">
      {/* Circuit-style background */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#00ff00_1px,transparent_1px)] bg-[size:25px_25px]"></div>
      </div>

      {/* Floating hack symbols */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-green-300/30 text-xs animate-pulse delay-100">{'>'}</div>
        <div className="absolute top-40 right-32 text-green-400/20 text-xs animate-bounce delay-200">0101</div>
        <div className="absolute bottom-40 left-16 text-green-500/25 text-xs animate-pulse delay-300">#</div>
        <div className="absolute bottom-20 right-20 text-green-300/30 text-xs animate-bounce delay-400">0110</div>
        <div className="absolute top-60 left-60 text-green-400/20 text-xs animate-pulse delay-500">$</div>
        <div className="absolute bottom-60 right-40 text-green-500/25 text-xs animate-bounce delay-600">1010</div>
      </div>

      <div className="relative z-10">
        <div className="max-w-5xl mx-auto p-8 space-y-8">
          {/* Terminal-style header */}
          <div className="bg-slate-950/80 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-green-500">┌──$[CTF]</span>
            </div>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => router.push('/challenges')}
                className="flex items-center gap-2 text-green-400 hover:text-green-300 hover:bg-green-900/30 border border-green-500/20"
              >
                <ArrowLeft className="h-4 w-4" />
                cd /challenges
              </Button>
              <div className="flex items-center gap-6">
                <span className="text-2xl font-bold text-green-300">{challenge.title}</span>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-900/50 border border-green-500/30 text-xs text-green-200 rounded">
                    [{challenge.category}]
                  </span>
                  <span className="text-green-300 font-mono">
                    +{challenge.points} pts
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <span className="text-green-500">└──</span>
              <span className="text-green-400/50">challenge loaded...</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <ReactMarkdown>{challenge.description}</ReactMarkdown>
            </CardContent>
            {(challenge.file_url || challenge.external_link) && (
              <CardFooter className="flex gap-4 border-t border-slate-800 pt-6">
                {challenge.file_url && (
                  <a href={challenge.file_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="sm">
                      <Download className="mr-2 h-4 w-4" /> Download File
                    </Button>
                  </a>
                )}
                {challenge.external_link && (
                  <a href={challenge.external_link} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" /> Open Link
                    </Button>
                  </a>
                )}
              </CardFooter>
            )}
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className={`border-slate-800 bg-slate-900/50 ${challenge.solved ? 'border-green-900/50 bg-green-900/10' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Submission
              </CardTitle>
            </CardHeader>
            <CardContent>
              {challenge.solved ? (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <h3 className="text-xl font-bold text-white">Solved!</h3>
                  <p className="text-sm text-slate-400">You have already solved this challenge.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="CTF{flag_here}"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    disabled={status === 'loading'}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    isLoading={status === 'loading'}
                  >
                    Submit Flag
                  </Button>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 p-3 rounded-md border border-red-500/20">
                      <AlertCircle className="h-4 w-4" />
                      {message}
                    </div>
                  )}
                  
                  {status === 'success' && (
                    <div className="flex items-center gap-2 text-sm text-green-500 bg-green-500/10 p-3 rounded-md border border-green-500/20">
                      <CheckCircle className="h-4 w-4" />
                      {message}
                    </div>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}
