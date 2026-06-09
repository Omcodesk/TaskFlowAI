import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPendingUsers, approveUser, rejectUser } from '../../../api/users';
import { CheckCircle2, XCircle, UserPlus, Loader2 } from 'lucide-react';

const PendingApprovals = () => {
    const queryClient = useQueryClient();

    const { data: pendingUsers = [], isLoading } = useQuery({
        queryKey: ['pendingUsers'],
        queryFn: fetchPendingUsers
    });

    const approveMutation = useMutation({
        mutationFn: approveUser,
        onSuccess: () => {
            queryClient.invalidateQueries(['pendingUsers']);
        }
    });

    const rejectMutation = useMutation({
        mutationFn: rejectUser,
        onSuccess: () => {
            queryClient.invalidateQueries(['pendingUsers']);
        }
    });

    if (isLoading) {
        return (
            <div className="bg-[#151515] border border-white/5 rounded-2xl p-6 flex items-center justify-center min-h-[300px]">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (pendingUsers.length === 0) {
        return (
            <div className="bg-[#151515] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
                <div className="w-12 h-12 rounded-xl bg-gray-500/10 flex items-center justify-center mb-4">
                    <UserPlus className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No Pending Approvals</h3>
                <p className="text-sm text-gray-400">All registered users have been processed.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#151515] border border-white/5 rounded-2xl p-6 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-indigo-400" />
                    Pending Approvals
                </h3>
                <span className="px-2.5 py-1 text-xs font-medium bg-amber-500/10 text-amber-400 rounded-md">
                    {pendingUsers.length} waiting
                </span>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {pendingUsers.map(user => (
                    <div key={user._id} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-white/10 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-inner">
                                {user.firstName.charAt(0)}{user.lastName?.charAt(0)}
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-white">{user.firstName} {user.lastName}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500">{user.email}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                    <span className="text-xs font-medium text-indigo-400">{user.role}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => rejectMutation.mutate(user._id)}
                                disabled={rejectMutation.isPending || approveMutation.isPending}
                                className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                                title="Reject & Delete"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => approveMutation.mutate(user._id)}
                                disabled={rejectMutation.isPending || approveMutation.isPending}
                                className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
                                title="Approve Access"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PendingApprovals;
