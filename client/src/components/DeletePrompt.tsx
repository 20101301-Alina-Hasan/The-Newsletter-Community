/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { showToast } from '../utils/toast';
import { deleteNews } from '../services/newsService';


export const DeletePrompt = (news_id: number, token: string, onDeleteSuccess: () => void, onClose: () => void) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteNews(news_id, token);
            showToast('success', 'News deleted successfully.');
            onDeleteSuccess();
        } catch (error: any) {
            showToast('error', `${error.message}: Error deleting news.`);
        } finally {
            setIsDeleting(false);
            onClose();
        }
    };

    return (
        <>
            <div className="modal modal-open">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Are you sure you want to delete this article?</h3>
                    <p className="py-4">This action cannot be undone.</p>

                    <div className="modal-action">
                        <button
                            className="btn btn-secondary"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-error"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
};
