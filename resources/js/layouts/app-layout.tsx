import { AppAside } from '@/components/app-aside';
import { AppNav, MobileHeader, MobileNav } from '@/components/app-nav';
import type { AppLayoutProps } from '@/types';

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="mx-auto flex min-h-svh w-full max-w-[1264px] justify-center">
            <AppNav />

            <main className="min-w-0 flex-1 bg-card pb-20 md:max-w-[620px] md:border-x md:pb-0">
                <MobileHeader />
                {children}
            </main>

            <AppAside />

            <MobileNav />
        </div>
    );
}
