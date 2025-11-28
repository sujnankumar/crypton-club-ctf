'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Lock } from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Profile Settings</h1>

      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-300">Username</label>
            <Input value={session?.user?.username || ''} disabled className="bg-slate-950" />
            <p className="text-xs text-slate-500">Username cannot be changed.</p>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-300">Email</label>
            <Input value={session?.user?.email || ''} disabled className="bg-slate-950" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Input type="password" label="Current Password" placeholder="••••••••" />
            <Input type="password" label="New Password" placeholder="••••••••" />
            <Input type="password" label="Confirm New Password" placeholder="••••••••" />
            <Button disabled>Update Password (Coming Soon)</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
