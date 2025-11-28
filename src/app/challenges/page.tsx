'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle, Search, RefreshCw } from 'lucide-react';

interface Challenge {
  _id: string;
  title: string;
  category: string;
  points: number;
  solved: boolean;
}

export default function ChallengesListPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchChallenges = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/challenges');
      const data = await res.json();
      setChallenges(data);

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data.map((c: Challenge) => c.category)));
      setCategories(['All', ...uniqueCategories as string[]]);
    } catch (error) {
      console.error('Failed to fetch challenges', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    let result = challenges;

    if (selectedCategory !== 'All') {
      result = result.filter(c => c.category === selectedCategory);
    }

    if (searchQuery) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredChallenges(result);
  }, [challenges, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-900 text-green-400 font-mono relative">
      {/* Circuit-style background */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#00ff00_1px,transparent_1px)] bg-[size:25px_25px]"></div>
      </div>

      {/* Floating hack symbols */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 right-12 text-green-300/30 text-xs animate-pulse delay-100">{'>'}</div>
        <div className="absolute top-40 left-8 text-green-400/20 text-xs animate-bounce delay-200">0110</div>
        <div className="absolute bottom-48 right-16 text-green-500/25 text-xs animate-pulse delay-300">*</div>
        <div className="absolute bottom-32 left-12 text-green-300/20 text-xs animate-bounce delay-400">1101</div>
        <div className="absolute top-72 right-32 text-green-400/15 text-xs animate-pulse delay-500">^</div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-8 space-y-12">
          {/* Terminal header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-green-500">┌─[CHALLENGES]──</span>
              <span className="text-green-300 font-bold text-3xl">Available Targets</span>
              <span className="text-green-500">──</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <span className="text-green-400/50">[Select your next attack vector]</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-400/70" />
                <Input
                  placeholder="grep challenges..."
                  className="pl-9 bg-slate-950/80 border-green-500/30 text-green-200 placeholder:text-green-400/50 focus:ring-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                aria-label="Filter challenges by category"
                className="h-10 rounded-md border border-green-500/30 bg-slate-950/80 px-3 py-2 text-sm text-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-48 font-mono"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-slate-900 text-green-200">{cat}</option>
                ))}
              </select>

              <Button
                onClick={fetchChallenges}
                isLoading={isRefreshing}
                className="flex items-center gap-2 bg-green-900/50 border border-green-500/30 text-green-300 hover:text-green-200 hover:border-green-400/50 shrink-0 font-mono"
              >
                <RefreshCw className={isRefreshing ? 'animate-spin' : 'h-4 w-4'} />
                SCAN
              </Button>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredChallenges.map((challenge) => (
              <Link key={challenge._id} href={`/challenges/${challenge._id}`}>
                <Card className={`h-full border-green-500/30 bg-slate-950/80 hover:bg-slate-900/90 hover:border-green-400/50 transition-all cursor-pointer group backdrop-blur-sm ${challenge.solved ? 'border-green-400/50 bg-green-900/20' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-1 bg-green-900/50 border border-green-500/30 text-xs text-green-200 rounded font-mono">
                        [{challenge.category}]
                      </span>
                      {challenge.solved && (
                        <CheckCircle className="h-5 w-5 text-green-300" />
                      )}
                    </div>
                    <CardTitle className="text-lg font-bold text-green-200 mt-3 group-hover:text-green-100 transition-colors font-mono">
                      {challenge.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-300 font-mono">
                      {challenge.points} <span className="text-sm font-normal text-green-400/70">pts</span>
                    </div>
                    <div className="mt-3 text-xs text-green-400/60 font-mono">
                      {challenge.solved ? '[SECURED]' : '[TARGETING]'}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {filteredChallenges.length === 0 && (
              <div className="col-span-full">
                <Card className="border-green-500/30 bg-slate-950/60">
                  <CardContent className="text-center py-16">
                    <div className="text-green-400/50 font-mono">[NO CHALLENGES FOUND]</div>
                    <div className="text-green-500/50 text-sm mt-2">Adjust your search parameters</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <div className="text-center pt-8 border-t border-green-500/20">
            <p className="text-green-400/50 text-xs font-mono">
              user@ctf:~# challenges loaded | {filteredChallenges.length} targets identified ▋▋▋▋▋▋▋▋▋▋
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
