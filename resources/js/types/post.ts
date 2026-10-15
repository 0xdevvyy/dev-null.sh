import type { User } from '@/types/auth';

export type Post = {
    id: string;
    user_id: string;
    body: string;
    created_at: string;
    updated_at: string;
    user: User;
};

export type CursorPaginated<T> = {
    data: T[];
    next_cursor: string | null;
    prev_cursor: string | null;
};
