import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import type { User } from '@/types';

export function UserAvatar({
    user,
    className,
}: {
    user: Pick<User, 'name' | 'avatar_url'>;
    className?: string;
}) {
    const getInitials = useInitials();

    return (
        <Avatar
            className={cn('size-8 overflow-hidden rounded-full', className)}
        >
            <AvatarImage src={user.avatar_url ?? undefined} alt={user.name} />
            <AvatarFallback className="rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                {getInitials(user.name)}
            </AvatarFallback>
        </Avatar>
    );
}
