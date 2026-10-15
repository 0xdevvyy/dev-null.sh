import { Head, Link, usePage } from '@inertiajs/react';
import { Building2, CalendarDays, Link2, MapPin } from 'lucide-react';
import UserFollowController from '@/actions/App/Http/Controllers/UserFollowController';
import { GitHubIcon } from '@/components/github-icon';
import { PostFeed } from '@/components/post-feed';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import AppLayout from '@/layouts/app-layout';
import type { CursorPaginated, Post, Profile } from '@/types';

export default function Show({
    user,
    isFollowing,
    posts,
}: {
    user: Profile;
    isFollowing: boolean;
    posts: CursorPaginated<Post>;
}) {
    const { auth } = usePage().props;
    const isCurrentUser = auth.user.id === user.id;

    return (
        <>
            <Head title={`${user.name} (@${user.username})`} />

            <div className="mx-auto w-full max-w-2xl border-x border-sidebar-border/70 dark:border-sidebar-border">
                <header className="space-y-4 border-b border-sidebar-border/70 px-4 py-6 dark:border-sidebar-border">
                    <div className="flex items-start justify-between gap-4">
                        <UserAvatar user={user} className="size-24 text-2xl" />

                        {isCurrentUser ? (
                            <Button variant="outline" asChild>
                                <a
                                    href="https://github.com/settings/profile"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Edit on GitHub
                                </a>
                            </Button>
                        ) : (
                            <Button
                                variant={isFollowing ? 'outline' : 'default'}
                                asChild
                            >
                                <Link
                                    href={
                                        isFollowing
                                            ? UserFollowController.destroy(user)
                                            : UserFollowController.store(user)
                                    }
                                    as="button"
                                    preserveScroll
                                    data-test="follow-button"
                                >
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </Link>
                            </Button>
                        )}
                    </div>

                    <div>
                        <h1 className="text-xl font-bold">{user.name}</h1>
                        <p className="text-muted-foreground">
                            @{user.username}
                        </p>
                    </div>

                    {user.bio && (
                        <p className="break-words whitespace-pre-wrap">
                            {user.bio}
                        </p>
                    )}

                    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        {user.company && (
                            <li className="flex items-center gap-1">
                                <Building2 className="size-4" />
                                {user.company}
                            </li>
                        )}
                        {user.location && (
                            <li className="flex items-center gap-1">
                                <MapPin className="size-4" />
                                {user.location}
                            </li>
                        )}
                        {user.website && (
                            <li className="flex items-center gap-1">
                                <Link2 className="size-4" />
                                <a
                                    href={user.website}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="text-foreground hover:underline"
                                >
                                    {user.website.replace(/^https?:\/\//u, '')}
                                </a>
                            </li>
                        )}
                        <li className="flex items-center gap-1">
                            <GitHubIcon className="size-4" />
                            <a
                                href={`https://github.com/${user.username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground hover:underline"
                            >
                                {user.username}
                            </a>
                        </li>
                        <li className="flex items-center gap-1">
                            <CalendarDays className="size-4" />
                            Joined{' '}
                            {new Date(user.created_at).toLocaleDateString(
                                undefined,
                                { month: 'long', year: 'numeric' },
                            )}
                        </li>
                    </ul>

                    <ul className="flex gap-4 text-sm">
                        <li>
                            <span className="font-semibold">
                                {user.posts_count}
                            </span>{' '}
                            <span className="text-muted-foreground">
                                {user.posts_count === 1 ? 'Post' : 'Posts'}
                            </span>
                        </li>
                        <li>
                            <span className="font-semibold">
                                {user.following_count}
                            </span>{' '}
                            <span className="text-muted-foreground">
                                Following
                            </span>
                        </li>
                        <li>
                            <span className="font-semibold">
                                {user.followers_count}
                            </span>{' '}
                            <span className="text-muted-foreground">
                                {user.followers_count === 1
                                    ? 'Follower'
                                    : 'Followers'}
                            </span>
                        </li>
                    </ul>
                </header>

                <PostFeed
                    posts={posts}
                    empty={
                        isCurrentUser
                            ? "You haven't posted anything yet."
                            : `@${user.username} hasn't posted anything yet.`
                    }
                />
            </div>
        </>
    );
}

Show.layout = [AppLayout, {}];
