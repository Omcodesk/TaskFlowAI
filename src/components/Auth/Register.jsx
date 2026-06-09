import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Briefcase, Loader2, ArrowRight } from 'lucide-react';
import apiClient from '../../api/client';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'Employee'
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        
        try {
            const { data } = await apiClient.post('/auth/register', formData);
            // Registration success, navigate to login
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-[#0e0e0e] text-white selection:bg-indigo-500/30 font-sans py-12'>
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full" />
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className='relative z-10 w-full max-w-md p-8 md:p-10 bg-[#151515] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl'
        >
            <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mb-4 ring-1 ring-indigo-500/20">
                    <User className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Create Account</h1>
                <p className="text-sm text-gray-400">Join TaskFlow and streamline your workflow</p>
            </div>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"
                >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </motion.div>
            )}

            <form onSubmit={submitHandler} className='space-y-5'>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">First Name</label>
                        <input 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required 
                            className='w-full px-4 py-3 bg-[#0a0a0a] border border-white/5 focus:border-indigo-500/50 focus:bg-[#111] rounded-xl outline-none text-white placeholder-gray-600 transition-all shadow-inner' 
                            type="text" 
                            placeholder='John' 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Last Name</label>
                        <input 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required 
                            className='w-full px-4 py-3 bg-[#0a0a0a] border border-white/5 focus:border-indigo-500/50 focus:bg-[#111] rounded-xl outline-none text-white placeholder-gray-600 transition-all shadow-inner' 
                            type="text" 
                            placeholder='Doe' 
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email Address</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                            <Mail className="w-5 h-5" />
                        </div>
                        <input 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required 
                            className='w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-white/5 focus:border-indigo-500/50 focus:bg-[#111] rounded-xl outline-none text-white placeholder-gray-600 transition-all shadow-inner' 
                            type="email" 
                            placeholder='name@company.com' 
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                            <Lock className="w-5 h-5" />
                        </div>
                        <input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required 
                            className='w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-white/5 focus:border-indigo-500/50 focus:bg-[#111] rounded-xl outline-none text-white placeholder-gray-600 transition-all shadow-inner' 
                            type="password" 
                            placeholder='••••••••' 
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Requested Role</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <select 
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className='w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-white/5 focus:border-indigo-500/50 focus:bg-[#111] rounded-xl outline-none text-white transition-all shadow-inner appearance-none'
                        >
                            <option value="Employee">Employee</option>
                            <option value="Manager">Manager</option>
                        </select>
                    </div>
                </div>

                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-sm text-indigo-200">
                    <p><strong>Note:</strong> Your account will require Admin approval before you can access the dashboard.</p>
                </div>

                <button 
                    disabled={isSubmitting}
                    className='relative w-full group flex items-center justify-center gap-2 mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-8 rounded-xl transition-all duration-200 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]'
                >
                    {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Sign Up
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
            
            <p className="mt-8 text-center text-sm text-gray-500">
                Already have an account? <Link to="/" className="text-indigo-400 hover:text-indigo-300 transition-colors">Sign in</Link>
            </p>
        </motion.div>
    </div>
  )
}

export default Register;
