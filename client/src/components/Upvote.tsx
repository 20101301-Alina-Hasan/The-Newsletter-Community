interface UpvoteProps {
    count: number
}

export function Upvote({ count }: UpvoteProps) {
    return (
        <div className="flex items-center space-x-2">
            <button className="btn btn-circle btn-xs btn-outline border-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                </svg>
            </button>
            <span className="text-xs font-semibold">{count}</span>
        </div>
    )
}

