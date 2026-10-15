import { Form, usePage } from '@inertiajs/react';
import type { KeyboardEvent } from 'react';
import { useState } from 'react';
import CommitController from '@/actions/App/Http/Controllers/CommitController';
import { GraphRail } from '@/components/graph-rail';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { cn, laneFor } from '@/lib/utils';

const minTitleLength = 3;
const maxTitleLength = 72;
const maxDescriptionLength = 500;

export function CommitComposer() {
    const { auth } = usePage().props;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const remaining = maxTitleLength - title.length;
    const isCommittable = title.trim().length >= minTitleLength;
    const hint = titleHint(title);

    const submitOnModEnter = (
        event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        if (
            event.key === 'Enter' &&
            (event.metaKey || event.ctrlKey) &&
            isCommittable
        ) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
        }
    };

    return (
        <Form
            {...CommitController.store.form()}
            options={{ preserveScroll: true }}
            onSuccess={(page) => {
                if (!page.flash.committed) {
                    return;
                }

                setTitle('');
                setDescription('');
                requestAnimationFrame(() =>
                    document.getElementById('title')?.focus(),
                );
            }}
            className="flex"
        >
            {({ processing, errors }) => (
                <>
                    <GraphRail
                        lane={laneFor(auth.user.id)}
                        variant="staged"
                        isFilled={isCommittable}
                    />

                    <div className="flex min-w-0 flex-1 gap-3 border-b py-3 pr-4">
                        <UserAvatar
                            user={auth.user}
                            className="hidden size-10 sm:flex"
                        />

                        <div className="min-w-0 flex-1">
                            <label htmlFor="title" className="sr-only">
                                Title
                            </label>
                            <input
                                id="title"
                                name="title"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (
                                        event.key === 'Enter' &&
                                        !isCommittable
                                    ) {
                                        event.preventDefault();
                                    }

                                    submitOnModEnter(event);
                                }}
                                maxLength={maxTitleLength}
                                placeholder="What did you ship?"
                                autoComplete="off"
                                aria-invalid={errors.title ? true : undefined}
                                aria-describedby="title-count title-hint"
                                className="block h-10 w-full bg-transparent text-[17px] font-medium outline-none placeholder:font-normal placeholder:text-muted-foreground focus-visible:outline-none"
                            />

                            <InputError message={errors.title} />

                            <p
                                id="title-hint"
                                aria-live="polite"
                                className="text-[13px] text-amber-700 empty:hidden dark:text-amber-400"
                            >
                                {hint}
                            </p>

                            <label htmlFor="description" className="sr-only">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={1}
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                onKeyDown={submitOnModEnter}
                                maxLength={maxDescriptionLength}
                                placeholder="Description (optional). It all goes to /dev/null eventually."
                                aria-invalid={
                                    errors.description ? true : undefined
                                }
                                className="block field-sizing-content min-h-7 w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-muted-foreground focus-visible:outline-none"
                            />

                            <InputError message={errors.description} />

                            <div className="mt-2 flex items-center justify-end gap-4">
                                <span
                                    id="title-count"
                                    aria-label={`${remaining} title characters left`}
                                    className={cn(
                                        'font-mono text-[13px] text-muted-foreground',
                                        {
                                            'text-amber-700 dark:text-amber-400':
                                                remaining <= 10,
                                            'text-destructive': remaining === 0,
                                        },
                                    )}
                                >
                                    {remaining}
                                </span>
                                <Button
                                    type="submit"
                                    disabled={processing || !isCommittable}
                                    title="Commit (⌘/Ctrl + Enter)"
                                    data-test="create-commit-button"
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

function titleHint(title: string): string | null {
    const trimmed = title.trim();

    if (trimmed.length > 50) {
        return 'git suggests keeping the subject under 50 characters.';
    }

    if (trimmed.endsWith('.') && !trimmed.endsWith('...')) {
        return 'git subject lines skip the trailing period.';
    }

    return null;
}
