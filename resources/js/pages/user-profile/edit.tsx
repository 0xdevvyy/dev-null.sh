import { Head, Link, usePage } from '@inertiajs/react';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { show } from '@/routes/user';
import { edit } from '@/routes/user-profile';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit(),
    },
];

export default function Edit() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile information"
                    description="Your profile is synced from GitHub every time you sign in"
                />

                <div className="flex items-center gap-4">
                    <UserAvatar user={auth.user} className="size-16" />
                    <div>
                        <p className="font-medium">{auth.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                            @{auth.user.username}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button asChild>
                        <a
                            href="https://github.com/settings/profile"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Edit on GitHub
                        </a>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={show(auth.user)}>View profile</Link>
                    </Button>
                </div>
            </div>

            <DeleteUser />
        </>
    );
}

Edit.layout = [[AppLayout, { breadcrumbs }], SettingsLayout];
