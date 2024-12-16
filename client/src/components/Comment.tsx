import { CommentCountProps } from "../interfaces/commentInterface"

export function Comment({ count }: CommentCountProps) {
    return (
        <section className="bg-base-100 py-8 antialiased">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg lg:text-2xl font-bold text-base-content">Discussion ({count})</h2>
                </div>
                <form className="mb-6">
                    <div className="py-2 px-4 mb-4 bg-base-200 rounded-lg border border-base-300">
                        <label htmlFor="comment" className="sr-only">Your comment</label>
                        <textarea
                            id="comment"
                            rows={6}
                            className="px-0 w-full text-sm bg-base-200 border-0 focus:ring-0 focus:outline-none text-base-content placeholder:text-base-content/50"
                            placeholder="Write a comment..."
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Post comment
                    </button>
                </form>
                <article className="p-6 text-base bg-base-200 rounded-lg">
                    <footer className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col space-y-[2px]">
                                <p className="text-md font-bold text-base-content">
                                    Michael Gough
                                </p>
                                <p className="text-xs text-base-content/70 font-semibold">
                                    @michael.gogh
                                </p>
                            </div>
                        </div>
                    </footer>
                    <p className="text-base-content/80">
                        Very straight-to-point article. Really worth time reading. Thank you! But tools are just the
                        instruments for the UX designers. The knowledge of the design tools are as important as the
                        creation of the design strategy.
                    </p>
                    <p className="text-sm text-base/70 text-right">Feb. 8, 2022</p>
                </article>
            </div>
        </section>
    )
}

