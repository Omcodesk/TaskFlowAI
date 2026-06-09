import React, { useState } from 'react';
import Header from '../other/Header';
import OverviewCards from './Admin/OverviewCards';
import QuickActions from './Admin/QuickActions';
import StatusDistributionChart from './Admin/StatusDistributionChart';
import ActivityFeed from './Admin/ActivityFeed';
import RecentTasksTable from './Admin/RecentTasksTable';
import CreateTaskModal from './Admin/CreateTaskModal';
import CreateProjectModal from '../Projects/CreateProjectModal';
import InviteUserModal from './Admin/InviteUserModal';
import PendingApprovals from './Admin/PendingApprovals';

const AdminDashboard = () => {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    return (
        <div className="min-h-screen w-full bg-[#0a0a0a] text-white font-sans selection:bg-indigo-500/30">
            <div className="max-w-[1600px] mx-auto p-6 md:p-8">
                <Header />
                
                <div className="mt-8 mb-6">
                    <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Platform Overview</h2>
                    <p className="text-sm text-gray-400">Manage your team's productivity and track project milestones.</p>
                </div>

                <OverviewCards />
                
                <QuickActions 
                    onCreateTask={() => setIsTaskModalOpen(true)} 
                    onCreateProject={() => setIsProjectModalOpen(true)}
                    onInviteUser={() => setIsInviteModalOpen(true)}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2 flex flex-col">
                        <RecentTasksTable />
                    </div>
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <div className="h-[350px]">
                            <StatusDistributionChart />
                        </div>
                        <div className="flex-1">
                            <PendingApprovals />
                        </div>
                        <div className="flex-1 min-h-[400px]">
                            <ActivityFeed />
                        </div>
                    </div>
                </div>
            </div>
            <CreateTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
            <CreateProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} />
            <InviteUserModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
        </div>
    );
};

export default AdminDashboard;