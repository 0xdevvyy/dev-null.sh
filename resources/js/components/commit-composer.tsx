import { Form, usePage } from '@inertiajs/react';
import { useState } from 'react';
import CommitController from '@/actions/App/Http/Controllers/CommitController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { cn } from '@/lib/utils';

const minTitleLength = 3;
const maxTitleLength = 72;
const maxDescriptionLength = 500;

export function CommitComposer() {
    const { auth } = usePage().props;
    const [title, setTitle] = useState('');

    const remaining = maxTitleLength - title.length;

    return (
        <Form
            {...CommitController.store.form()}
            options={{ preserveScroll: true }}
            resetOnSuccess
            onSuccess={() => setTitle('')}
            className="flex gap-3 border-b border-sidebar-border/70 px-4 py-4 dark:border-sidebar-border"
        >
            {({ processing, errors }) => (
                <>
                    <UserAvatar user={auth.user} className="size-10" />

                    <div className="flex-1 space-y-2">
                        <label htmlFor="title" className="sr-only">
                            Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            maxLength={maxTitleLength}
                            placeholder="What did you ship?"
                            autoComplete="off"
                            className="w-full bg-transparent text-base font-medium outline-none placeholder:text-muted-foreground"
                        />

                        <InputError message={errors.title} />

                        <label htmlFor="description" className="sr-only">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={2}
                            maxLength={maxDescriptionLength}
                            placeholder="Description (optional)"
                            className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        />

                        <InputError message={errors.description} />

                        <div className="flex items-center justify-end gap-3">
                            <span
                                className={cn(
                                    'text-xs text-muted-foreground tabular-nums',
                                    { 'text-destructive': remaining < 10 },
                                )}
                            >
                                {remaining}
                            </span>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={
                                    processing ||
                                    title.trim().length < minTitleLength
                                }
                                data-test="create-commit-button"
                            >
                                Commit
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </Form>
    );
}
