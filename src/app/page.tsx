import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Terminal, Flag, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-blue-500/10 p-6 ring-1 ring-blue-500/20">
            <Terminal className="h-16 w-16 text-blue-500" />
          </div>
        </div>
        
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          Capture The <span className="text-blue-500">Flag</span>
        </h1>
        
        <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400">
          Test your hacking skills, solve challenges, and climb the leaderboard.
          A secure and modern platform for cybersecurity enthusiasts.
        </p>
        
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/login">
            <Button size="lg" className="min-w-[160px] text-lg">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary" size="lg" className="min-w-[160px] text-lg">
              Register
            </Button>
          </Link>
        </div>

        <div className="mt-20 grid gap-8 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <Flag className="mx-auto mb-4 h-10 w-10 text-green-500" />
            <h3 className="mb-2 text-xl font-bold">Solve Challenges</h3>
            <p className="text-slate-400">
              Web, Crypto, Pwn, Reverse Engineering, and more.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <Shield className="mx-auto mb-4 h-10 w-10 text-purple-500" />
            <h3 className="mb-2 text-xl font-bold">Learn Security</h3>
            <p className="text-slate-400">
              Practice real-world techniques in a safe environment.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <Terminal className="mx-auto mb-4 h-10 w-10 text-yellow-500" />
            <h3 className="mb-2 text-xl font-bold">Compete</h3>
            <p className="text-slate-400">
              Climb the global scoreboard and prove your skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
