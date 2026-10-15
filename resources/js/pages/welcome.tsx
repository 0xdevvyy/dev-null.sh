import { Head, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { GitHubIcon } from '@/components/github-icon';
import { Button } from '@/components/ui/button';
import { login } from '@/routes';

export default function Welcome() {
    const { name } = usePage().props;

    return (
        <>
            <Head title="A social network for developers" />

            <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-6 text-foreground">
                <AppLogoIcon className="size-12 fill-current" />

                <div className="space-y-2 text-center">
                    <h1 className="text-4xl font-bold tracking-tight">
                        {name}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        A social network for developers.
                    </p>
                </div>

                <Button size="lg" asChild>
                    <a href={login().url} data-test="login-button">
                        <GitHubIcon className="size-5" />
                        Sign in with GitHub
                    </a>
                </Button>
            </div>
        </>
    );
}
