# devnull.com — TODO

A social network for developers. Sign in with GitHub, have a Twitter-style profile imported from GitHub, follow people, post short text updates, and read a timeline.

**Keep it stupidly simple:** no comments, reactions, images, notifications, or DMs.

---

## Decisions

- **Auth:** GitHub is the only way to sign in (`laravel/socialite`). No email/password, password reset, email verification, 2FA, or passkeys — Fortify removed.
- **Profile:** Twitter-style, mirrored from GitHub on every login (avatar, name, username, bio, location, website, company). No editing on devnull.
- **Posts:** plain text, max 280 characters; the author can create and delete — no editing. Rate limited to 10 posts per minute per user.
- **Timeline:** my posts + posts from people I follow, newest first, with Inertia infinite scroll. An "Everyone" timeline shows all posts. Each timeline is a `Timeline` enum case served by `TimelineController@show`.
- **Visibility:** everything except the landing page requires login.

---

## Data model

**users** — `id` (uuid), `github_id` (unique), `username` (unique), `name`, `email` (nullable, hidden), `avatar_url`, `bio`, `location`, `website`, `company`, `remember_token`, timestamps

**posts** — `id` (uuid), `user_id` (cascade delete), `body` (280), timestamps; indexes on (`user_id`, `created_at`) and `created_at`

**follows** — (`follower_id`, `followed_id`) primary key, both cascade delete, timestamps; index on `followed_id`

---

## Milestone 1 — Sign in with GitHub ✅

- [x] Install `laravel/socialite`, add `services.github` config + `.env.example` keys
- [x] Update `users` migration, `User` model, and `UserFactory`
- [x] Action `SyncGitHubUser` — find by `github_id`, otherwise create; sync profile fields on each login
- [x] `SessionController@create` → redirect to GitHub; `@store` → handle callback, log in, redirect to intended URL / timeline; `@destroy` → logout
- [x] Failure cases (denied access, invalid state) → landing page with an error toast
- [x] Remove all other starter-kit auth (routes, actions, controllers, requests, pages, components, tests, Fortify, `@laravel/passkeys`, `input-otp`)
- [x] Delete account without password confirmation

## Milestone 2 — Landing page & profile ✅

- [x] Landing page: name, pitch, "Sign in with GitHub". Logged-in users redirect to timeline.
- [x] Profile page `/@{username}`: avatar, name, `@username`, bio, company, location, website, GitHub link, joined date, post/following/follower counts, posts with infinite scroll
- [x] Settings → Profile: read-only (synced from GitHub), "Edit on GitHub", delete account

## Milestone 3 — Posts ✅

- [x] `posts` migration, `Post` model, `PostFactory`, `PostPolicy`
- [x] Actions `CreatePost`, `DeletePost`
- [x] `PostController@store`, `@destroy` + `CreatePostRequest`
- [x] Composer box with character counter at the top of the timeline
- [x] `posts` rate limiter (10 per minute per user)

## Milestone 4 — Follow & timeline ✅

- [x] `follows` migration + `following()` / `followers()` / `isFollowing()` on `User`
- [x] Actions `FollowUser` (idempotent, rejects self-follow), `UnfollowUser`; `UserPolicy@follow`
- [x] `UserFollowController@store`, `@destroy`; Follow/Unfollow button on profiles
- [x] `TimelineController@show` at `/timelines/{timeline}` (`App\Enums\Timeline`: `following`, `everyone`), each backed by a `App\Queries\*TimelineQuery`, cursor-paginated via `Inertia::scroll()` + `<InfiniteScroll>`
- [x] Empty states

---

## Next up

- [ ] Create a GitHub OAuth app and fill `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` (callback: `{APP_URL}/auth/github/callback`)
- [ ] Re-run `php artisan boost:install` so AI guidelines/skills stop referencing Fortify
- [ ] Rewrite `README.md` for devnull
- [ ] Handle GitHub username renames colliding with an existing (stale) username
- [ ] Deleting a post far down the feed reloads the first page — consider optimistic removal

## Not now

Comments, likes/reactions, reposts, images/media, mentions, hashtags, search, notifications, DMs, other OAuth providers, public API, admin/moderation tools, blocking/muting, header/banner images.
