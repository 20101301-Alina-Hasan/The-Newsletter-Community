import { useState } from 'react'

export function Tab() {
    const [activeTab, setActiveTab] = useState('myArticles')
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
        </div>
    )
}

