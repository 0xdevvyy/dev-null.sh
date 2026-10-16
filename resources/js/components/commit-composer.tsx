import { Form, Link, usePage } from '@inertiajs/react';
import { ChartBar, Clock3 } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import CommitController from '@/actions/App/Http/Controllers/CommitController';
import ScheduledCommitController from '@/actions/App/Http/Controllers/ScheduledCommitController';
import { BodyCounter } from '@/components/body-counter';
import {
    ImagePickerButton,
    ImagePickerPreviews,
    imageErrorFrom,
} from '@/components/commit-image-picker';
import { EmojiSuggestionHint } from '@/components/emoji-suggestion';
import { GraphRail, RailAvatar } from '@/components/graph-rail';
import InputError from '@/components/input-error';
import { LinkCardPicker } from '@/components/link-card-picker';
import { MentionTextarea } from '@/components/mention-textarea';
import type { PollDraft } from '@/components/poll-editor';
import { emptyPollDraft, PollEditor } from '@/components/poll-editor';
import { SecretWarning } from '@/components/secret-warning';
import { StashLabel } from '@/components/stash-label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useImageAttachments } from '@/hooks/use-image-attachments';
import { useLinkCard } from '@/hooks/use-link-card';
import { useSecretWarning } from '@/hooks/use-secret-warning';
import {
    discardSeriesStash,
    moveCaretToEnd,
    useStash,
} from '@/hooks/use-stash';
import { useUser } from '@/hooks/use-user';
import { maxBodyLength, minBodyLength } from '@/lib/commit';
import { completeEmoji, suggestEmoji } from '@/lib/emoji';
import { characterCount, laneColor } from '@/lib/utils';

