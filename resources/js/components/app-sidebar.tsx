import { Link, usePage } from '@inertiajs/react';
import { Globe, House, UserRound } from 'lucide-react';
import LogController from '@/actions/App/Http/Controllers/LogController';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { show } from '@/routes/user';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Log',
            href: LogController.show('following'),
            icon: House,
        },
        {
            title: 'Explore',
            href: LogController.show('everyone'),
            icon: Globe,
        },
        {
            title: 'Profile',
            href: show(auth.user),
            icon: UserRound,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href={LogController.show('following')}
                                prefetch
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
