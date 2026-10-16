import { Form, Head, Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, Download, RefreshCw } from 'lucide-react';
import ExportController from '@/actions/App/Http/Controllers/ExportController';
import UserProfileController from '@/actions/App/Http/Controllers/UserProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import LanePicker from '@/components/lane-picker';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { UserAvatar } from '@/components/user-avatar';
import { useNow } from '@/hooks/use-now';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { formatFullDateTime } from '@/lib/utils';
import { show } from '@/routes/user';

function formatSyncedAgo(date: string, now: Date): string {
    const seconds = Math.round(
        (now.getTime() - new Date(date).getTime()) / 1000,
    );

    if (seconds < 60) {
        return 'just now';
    }

    const [value, unit]: [number, Intl.RelativeTimeFormatUnit] =
        seconds < 3600
            ? [Math.floor(seconds / 60), 'minute']
            : seconds < 86400
              ? [Math.floor(seconds / 3600), 'hour']
              : [Math.floor(seconds / 86400), 'day'];

    return new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' }).format(
        -value,
        unit,
    );
}

export default function Edit({
    preferredLane,
    automaticLane,
    githubSyncedAt,
}: {
    preferredLane: number | null;
    automaticLane: number;
    githubSyncedAt: string | null;
}) {
    const { auth } = usePage().props;
    const now = useNow();

    const fields = [
        { label: 'name', value: auth.user.name },
        { label: 'username', value: `@${auth.user.username}` },
        { label: 'bio', value: auth.user.bio },
        { label: 'company', value: auth.user.company },
        { label: 'location', value: auth.user.location },
        { label: 'website', value: auth.user.website },
        {
            label: 'sponsors',
            value: auth.user.has_sponsors_listing
                ? `github.com/sponsors/${auth.user.username}`
                : null,
        },
    ];

    return (
        <>
            <Head title="Profile settings" />

            <section className="px-4 py-6 sm:px-6">
                <Heading
                    title="Profile information"
                    description="Mirrored from GitHub when you sign in. To change any of it, change it on GitHub, then sync it here."
                />

                <div className="flex items-center gap-4">
                    <UserAvatar user={auth.user} className="size-14" />
                    <div className="min-w-0">
                        <p className="truncate font-semibold">
                            {auth.user.name}
                        </p>
                        <p className="truncate font-mono text-sm text-muted-foreground">
                            @{auth.user.username}
                        </p>
                    </div>
                </div>

                <dl className="mt-5 divide-y rounded-lg border text-sm">
                    {fields.map((field) => (
                        <div
                            key={field.label}
                            className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 px-4 py-2.5"
                        >
                            <dt className="font-mono text-[13px] text-muted-foreground">
                                {field.label}
                            </dt>
                            <dd
                                className={
                                    field.value
                                        ? 'break-words'
                                        : 'font-mono text-[13px] text-muted-foreground'
                                }
                            >
                                {field.value ?? 'null'}
                            </dd>
                        </div>
                    ))}
                </dl>

                <div className="mt-5 flex flex-wrap gap-2">
                    <Button asChild>
                        <a
                            href="https://github.com/settings/profile"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Edit on GitHub
                            <ArrowUpRight />
                        </a>
                    </Button>
                    <Form
                        {...UserProfileController.update.form()}
                        options={{ preserveScroll: true }}
                    >
                        {({ processing }) => (
                            <Button
                                type="submit"
                                variant="outline"
                                disabled={processing}
                                aria-busy={processing}
                                data-test="sync-profile-button"
                            >
                                {processing ? <Spinner /> : <RefreshCw />}
                                Sync from GitHub
                            </Button>
                        )}
                    </Form>
                    <Button variant="outline" asChild>
                        <Link href={show(auth.user)}>View profile</Link>
                    </Button>
                </div>

                <p
                    className="mt-3 text-sm text-muted-foreground"
                    aria-live="polite"
                >
                    {githubSyncedAt ? (
                        <>
                            Last synced{' '}
                            <time
                                dateTime={githubSyncedAt}
                                title={formatFullDateTime(githubSyncedAt)}
                            >
                                {formatSyncedAgo(githubSyncedAt, now)}
                            </time>
                        </>
                    ) : (
                        'Last synced when you signed in'
                    )}
                </p>
            </section>

            <LanePicker
                preferredLane={preferredLane}
                automaticLane={automaticLane}
            />

            <section className="px-4 py-6 sm:px-6">
                <Heading
                    title="Export your data"
                    description="Download your GitHub profile as stored here, your color preference, all your live commits and replies with their moderation status, and the usernames you follow. Includes pending and rejected commits."
                />
                <p className="mb-5 text-sm text-muted-foreground">
                    Deleted commits and other people's replies are excluded.
                    Your export is a JSON file. Your profile is still managed on
                    GitHub.
                </p>
                <Button variant="outline" asChild>
                    <a href={ExportController.url()} download>
                        <Download />
                        Download JSON
                    </a>
                </Button>
            </section>

            <DeleteUser />
        </>
    );
}

Edit.layout = [AppLayout, SettingsLayout];