export function CommitComposer() {
    const [isScheduling, setIsScheduling] = useState(false);
    const [scheduledAt, setScheduledAt] = useState('');
    const [timezone, setTimezone] = useState('');
    const { auth } = usePage().props;
    const { user } = useUser();
    const { body, isRestored, updateBody, drop } = useStash(user.id, 'commit');
    const attachments = useImageAttachments();
    const [poll, setPoll] = useState<PollDraft | null>(null);
    const hasImages = attachments.images.length > 0;
    const linkCard = useLinkCard(body);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const secrets = useSecretWarning(body);
    const suggestion = suggestEmoji(body);

    useEffect(() => discardSeriesStash(user.id), [user.id]);

    const isFilled = characterCount(body.trim()) >= minBodyLength;
    const isCommittable =
        isFilled &&
        (poll === null ||
            poll.options.every((option) => option.trim().length > 0));

    const isSchedulingImages = isScheduling && hasImages;
    const isSubmittable =
        isCommittable &&
        !isSchedulingImages &&
        (!isScheduling || poll === null);

    const focusBody = () =>
        requestAnimationFrame(() => textareaRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Tab' && suggestion !== null) {
            const completed = completeEmoji(body);

            if (completed !== null) {
                event.preventDefault();
                updateBody(completed);
            }

            return;
        }

        if (
            event.key === 'Enter' &&
            (event.metaKey || event.ctrlKey) &&
            isSubmittable
        ) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
        }
    };

    return (
        <Form
            {...(isScheduling
                ? ScheduledCommitController.store.form()
                : CommitController.store.form())}
            onBefore={secrets.beforeSubmit}
            transform={(data) =>
                isScheduling
                    ? {
                          ...data,
                          scheduled_at: new Date(scheduledAt)
                              .toISOString()
                              .replace(/\.\d{3}Z$/, '+00:00'),
                      }
                    : hasImages
                      ? { ...data, images: attachments.images }
                      : data
            }
            options={{ preserveScroll: true }}
            onSuccess={(page) => {
                if (!page.flash.committed) {
                    return;
                }

                drop();
                setScheduledAt('');
                setIsScheduling(false);
                attachments.clear();
                setPoll(null);
                linkCard.reset();
                focusBody();
            }}
            className="flex"
            data-test="commit-composer"
        >
            {({ processing, errors }) => (
                <>
                    <GraphRail
                        lane={laneColor(user.lane)}
                        variant="staged"
                        isFilled={isFilled}
                        node={<RailAvatar user={user} isStaged={!isFilled} />}
                    />

                    <div className="flex min-w-0 flex-1 border-b pt-3 pr-4 pb-3">
                        <div className="min-w-0 flex-1">
                            <label htmlFor="body" className="sr-only">
                                Body
                            </label>
                            <MentionTextarea
                                ref={textareaRef}
                                id="body"
                                name="body"
                                rows={1}
                                value={body}
                                onValueChange={updateBody}
                                onPaste={
                                    poll === null
                                        ? attachments.onPaste
                                        : undefined
                                }
                                onDragOver={
                                    poll === null
                                        ? attachments.onDragOver
                                        : undefined
                                }
                                onDrop={
                                    poll === null
                                        ? attachments.onDrop
                                        : undefined
                                }
                                onKeyDown={onKeyDown}
                                onFocus={
                                    isRestored ? moveCaretToEnd : undefined
                                }
                                maxLength={maxBodyLength}
                                placeholder={
                                    poll
                                        ? 'Ask a question'
                                        : 'What did you ship?'
                                }
                                autoComplete="off"
                                aria-invalid={errors.body ? true : undefined}
                                aria-describedby="body-count"
                                className="block field-sizing-content max-h-[60dvh] min-h-10 w-full resize-none overflow-x-hidden overflow-y-auto bg-transparent py-1.5 text-[17px] leading-relaxed outline-none placeholder:text-muted-foreground focus-visible:outline-none"
                            />

                            <EmojiSuggestionHint
                                suggestion={suggestion}
                                className="mt-1.5"
                            />

                            <InputError
                                message={errors.body ?? errors.link_preview_url}
                            />
                            <SecretWarning
                                body={body}
                                findings={secrets.findings}
                                textarea={textareaRef}
                                onChange={updateBody}
                                confirming={secrets.confirming}
                                onConfirmingChange={secrets.setConfirming}
                                onApprove={secrets.approve}
                            />

                            <ImagePickerPreviews
                                images={attachments.images}
                                onRemove={attachments.remove}
                            />
                            <InputError
                                message={
                                    attachments.error ??
                                    (isSchedulingImages
                                        ? "Images can't be scheduled yet. Remove them to schedule this commit."
                                        : imageErrorFrom(errors))
                                }
                                className="mt-1"
                            />

                            {poll && (
                                <PollEditor
                                    poll={poll}
                                    errors={errors}
                                    onChange={setPoll}
                                    onRemove={() => {
                                        setPoll(null);
                                        focusBody();
                                    }}
                                />
                            )}

                            {isScheduling && (
                                <div
                                    id="commit-schedule"
                                    className="mt-3 space-y-2 rounded-lg border bg-muted/30 p-3"
                                >
                                    <label
                                        htmlFor="scheduled-at"
                                        className="text-sm font-medium"
                                    >
                                        Submit at
                                    </label>
                                    <Input
                                        id="scheduled-at"
                                        type="datetime-local"
                                        required
                                        value={scheduledAt}
                                        onChange={(event) => {
                                            const value = event.target.value;
                                            setScheduledAt(value);
                                            const date = new Date(value);
                                            const pad = (n: number) =>
                                                String(n).padStart(2, '0');
                                            const local = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
                                            event.target.setCustomValidity(
                                                value && local !== value
                                                    ? 'This time does not exist in your timezone. Choose another time.'
                                                    : '',
                                            );
                                        }}
                                        aria-describedby="schedule-help schedule-error"
                                        aria-invalid={
                                            errors.scheduled_at
                                                ? true
                                                : undefined
                                        }
                                    />
                                    <p
                                        id="schedule-help"
                                        className="text-xs leading-relaxed text-muted-foreground"
                                    >
                                        {timezone}
                                        {scheduledAt &&
                                        !Number.isNaN(
                                            new Date(scheduledAt).getTime(),
                                        )
                                            ? ` (${new Intl.DateTimeFormat(undefined, { timeZoneName: 'shortOffset' }).formatToParts(new Date(scheduledAt)).find((part) => part.type === 'timeZoneName')?.value})`
                                            : ''}
                                        . Within 30 days. Private until
                                        submitted;{' '}
                                        {auth.isAdmin
                                            ? 'your commit will be approved automatically.'
                                            : 'then submitted for review, not published automatically.'}
                                    </p>
                                    <InputError
                                        id="schedule-error"
                                        message={errors.scheduled_at}
                                    />
                                    <Link
                                        href={ScheduledCommitController.index()}
                                        className="text-xs font-medium text-primary hover:underline"
                                    >
                                        Scheduled commits →
                                    </Link>
                                </div>
                            )}

                            <div className="mt-2 flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
                                <div className="mr-auto flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
                                    {!isScheduling && (
                                        <ImagePickerButton
                                            count={attachments.images.length}
                                            disabled={
                                                processing || poll !== null
                                            }
                                            onPick={attachments.attach}
                                            className="-ml-2"
                                        />
                                    )}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        disabled={
                                            processing ||
                                            poll !== null ||
                                            hasImages ||
                                            isScheduling
                                        }
                                        onClick={() => {
                                            setPoll(emptyPollDraft);
                                            requestAnimationFrame(() =>
                                                document
                                                    .getElementById(
                                                        'poll-option-0',
                                                    )
                                                    ?.focus(),
                                            );
                                        }}
                                        aria-label="Add poll"
                                        title={
                                            isScheduling
                                                ? 'Polls cannot be scheduled yet'
                                                : hasImages
                                                  ? 'A commit can have images or a poll, not both'
                                                  : 'Add poll'
                                        }
                                        className="text-muted-foreground"
                                        data-test="add-poll-button"
                                    >
                                        <ChartBar className="size-5" />
                                    </Button>
                                    {!isScheduling && (
                                        <LinkCardPicker
                                            linkCard={linkCard}
                                            disabled={processing}
                                            className="-ml-3"
                                        />
                                    )}
                                    {isRestored && (
                                        <StashLabel
                                            onDrop={() => {
                                                drop();
                                                linkCard.reset();
                                                focusBody();
                                            }}
                                            className="text-[13px]"
                                        />
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    aria-expanded={isScheduling}
                                    aria-controls="commit-schedule"
                                    disabled={
                                        processing ||
                                        (!isScheduling &&
                                            (hasImages || poll !== null))
                                    }
                                    title={
                                        !isScheduling && poll !== null
                                            ? 'Polls cannot be scheduled yet'
                                            : !isScheduling && hasImages
                                              ? "Images can't be scheduled yet"
                                              : undefined
                                    }
                                    onClick={() => {
                                        setTimezone(
                                            Intl.DateTimeFormat().resolvedOptions()
                                                .timeZone,
                                        );
                                        setIsScheduling(!isScheduling);
                                    }}
                                    className="gap-1.5 px-2 text-muted-foreground"
                                >
                                    <Clock3
                                        className="size-3.5"
                                        aria-hidden="true"
                                    />
                                    Schedule
                                </Button>
                                <BodyCounter
                                    id="body-count"
                                    body={body}
                                    className="text-[13px]"
                                />
                                <Button
                                    type="submit"
                                    disabled={processing || !isSubmittable}
                                    title={
                                        isScheduling
                                            ? 'Schedule commit (⌘/Ctrl + Enter)'
                                            : 'Commit (⌘/Ctrl + Enter)'
                                    }
                                    className="min-w-[7.5rem]"
                                    data-test="create-commit-button"
                                >
                                    {isScheduling
                                        ? processing
                                            ? 'Scheduling…'
                                            : 'Schedule commit'
                                        : processing
                                          ? 'Committing…'
                                          : 'Commit'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Form>
    );
}
