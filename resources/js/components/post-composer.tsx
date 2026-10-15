import { Form, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PostController from '@/actions/App/Http/Controllers/PostController';
import { GraphRail } from '@/components/graph-rail';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { cn, laneFor } from '@/lib/utils';

const minLength = 3;
const maxLength = 280;

export function PostComposer() {
    const { auth } = usePage().props;
    const [body, setBody] = useState('');

    const remaining = maxLength - body.length;
    const isPostable = body.trim().length >= minLength;

    return (
        <Form
            {...PostController.store.form()}
            options={{ preserveScroll: true }}
            resetOnSuccess
            onSuccess={() => setBody('')}
            className="flex"
        >
            {({ processing, errors }) => (
                <>
                    <GraphRail
                        lane={laneFor(auth.user.id)}
                        variant="staged"
                        isFilled={isPostable}
                    />

                    <div className="flex min-w-0 flex-1 gap-3 border-b py-3 pr-4">
                        <UserAvatar
                            user={auth.user}
                            className="hidden size-10 sm:flex"
                        />

                        <div className="min-w-0 flex-1">
                            <label htmlFor="body" className="sr-only">
                                New commit
                            </label>
                            <textarea
                                id="body"
                                name="body"
                                rows={2}
                                value={body}
                                onChange={(event) =>
                                    setBody(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (
                                        event.key === 'Enter' &&
                                        (event.metaKey || event.ctrlKey) &&
                                        isPostable
                                    ) {
                                        event.currentTarget.form?.requestSubmit();
                                    }
                                }}
                                maxLength={maxLength}
                                placeholder="Write something. It goes to /dev/null eventually."
                                aria-invalid={errors.body ? true : undefined}
                                aria-describedby="body-count"
                                className="block field-sizing-content min-h-14 w-full resize-none bg-transparent pt-1.5 text-[17px] leading-snug outline-none placeholder:text-muted-foreground focus-visible:outline-none"
                            />

                            <InputError message={errors.body} />

                            <div className="mt-2 flex items-center justify-end gap-4">
                                <span
                                    id="body-count"
                                    aria-label={`${remaining} characters left`}
                                    className={cn(
                                        'font-mono text-[13px] text-muted-foreground',
                                        {
                                            'text-amber-700 dark:text-amber-400':
                                                remaining <= 20,
                                            'text-destructive': remaining === 0,
                                        },
                                    )}
                                >
                                    {remaining}
                                </span>
                                <Button
                                    type="submit"
                                    disabled={processing || !isPostable}
                                    title="Commit (⌘/Ctrl + Enter)"
                                    data-test="create-post-button"
                                >
                                    {processing ? 'Committing…' : 'Commit'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Form>
    );
}
