export function formatDate(isoDate: string): string {
    const date = new Date(isoDate);

    const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    return date.toLocaleDateString("en-US", options);
}

export const timeAgo = (timestamp: string): string => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
    const minutes = 60;
    const hours = 60 * minutes;
    const days = 24 * hours;
    const months = 30 * days;
    const years = 12 * months;

    if (diffInSeconds < minutes) {
        return `${Math.floor(diffInSeconds)} seconds ago`;
    } else if (diffInSeconds < hours) {
        return `${Math.floor(diffInSeconds / minutes)} minute${diffInSeconds / minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < days) {
        return `${Math.floor(diffInSeconds / hours)} hour${diffInSeconds / hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < months) {
        return `${Math.floor(diffInSeconds / days)} day${diffInSeconds / days > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < years) {
        return `${Math.floor(diffInSeconds / months)} month${diffInSeconds / months > 1 ? 's' : ''} ago`;
    } else {
        return `${Math.floor(diffInSeconds / years)} year${diffInSeconds / years > 1 ? 's' : ''} ago`;
    }
};

