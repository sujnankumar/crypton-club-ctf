'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trophy, Medal, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';

interface ScoreboardEntry {
  username: string;
  total_points: number;
  solve_count: number;
  last_solve: string;
}

export default function ScoreboardPage() {
  const [scoreboard, setScoreboard] = useState<ScoreboardEntry[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: session } = useSession();

  const fetchScoreboard = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/scoreboard');
      const data = await res.json();
      setScoreboard(data);
    } catch (error) {
      console.error('Failed to fetch scoreboard', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchScoreboard();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-slate-300" />;
      case 2:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="text-slate-500 font-mono w-5 text-center">{index + 1}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-green-400 font-mono relative">
      {/* Circuit-style background */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#00ff00_1px,transparent_1px)] bg-[size:25px_25px]"></div>
      </div>

      {/* Floating hack symbols */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-green-300/30 text-xs animate-pulse delay-100">@</div>
        <div className="absolute top-60 right-20 text-green-400/20 text-xs animate-bounce delay-200">01001</div>
        <div className="absolute bottom-40 left-20 text-green-500/25 text-xs animate-pulse delay-300">+</div>
        <div className="absolute bottom-60 right-10 text-green-300/20 text-xs animate-bounce delay-400">10101</div>
        <div className="absolute top-80 left-80 text-green-400/15 text-xs animate-pulse delay-500">%</div>
      </div>

      <div className="relative z-10">
        <div className="max-w-6xl mx-auto p-8 space-y-8">
          {/* Terminal header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-green-500">┌─[SCOREBOARD]──</span>
              <span className="text-green-300 font-bold text-3xl">Global Hacker Rankings</span>
              <span className="text-green-500">──</span>
            </div>
            <div className="flex items-center justify-center gap-6">
              <span className="text-green-400/50">[Scanning network...]</span>
              <Button
                onClick={fetchScoreboard}
                isLoading={isRefreshing}
                className="flex items-center gap-2 bg-green-900/50 border border-green-500/30 text-green-300 hover:text-green-200 hover:border-green-400/50"
              >
                <RefreshCw className={isRefreshing ? 'animate-spin' : 'h-4 w-4'} />
                RESCAN
              </Button>
            </div>
          </div>

          <Card className="bg-slate-950/90 border-green-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-200 font-mono text-lg flex items-center gap-2">
                <span className="text-green-500">$</span>
                LIST_RANKINGS --sort=points --desc
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-green-500/20 hover:bg-transparent">
                      <TableHead className="w-16 text-center text-green-300 font-mono">RANK</TableHead>
                      <TableHead className="text-green-300 font-mono">HACKER_ID</TableHead>
                      <TableHead className="text-right text-green-300 font-mono">COMPLETED</TableHead>
                      <TableHead className="text-right text-green-300 font-mono">SCORE</TableHead>
                      <TableHead className="text-right hidden md:table-cell text-green-300 font-mono">LAST_ATTACK</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scoreboard.map((entry, index) => (
                      <TableRow
                        key={entry.username}
                        className={`${session?.user?.username === entry.username ? 'bg-green-900/30 border-green-400/50' : 'border-green-500/10'} hover:bg-green-900/20`}
                      >
                        <TableCell className="text-center font-mono">
                          <div className="flex justify-center items-center gap-1">
                            {getRankIcon(index)}
                            <span className="text-green-300 font-bold">#{index + 1}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">
                          <div className={`font-bold ${session?.user?.username === entry.username ? 'text-green-200' : 'text-green-300'}`}>
                            {entry.username}
                            {session?.user?.username === entry.username && <span className="text-green-400 ml-2">[YOU]</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-green-300">{entry.solve_count}</TableCell>
                        <TableCell className="text-right font-bold font-mono text-green-200">{entry.total_points}</TableCell>
                        <TableCell className="text-right text-green-400/70 text-xs hidden md:table-cell font-mono">
                          {entry.last_solve ?
                            formatDistanceToNow(new Date(entry.last_solve), { addSuffix: true }) :
                            'NEVER'
                          }
                        </TableCell>
                      </TableRow>
                    ))}

                    {scoreboard.length === 0 && (
                      <TableRow className="border-green-500/20">
                        <TableCell colSpan={5} className="text-center py-12">
                          <div className="text-green-400/50 font-mono">[NO HACKERS DETECTED]</div>
                          <div className="text-green-500/50 text-sm mt-2">Be the first to defeat a challenge</div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="text-center pt-6 border-t border-green-500/20">
            <p className="text-green-400/50 text-xs font-mono">
              user@ctf:~# scoreboard displayed | {scoreboard.length} hackers online ▋▋▋▋▋▋▋▋▋▋
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
