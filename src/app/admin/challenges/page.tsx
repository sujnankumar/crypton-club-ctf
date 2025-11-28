'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';
import { Trash2, Edit, Plus, Eye, EyeOff, Eye as ShowIcon, EyeOff as HideIcon } from 'lucide-react';

interface Challenge {
  _id: string;
  title: string;
  category: string;
  points: number;
  flag: string;
  description: string;
  is_hidden: boolean;
  file_url?: string;
  external_link?: string;
}

type ChallengeForm = {
  title: string;
  category: string;
  points: number;
  flag: string;
  description: string;
  is_hidden?: boolean;
  file_url?: string;
  external_link?: string;
};

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFlag, setShowFlag] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ChallengeForm>();

  const fetchChallenges = async () => {
    const res = await fetch('/api/admin/challenges');
    const data = await res.json();
    setChallenges(data);
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const onSubmit = async (data: ChallengeForm) => {
    setIsLoading(true);
    try {
      if (editingChallenge) {
        await fetch(`/api/admin/challenges/${editingChallenge._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else {
        await fetch('/api/admin/challenges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }
      setIsModalOpen(false);
      fetchChallenges();
      reset();
      setEditingChallenge(null);
    } catch (error) {
      console.error('Failed to save challenge', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will delete all submissions for this challenge too.')) return;
    await fetch(`/api/admin/challenges/${id}`, { method: 'DELETE' });
    fetchChallenges();
  };

  const toggleVisibility = async (id: string) => {
    const challenge = challenges.find(c => c._id === id);
    if (!challenge) return;

    await fetch(`/api/admin/challenges/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_hidden: !challenge.is_hidden }),
    });
    fetchChallenges();
  };

  const openEditModal = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setIsModalOpen(true);
    setShowFlag(true);
    setValue('title', challenge.title, { shouldValidate: false });
    setValue('category', challenge.category, { shouldValidate: false });
    setValue('points', challenge.points, { shouldValidate: false });
    setValue('flag', challenge.flag || '', { shouldValidate: false });
    setValue('description', challenge.description, { shouldValidate: false });
    setValue('is_hidden', challenge.is_hidden, { shouldValidate: false });
    setValue('file_url', challenge.file_url || '', { shouldValidate: false });
    setValue('external_link', challenge.external_link || '', { shouldValidate: false });
  };

  const openCreateModal = () => {
    setEditingChallenge(null);
    reset();
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Challenges Management</h2>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" /> Add Challenge
        </Button>
      </div>

      <div className="rounded-md border border-slate-800 bg-slate-900/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {challenges.map((challenge) => (
              <TableRow key={challenge._id}>
                <TableCell className="font-medium text-white">{challenge.title}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full bg-slate-800 text-xs text-slate-300">
                    {challenge.category}
                  </span>
                </TableCell>
                <TableCell>{challenge.points}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleVisibility(challenge._id)}
                    className="p-0 h-auto hover:bg-transparent"
                  >
                    {challenge.is_hidden ? (
                      <span className="flex items-center text-slate-500 text-xs hover:text-slate-300">
                        <EyeOff className="mr-1 h-3 w-3" /> Hidden
                      </span>
                    ) : (
                      <span className="flex items-center text-green-500 text-xs hover:text-green-300">
                        <Eye className="mr-1 h-3 w-3" /> Visible
                      </span>
                    )}
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(challenge)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(challenge._id)} className="text-red-500 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingChallenge ? 'Edit Challenge' : 'Create Challenge'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)} isLoading={isLoading}>Save</Button>
          </>
        }
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <Input label="Title" {...register('title')} error={errors.title?.message} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Category" {...register('category')} error={errors.category?.message} />
            <Input label="Points" type="number" {...register('points')} error={errors.points?.message} />
          </div>
          <div className="w-full">
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Flag
            </label>
            <div className="relative">
              <input
                type={showFlag ? 'text' : 'password'}
                {...register('flag')}
                className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowFlag(!showFlag)}
              >
                {showFlag ? (
                  <HideIcon className="h-5 w-5 text-slate-400" />
                ) : (
                  <ShowIcon className="h-5 w-5 text-slate-400" />
                )}
              </button>
            </div>
            {errors.flag && <p className="mt-1 text-sm text-red-500">{errors.flag.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Description (Markdown)</label>
            <textarea
              {...register('description')}
              className="flex min-h-[100px] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
          </div>
          <Input label="File URL (Optional)" {...register('file_url')} />
          <Input label="External Link (Optional)" {...register('external_link')} />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_hidden" {...register('is_hidden')} className="rounded border-slate-700 bg-slate-900" />
            <label htmlFor="is_hidden" className="text-sm text-slate-300">Hide challenge</label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
