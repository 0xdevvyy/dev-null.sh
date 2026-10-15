import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

type Props = {
    lane: string;
    previousLane?: string;
    variant?: 'commit' | 'staged' | 'root';
    isFilled?: boolean;
    isFresh?: boolean;
    hasTail?: boolean;
};

export function GraphRail({
    lane,
    previousLane,
    variant = 'commit',
    isFilled = true,
    isFresh = false,
    hasTail = true,
}: Props) {
    return (
        <div
            aria-hidden
            className="relative w-11 shrink-0 sm:w-14"
            style={{ '--lane': lane } as CSSProperties}
        >
            {previousLane && (
                <span
                    className="absolute top-0 left-1/2 h-8 w-0.5 -translate-x-1/2"
                    style={{ background: previousLane }}
                />
            )}

            {hasTail &&
                (variant === 'staged' ? (
                    <span className="absolute top-8 bottom-0 left-1/2 -translate-x-1/2 border-l-2 border-dashed border-rail" />
                ) : (
                    <span className="absolute top-8 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-(--lane)" />
                ))}

            <span
                className={cn(
                    'absolute top-8 left-1/2 size-3.5 -translate-1/2 rounded-full border-[3px] border-card bg-(--lane) shadow-[0_0_0_2px_var(--lane)] transition-colors duration-300',
                    {
                        'bg-card': !isFilled || variant === 'root',
                        'motion-safe:animate-node-in': isFresh,
                    },
                )}
            />
        </div>
    );
}
