'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Terminal, Home, AlertTriangle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Animated background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(#00ff00_1px,transparent_1px)] bg-[size:50px_50px] opacity-5"></div>

      {/* Floating characters */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 text-green-500/30 text-xs animate-pulse">{'>'}</div>
        <div className="absolute top-1/3 right-1/3 text-green-500/20 text-xs animate-bounce">!</div>
        <div className="absolute bottom-1/4 left-1/3 text-green-500/30 text-xs animate-pulse">#</div>
        <div className="absolute bottom-1/3 right-1/4 text-green-500/20 text-xs animate-bounce">@</div>
        <div className="absolute top-1/2 right-1/4 text-green-500/30 text-xs animate-pulse">%</div>
        <div className="absolute bottom-1/2 left-1/2 text-green-500/20 text-xs animate-bounce">&</div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <Card className="w-full max-w-2xl bg-slate-900/90 border-green-500/30 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Terminal className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-4xl font-bold text-green-400 mb-2">
              404 - Access Denied
            </CardTitle>
            <div className="text-sm text-green-300">
              <p>$ route not found</p>
              <p>$ sudo locate challenge</p>
              <p>$ ls -la</p>
              <p className="text-red-400">$ rm -rf / --no-preserve-root</p>
              <p className="text-yellow-400 animate-pulse">$ command not found</p>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2 text-sm">
              <p className="text-slate-400">
                The page you're trying to access doesn't exist in this secure system.
              </p>
              <p className="text-green-400 text-xs font-mono bg-slate-900/80 p-2 rounded border border-green-500/20">
                <AlertTriangle className="inline h-4 w-4 mr-1" />
                security protocol: redirect initiated
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="bg-green-600 hover:bg-green-500 text-black font-semibold flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Return to Headquarters
                </Button>
              </Link>
              <Link href="/challenges">
                <Button variant="secondary" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                  View Challenges
                </Button>
              </Link>
            </div>

            <div className="mt-8 p-4 bg-slate-900/80 rounded border border-green-500/20">
              <p className="text-xs text-green-300 font-mono">
                user@ctf:~$ echo "Keep exploring..."<br />
                <span className="text-green-400">Keep exploring...</span><br />
                user@ctf:~$ _
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
