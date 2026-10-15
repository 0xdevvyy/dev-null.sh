import { Form, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PostController from '@/actions/App/Http/Controllers/PostController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { cn } from '@/lib/utils';

const minLength = 3;
const maxLength = 280;

export function PostComposer() {
    const { auth } = usePage().props;
    const [body, setBody] = useState('');

    const remaining = maxLength - body.length;

    return (
        <Form
            {...PostController.store.form()}
            options={{ preserveScroll: true }}
            resetOnSuccess
            onSuccess={() => setBody('')}
            className="flex gap-3 border-b border-sidebar-border/70 px-4 py-4 dark:border-sidebar-border"
        >
            {({ processing, errors }) => (
                <>
                    <UserAvatar user={auth.user} className="size-10" />

                    <div className="flex-1 space-y-2">
                        <label htmlFor="body" className="sr-only">
                            What's happening?
                        </label>
                        <textarea
                            id="body"
                            name="body"
                            rows={3}
                            value={body}
                            onChange={(event) => setBody(event.target.value)}
                            maxLength={maxLength}
                            placeholder="What's happening?"
                            className="w-full resize-none bg-transparent text-base outline-none placeholder:text-muted-foreground"
                        />

                        <InputError message={errors.body} />

                        <div className="flex items-center justify-end gap-3">
                            <span
                                className={cn(
                                    'text-xs text-muted-foreground tabular-nums',
                                    { 'text-destructive': remaining < 20 },
                                )}
                            >
                                {remaining}
                            </span>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={
                                    processing || body.trim().length < minLength
                                }
                                data-test="create-post-button"
                            >
                                Post
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </Form>
    );
}
