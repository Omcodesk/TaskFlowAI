import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { SocketContext } from '../../context/SocketProvider';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import OnlineUsers from './OnlineUsers';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  const logOutUser = () => {
    logout();
    navigate('/');
  };

  const location = useLocation();

  return (
    <div className='flex items-center justify-between border-b border-white/5 pb-4'>
        <div className='flex items-center gap-8'>
          <h1 className='text-xl font-medium text-white'>Task<span className="text-indigo-500 font-bold">Flow</span></h1>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link 
              to="/dashboard" 
              className={`transition-colors ${location.pathname.startsWith('/dashboard') ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Dashboard
            </Link>
            <Link to="/kanban" className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${location.pathname === '/kanban' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              Board
            </Link>
            {user?.role !== 'Employee' && (
              <>
                <Link to="/projects" className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${location.pathname === '/projects' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  Projects
                </Link>
                <Link to="/analytics" className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${location.pathname === '/analytics' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  Analytics
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <OnlineUsers socket={socket} />
          
          <div className="h-6 w-px bg-white/10 hidden md:block"></div>

          <NotificationBell socket={socket} />
          
          <div className="hidden md:block text-right border-l border-white/10 pl-4">
            <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          <button onClick={logOutUser} className='bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-sm font-medium px-4 py-2 rounded-xl transition-colors'>
            Log Out
          </button>
        </div>
    </div>
  );
}

export default Header;