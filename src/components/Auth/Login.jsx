import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Please check credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDemoLogin = async (role) => {
        setError('');
        setIsSubmitting(true);
        try {
            if (role === 'admin') {
                setEmail('admin@demo.com');
                setPassword('demo123');
                await login('admin@demo.com', 'demo123');
            } else {
                setEmail('employee@demo.com');
                setPassword('demo123');
                await login('employee@demo.com', 'demo123');
            }
            navigate('/dashboard');
        } catch (err) {
            setError('Demo account not found. Please run the seed script.');
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-[#0e0e0e] text-white selection:bg-indigo-500/30 font-sans'>
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-indigo-500/10 blur-[120px] rounded-full" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 blur-[120px] rounded-full" />
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className='relative z-10 w-full max-w-md p-8 md:p-10 bg-[#151515] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl'
        >
            <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mb-4 ring-1 ring-indigo-500/20">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Welcome to TaskFlow</h1>
                <p className="text-sm text-gray-400">Sign in to your workspace to continue</p>
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
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email Address</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                            <Mail className="w-5 h-5" />
                        </div>
                        <input 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            className='w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-white/5 focus:border-indigo-500/50 focus:bg-[#111] rounded-xl outline-none text-white placeholder-gray-600 transition-all shadow-inner' 
                            type="email" 
                            placeholder='name@company.com' 
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Password</label>
                        <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                            <Lock className="w-5 h-5" />
                        </div>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            className='w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-white/5 focus:border-indigo-500/50 focus:bg-[#111] rounded-xl outline-none text-white placeholder-gray-600 transition-all shadow-inner' 
                            type="password" 
                            placeholder='••••••••' 
                        />
                    </div>
                </div>

                <button 
                    disabled={isSubmitting}
                    className='relative w-full group flex items-center justify-center gap-2 mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-8 rounded-xl transition-all duration-200 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]'
                >
                    {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Sign In
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-xs text-center text-gray-500 uppercase tracking-wider mb-4">Or use demo accounts</p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => handleDemoLogin('admin')}
                        disabled={isSubmitting}
                        className="flex-1 py-2 px-4 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 border border-white/5 hover:border-white/10"
                    >
                        Test as Admin
                    </button>
                    <button 
                        onClick={() => handleDemoLogin('employee')}
                        disabled={isSubmitting}
                        className="flex-1 py-2 px-4 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 border border-white/5 hover:border-white/10"
                    >
                        Test as Employee
                    </button>
                </div>
            </div>
            
            <p className="mt-8 text-center text-sm text-gray-500">
                Don't have an account? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">Sign up</Link>
            </p>
        </motion.div>
    </div>
  )
}

export default Login;