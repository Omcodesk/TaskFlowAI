import React, { useState } from 'react';
import Header from '../components/other/Header';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../api/projects';
import CreateProjectModal from '../components/Projects/CreateProjectModal';
import { AuthContext } from '../context/AuthProvider';
import { FolderGit2, MoreVertical, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Projects = () => {
    const { user } = React.useContext(AuthContext);
    const isAdminOrManager = user?.role !== 'Employee';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: projects = [], isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: fetchProjects
    });

    return (
        <div className="min-h-screen w-full bg-[#0a0a0a] text-white font-sans selection:bg-indigo-500/30">
            <div className="max-w-[1600px] mx-auto p-6 md:p-8">
                <Header />
                
                <div className="mt-8 mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Projects Overview</h2>
                        <p className="text-sm text-gray-400">Manage all your organizational projects and portfolios.</p>
                    </div>
                    {isAdminOrManager && (
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Create Project
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <div className="text-center py-20 text-gray-500">Loading projects...</div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20 bg-[#151515] border border-white/5 rounded-2xl">
                        <FolderGit2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
                        <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
                        <p className="text-gray-400 mb-6">Get started by creating your first project.</p>
                        {isAdminOrManager && (
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-medium transition-all"
                            >
                                Create Project
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {projects.map((project) => (
                            <div key={project._id} className="bg-[#151515] border border-white/5 hover:border-white/10 transition-colors rounded-2xl p-6 flex flex-col group relative">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                                    <FolderGit2 className="w-5 h-5 text-indigo-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-1 tracking-tight">{project.name}</h3>
                                <p className="text-sm text-gray-400 line-clamp-2 mb-6 flex-1">
                                    {project.description || 'No description provided.'}
                                </p>
                                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                                        project.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                                        project.status === 'Completed' ? 'bg-indigo-500/10 text-indigo-400' :
                                        'bg-gray-500/10 text-gray-400'
                                    }`}>
                                        {project.status}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Projects;
