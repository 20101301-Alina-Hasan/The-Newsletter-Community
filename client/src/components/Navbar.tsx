/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from 'react';
import { UserContext, UserContextType } from '../interfaces/userInterfaces';
import { ThemeButton } from './ThemeButton';
import { useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Outlet } from 'react-router-dom';
import { showToast } from '../utils/toast';
import { BookMarked, FilePlus } from 'lucide-react';
import { SearchIcon } from './Icons/SearchIcon';
// import Cookies from 'js-cookie';

export function Navbar() {
    const { userState, userDispatch } = useContext(UserContext) as UserContextType;
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        userDispatch({ type: 'logout', payload: undefined });
        showToast('success', 'logged out successfully');
        navigate('/');
    };

    return (
        <>
            <div className="navbar bg-base-100 px-4 py-4 h-18 border-b-gray-500 border-b-[0.05rem]">
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl font-serif font-extrabold" onClick={() => navigate('/')}>
                        <SearchIcon />
                        The Newsletter Community
                    </a>
                </div>
                <div className="flex-1 justify-end">
                    <div className="flex items-center gap-2">
                        {userState.token ? (
                            <div className="space-x-4">
                                <a className="btn btn-primary h-8 font-bold" onClick={() => navigate('/create')}>
                                    <FilePlus />
                                </a>
                                <HashLink to="/dashboard#bookmarks" scroll={(el) => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                                    <a className="btn bg-red-700 hover:bg-red-800 text-white h-8 font-bold" >
                                        <BookMarked />
                                    </a>
                                </HashLink>
                            </div>
                        ) : null}
                        <div className="bg-base-200 rounded-lg flex items-center h-12 pr-2 pl-4">
                            <ThemeButton />
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                                    <SearchIcon />
                                </div>
                                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-4 shadow-lg space-y-2">
                                    {userState.token ? (
                                        <>
                                            <div className="text-md text-center font-semibold">Hi, {userState.user?.name}!</div>
                                            <div className="divider divider-primary my-[2px]" />
                                            <li><a onClick={() => navigate('/dashboard')}>Dashboard</a></li>
                                            <HashLink to="/dashboard#bookmarks" scroll={(el) => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                                                <li><a>Bookmarks</a></li>
                                            </HashLink>
                                            <li><a onClick={() => navigate('/')}>Explore</a></li>
                                            <li><a onClick={handleLogout}>Logout</a></li>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-md text-center font-semibold">Welcome!</div>
                                            <div className="divider divider-primary my-[2px]" />
                                            <li><a onClick={() => navigate('/')}>Explore</a></li>
                                            <li className="text-md font-semibold">
                                                <a onClick={() => navigate('/login')}>Login</a>
                                            </li>
                                        </>
                                    )}
                                    <div className='btn btn-md btn-base-100 mt-[2px] border-base-300 hover:btn-base-300'>
                                        <a onClick={() => navigate('/signup')}>Create an account?</a>
                                    </div>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Outlet />
        </>
    );
}
