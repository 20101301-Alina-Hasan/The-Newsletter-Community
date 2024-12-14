import { useContext } from 'react';
import { UserContext, UserContextType } from '../interfaces/User';
import { useState } from 'react';
import { NewsPage } from './NewsPage';
import { fetchAllNews, fetchUserNews } from '../services/news';
import { AuthenticationCard } from './AuthenticationCard';

export function Tab() {
    const [activeTab, setActiveTab] = useState('explore');
    const { userState } = useContext(UserContext) as UserContextType;

    return (
        <div className="w-full bg-base-200">
            <div role="tablist" className="tabs tabs-lifted w-full mb-4 shadow-md">
                <a
                    role="tab"
                    className={`tab tab-lg [--tab-border-color:gray] ${activeTab === 'explore' ? 'tab-active font-bold' : 'font-semi-bold'}`}
                    onClick={() => setActiveTab('explore')}
                >
                    Explore
                </a>
                <a
                    role="tab"
                    className={`tab tab-lg [--tab-border-color:gray] ${activeTab === 'myArticles' ? 'tab-active font-bold' : 'font-semibold'}`}
                    onClick={() => { setActiveTab('myArticles'); }}
                >
                    My Articles
                </a>
            </div>

            <div className="px-24 py-14">
                {activeTab === 'explore' && (
                    <div className="tab-pane">
                        <NewsPage
                            fetchNewsFunction={fetchAllNews}
                            emptyMessage="There are no news currently available."
                        />
                    </div>
                )}

                {activeTab === 'myArticles' && userState.token && (
                    <div className="tab-pane">
                        <NewsPage
                            fetchNewsFunction={fetchUserNews}
                            emptyMessage="You haven't posted any articles yet."
                            errorMessage="Failed to fetch your articles. Please try again."
                        />
                    </div>
                )}

                {activeTab === 'myArticles' && !userState.token && (
                    <div className="tab-pane">
                        <p className="text-2xl text-center text-base-content">
                            <span className="text-accent font-semibold">Want to share your thoughts?</span> <br />
                            <strong>Join us now</strong> and start posting your own articles. <br />
                            Become a member of our community <br />
                            in just a few minutes!
                        </p>
                        <AuthenticationCard />
                    </div>
                )}
            </div>
        </div>
    );
}
