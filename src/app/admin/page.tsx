'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, Flag, FileText, Megaphone } from 'lucide-react';

interface Stats {
  userCount: number;
  challengeCount: number;
  submissionCount: number;
  announcementCount: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({
    userCount: 0,
    challengeCount: 0,
    submissionCount: 0,
    announcementCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, you might have a dedicated stats endpoint
        // For now, we'll just fetch lists and count (not efficient for large data, but fine for MVP)
        const [users, challenges, announcements, scoreboard] = await Promise.all([
          fetch('/api/users').then(r => r.json()),
          fetch('/api/challenges').then(r => r.json()),
          fetch('/api/announcements').then(r => r.json()),
          fetch('/api/scoreboard').then(r => r.json()),
        ]);

        // Submissions count is tricky without a dedicated endpoint, 
        // but we can estimate or add a specific endpoint later.
        // For now, let's just use 0 or what we can get.
        
        setStats({
          userCount: Array.isArray(users) ? users.length : 0,
          challengeCount: Array.isArray(challenges) ? challenges.length : 0,
          submissionCount: 0, // Placeholder
          announcementCount: Array.isArray(announcements) ? announcements.length : 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Total Users',
      value: stats.userCount,
      icon: Users,
      href: '/admin/users',
      color: 'text-blue-500',
    },
    {
      title: 'Challenges',
      value: stats.challengeCount,
      icon: Flag,
      href: '/admin/challenges',
      color: 'text-green-500',
    },
    {
      title: 'Announcements',
      value: stats.announcementCount,
      icon: Megaphone,
      href: '/admin/announcements',
      color: 'text-yellow-500',
    },
    {
      title: 'Submissions',
      value: 'View Logs', // Placeholder
      icon: FileText,
      href: '/admin/submissions',
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link key={card.title} href={card.href}>
            <Card className="hover:bg-slate-900/80 transition-colors cursor-pointer border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{card.value}</div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
