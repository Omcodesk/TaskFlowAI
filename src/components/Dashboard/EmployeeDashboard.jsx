import React, { useContext } from 'react';
import Header from '../other/Header';
import EmployeeMetrics from './Employee/EmployeeMetrics';
import MyTasksList from './Employee/MyTasksList';
import PersonalActivityFeed from './Employee/PersonalActivityFeed';
import { AuthContext } from '../../context/AuthProvider';

const EmployeeDashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen w-full bg-[#0a0a0a] text-white font-sans selection:bg-indigo-500/30">
            <div className="max-w-[1600px] mx-auto p-6 md:p-8">
                <Header />
                
                <div className="mt-8 mb-6">
                    <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">My Workspace</h2>
                    <p className="text-sm text-gray-400">Welcome back, {user?.firstName}. Here is what needs your attention.</p>
                </div>

                <EmployeeMetrics />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <div className="lg:col-span-2">
                        <MyTasksList />
                    </div>
                    <div className="lg:col-span-1">
                        <PersonalActivityFeed />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;