import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

export default function Update() {
    return (
        <>
            <Head title="Appearance settings" />

            <section className="px-4 py-6 sm:px-6">
                <Heading
                    title="Theme"
                    description="System follows your operating system, light by day and dark by night if that's how you have it set."
                />
                <AppearanceTabs />
            </section>
        </>
    );
}

Update.layout = [AppLayout, SettingsLayout];
