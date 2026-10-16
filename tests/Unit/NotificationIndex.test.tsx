/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createInertiaApp } from '@inertiajs/react';
import { renderToString } from 'react-dom/server';
import Index from '../../resources/js/pages/notification/index';
import type { Commit, Notification, User } from '../../resources/js/types';

const actor = {
    id: 'actor',
    name: 'Matthieu Napoli',
    username: 'mnapoli',
    lane: 2,
} as User;

const notification = {
    id: 'notification',
    type: 'replied',
    actor,
    actors: [actor],
    actors_count: 1,
    unread_count: 1,
    commit_id: 'reply',
    subject_id: 'parent',
    reason: null,
    created_at: '2026-10-16T11:51:00.000000Z',
    commit: {
        id: 'reply',
        body: 'Try this instead\n```php\nreturn round($score, 6);\n```',
        body_segments: [
            { type: 'text', text: 'Try this instead\n' },
            {
                type: 'block',
                language: 'php',
                html: '<span class="hl-keyword">return</span> round($score, 6);',
            },
        ],
    } as Omit<Commit, 'user'>,
} as Notification;

void test('renders a code block highlighted in a notification', async () => {
    const result = await createInertiaApp({
        page: {
            component: 'notification/index',
            props: {
                auth: {
                    user: { id: 'recipient', username: 'nunomaduro' },
                    log: {},
                },
                errors: {},
            },
            url: '/notifications',
            version: null,
            clearHistory: false,
            encryptHistory: false,
            rescuedProps: [],
            rememberedState: {},
            flash: {},
        },
        resolve: () => () => (
            <Index
                notifications={{
                    data: [notification],
                    next_cursor: null,
                    prev_cursor: null,
                }}
            />
        ),
        render: renderToString,
        setup: ({ App, props }) => <App {...props} />,
    });

    assert.ok(result);
    assert.match(
        result.body,
        /<pre[^>]*><span class="hl-keyword">return<\/span>/,
    );
    assert.doesNotMatch(result.body, /```/);
    assert.equal(result.body.match(/<a\b/g)?.length, 1);
    assert.doesNotMatch(result.body, /<button\b/);
    assert.match(result.body, /<pre[^>]*tabindex="-1"/i);
});
