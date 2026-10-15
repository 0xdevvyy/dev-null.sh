import type { CSSProperties } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import type { User } from '@/types';

export function UserAvatar({
    user,
    className,
    style,
}: {
    user: Pick<User, 'name' | 'avatar_url'>;
    className?: string;
    style?: CSSProperties;
}) {
    const getInitials = useInitials();

    return (
        <Avatar
            className={cn(
                'size-8 overflow-hidden rounded-full bg-muted',
                className,
            )}
            style={style}
        >
            <AvatarImage src={user.avatar_url ?? undefined} alt={user.name} />
            <AvatarFallback className="rounded-full bg-muted font-mono text-[0.8em] text-muted-foreground">
                {getInitials(user.name)}
            </AvatarFallback>
        </Avatar>
    );
}
