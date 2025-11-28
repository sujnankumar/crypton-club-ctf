'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Flag, Trophy, Megaphone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';

interface Announcement {
  _id: string;
  title: string;
  body: string;
  created_at: string;
}

interface UserStats {
  rank: number;
  score: number;
  solves: number;
}

export default function DashboardPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<UserStats>({ rank: 0, score: 0, solves: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [announcementsRes, scoreboardRes, challengesRes] = await Promise.all([
          fetch('/api/announcements'),
          fetch('/api/scoreboard'),
          fetch('/api/challenges')
        ]);

        const announcementsData = await announcementsRes.json();
        setAnnouncements(announcementsData.slice(0, 3)); // Show top 3

        // Calculate stats from scoreboard (this is a bit inefficient client-side but works for MVP)
        // Ideally we'd have a /api/users/me/stats endpoint
        const scoreboardData = await scoreboardRes.json();
        // We need to know current user, but we can get that from session or just find ourselves in scoreboard if we knew our username
        // For now, let's just show placeholders or try to match if we had user context.
        // Actually, let's fetch /api/auth/session to get user info if needed, or just use useSession hook.
        
        // Simplified: just show 0s or fetch real data if we add the endpoint.
        // Let's rely on the challenges list to calculate solves count at least.
        const challengesData = await challengesRes.json();
        const solvedCount = challengesData.filter((c: any) => c.solved).length;
        const score = challengesData.filter((c: any) => c.solved).reduce((acc: number, c: any) => acc + c.points, 0);
        
        setStats({
          rank: 0, // Hard to calc without full scoreboard context and user ID
          score,
          solves: solvedCount
        });

      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-green-400 font-mono relative">
      {/* Circuit-style background */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#00ff00_1px,transparent_1px)] bg-[size:25px_25px]"></div>
      </div>

      {/* Floating hack symbols */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-16 text-green-300/20 text-xs animate-pulse delay-100">$</div>
        <div className="absolute top-48 right-24 text-green-400/15 text-xs animate-bounce delay-300">011110</div>
        <div className="absolute bottom-32 left-24 text-green-500/25 text-xs animate-pulse delay-500">&</div>
        <div className="absolute bottom-24 right-16 text-green-300/20 text-xs animate-bounce delay-700">101100</div>
        <div className="absolute top-80 left-80 text-green-400/15 text-xs animate-pulse delay-900">#</div>
      </div>

      <div className="relative z-10">
        <div className="max-w-6xl mx-auto p-8 space-y-12">
          {/* Terminal-style header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-green-500">┌─[DASHBOARD]──</span>
              <span className="text-green-300 font-bold text-2xl">Player Status Report</span>
              <span className="text-green-500">──</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <span className="text-green-400/50">[Initialising system...]</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-slate-950/90 border-green-500/30 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="text-sm font-medium text-green-300 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-300" />
                  TOTAL_SCORE
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-200 font-mono">{stats.score}</div>
                <div className="text-xs text-green-400/70 mt-1">[POINTS ACCUMULATED]</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-950/90 border-green-500/30 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="text-sm font-medium text-green-300 flex items-center gap-2">
                  <Flag className="h-4 w-4 text-blue-300" />
                  SOLVED_CHALLENGES
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-200 font-mono">{stats.solves}</div>
                <div className="text-xs text-green-400/70 mt-1">[COMPLETED TASKS]</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-950/90 border-green-500/30 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="text-sm font-medium text-green-300 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-purple-300" />
                  CURRENT_RANKING
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-200 font-mono">#{stats.rank || 'UNRANKED'}</div>
                <div className="text-xs text-green-400/70 mt-1">[GLOBAL POSITION]</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-green-300" />
                <h2 className="text-xl font-semibold text-green-200">SYS_ANNOUNCEMENTS</h2>
              </div>
              {announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((announcement, index) => (
                    <Card key={announcement._id} className="bg-slate-950/80 border-green-500/20 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium text-green-200 flex items-center gap-2">
                          <span className="text-green-500">[</span>
                          {announcement.title}
                          <span className="text-green-500">]</span>
                        </CardTitle>
                        <p className="text-xs text-green-400/70 font-mono">
                          {format(new Date(announcement.created_at), 'yyyy-MM-dd HH:mm:ss')}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-green-300 line-clamp-3 leading-relaxed">
                          {announcement.body}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-950/60 border border-green-500/20 rounded-lg p-8 text-center">
                  <div className="text-green-400/70">[NO SYSTEM MESSAGES]</div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-green-200 flex items-center gap-2">
                <span className="text-green-500">{'>'}</span>
                QUICK_COMMANDS
              </h2>
              <div className="grid gap-4">
                <Link href="/challenges">
                  <Card className="bg-slate-950/80 border-green-500/30 hover:bg-slate-900/80 hover:border-green-400/50 transition-all cursor-pointer backdrop-blur-sm">
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-green-900/50 border border-green-400/30">
                          <Flag className="h-6 w-6 text-green-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-green-200">EXEC /challenges</h3>
                          <p className="text-sm text-green-400/70">Launch attack on next target</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-green-400" />
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/scoreboard">
                  <Card className="bg-slate-950/80 border-green-500/30 hover:bg-slate-900/80 hover:border-green-400/50 transition-all cursor-pointer backdrop-blur-sm">
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-yellow-900/50 border border-yellow-400/30">
                          <Trophy className="h-6 w-6 text-yellow-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-green-200">EXEC /scoreboard</h3>
                          <p className="text-sm text-green-400/70">View global hacker rankings</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-green-400" />
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-green-500/20">
            <p className="text-green-400/50 text-xs font-mono">
              user@ctf:~# dashboard loaded successfully | system operational ▋▋▋▋▋▋▋▋▋▋
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
