import { useState } from 'react';
import { NewsPage } from './NewsPage';
import { fetchNews, fetchUserNews } from '../services/news';

export function Tab() {
    const [activeTab, setActiveTab] = useState('explore');

    return (
        <div className="w-full bg-base-300">
            <div role="tablist" className="tabs tabs-lifted w-full mb-4 shadow-md">
                <a
                    role="tab"
                    className={`tab tab-lg [--tab-border-color:gray] ${activeTab === 'explore' ? 'tab-active font-bold' : 'font-semi-bold'}`}
                    onClick={() => setActiveTab('explore')}>
                    Explore
                </a>
                <a
                    role="tab"
                    className={`tab tab-lg [--tab-border-color:gray] ${activeTab === 'myArticles' ? 'tab-active font-bold' : 'font-semibold'}`}
                    onClick={() => setActiveTab('myArticles')}>
                    My Articles
                </a>
            </div>

            <div className="px-24 py-14">
                {activeTab === 'explore' && (
                    <div className="tab-pane">
                        <NewsPage
                            fetchNewsFunction={fetchNews}
                            emptyMessage="There are no news currently available."
                        />
                    </div>
                )}
                {activeTab === 'myArticles' && (
                    <div className="tab-pane">
                        <NewsPage
                            fetchNewsFunction={fetchUserNews}
                            emptyMessage="You haven't posted any articles yet."
                            errorMessage="Failed to fetch your articles. Please try again."
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
