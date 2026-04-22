# CLAUDE.md — RinON Platform (rinon.al)

## What is this project

RinON is a digital youth empowerment platform for Albanian youth (ages 18-25). The website is a React single-page application that serves articles, events, and community resources. It is built and maintained by a small volunteer team. The founder is a high school student who relies on AI for implementation — code quality and clear structure matter more than cleverness.

The site is entirely in Albanian (primary) with English translations available. All user-facing text goes through a `t(albanian, english)` helper function defined inline.

## Tech stack

- **Frontend:** React (Create React App), single `App.js` file (10,923 lines — being refactored)
- **Icons:** lucide-react (used throughout the entire app for all icons)
- **Backend:** Supabase (project ID: `hslwkxwarflnvjfytsul`, region: eu-north-1)
- **Auth:** Supabase Auth with email/password and Google OAuth
- **Native app:** Capacitor (`@capacitor/android`, `@capacitor/app`, `@capacitor/cli`, `@capacitor/core`)
- **Deployment:** Vercel
- **Domain:** rinon.al (www.rinon.al)

## Architecture — how the code works

### The monolith: App.js

Everything lives in one file. This is the single biggest technical debt. The file contains:

**Top-level utility components (defined before the main RinON component):**
- `NotificationModal` (line ~159) — push notification permission prompt (BEING REMOVED)
- `IOSInstructionsBanner` (line ~321) — iOS PWA install instructions
- `EventCalendar` (line ~355) — calendar widget used on Events page, wrapped in React.memo
- `DiscussionPageContent` (line ~902) — the Komuniteti discussion view (BEING REMOVED)
- `ShareModal` (line ~1077) — share article/event to social media with hashtags
- `TermsModal` (line ~1315) — terms of service and privacy policy acceptance
- `AuthModal` (line ~1517) — login/signup modal with email, password, Google sign-in
- `PreferencesModal` (line ~1693) — user preferences, profile editing, account deletion

**The main component: `const RinON = () => {`** starts at line ~1888. Everything else is inside it.

### Routing / Navigation

There is no React Router. Navigation is handled by a `currentPage` state variable. The `changePage(page)` function (line ~2167) does a 350ms fade transition, sets `currentPage`, and scrolls to top.

Pages are rendered in a big conditional chain starting around line ~8337:
```
currentPage === 'home' → Homepage
currentPage === 'lajme' → N'gazeta (articles page)
currentPage === 'komuniteti' → Community (BEING REMOVED)
currentPage === 'events' → Events calendar
currentPage === 'shiko' → Video page (BEING HIDDEN)
currentPage === 'partners' → Partnerships
currentPage === 'about' → About us
currentPage === 'schools' → Schools overview (BEING REMOVED)
currentPage === 'school-portal' → Individual school view (BEING REMOVED)
currentPage === 'discussion' → Single discussion thread (BEING REMOVED)
```

**Bottom navigation bar** (mobile, line ~10698): Home, Evente, N'gazeta, Komuniteti + Profil/Hyr button
**Desktop top navigation** (line ~6222): Home, N'gazeta, Evente, Shiko, Komuniteti
**Desktop hamburger menu** (line ~6341): Home, N'gazeta, Evente, Shiko, Schools, Partners, Komuniteti, About
**Footer navigation** (line ~10830): Lajme, Evente, Bashkëpunime, Rreth Nesh (⚠️ footer says "Lajme" — should be "N'gazeta")

### Data flow

All data is fetched from Supabase in a large `useEffect` at line ~2573 that runs on mount. It:
1. Listens for auth state changes (`onAuthStateChange`)
2. On auth, fetches user profile from `user_profiles`
3. Fetches articles, events, partners, team_members, topics, polls, schools, videos, quotes
4. Maps database column names (snake_case) to JS object keys (camelCase) inline — there is no ORM or model layer

Articles come from the DB as `{ title_al, content_al, category, image, ... }` and get mapped to `{ titleAl, contentAl, category, image, ... }`.

### Admin system

Admin status is determined by `userProfile?.is_admin` or `isSuperAdmin()` (checks specific user IDs). When `showAdmin` state is true AND user is admin, edit/delete buttons appear throughout the UI. Regular visitors never see admin controls.

Admin can:
- Create/edit/delete articles, events, partners, team members
- Create/delete topics, polls
- Send push notifications
- Manage schools (being removed)

### State management

All state lives as `useState` hooks in the main RinON component — about ~95 useState calls. There is no Redux, Context, or state management library. This makes the component very large but keeps things simple.

Key state groups:
- **Page/UI:** currentPage, darkMode, language, mobileMenuOpen, fabOpen, showAdmin, pageTransition, hasPageLoaded, loading, showTopBanner, showScrollTop, heroCarouselIndex, showHomeSignupPopup, navigationHistory, lastBackPress
- **Auth:** user, userProfile, showAuthModal, authMode, showPreferences, showTermsModal, pendingUser
- **Content data:** articles, otherEvents, partners, staffMembers, topics, polls, videos, schools, quotes, currentQuoteIndex, activePoll, userPollVote, pollResults
- **Forms:** formData (articles), eventFormData, topicFormData, partnerFormData, memberFormData, quoteFormData, pollFormData, schoolFormData, schoolPostFormData, councilFormData, studentOfMonthFormData, videoFormData
- **Article view:** selectedArticle, showArticleModal, selectedCategoryFilter, contentTypeFilter, searchQuery, showSearchBar
- **Events:** selectedEvent, showEventModal, calendarDate, eventInterests, userEventInterests, savedEvents
- **Notifications:** notificationsEnabled, notificationPreferences, showNotificationModal (BEING REMOVED)
- **Admin:** showAddForm, showAddEventForm, showAddTopicForm, showAddPartnerForm, showAddMemberForm, showAddQuoteForm, showAddPollForm, showAddSchoolForm, showAddVideoForm, editingItem, editMode
- **User activity:** showUserActivity, userActivityTab, savedArticles, userBadges
- **Share:** showShareModal, shareItem, showNativeShare, nativeShareItem
- **Drafts:** drafts, showDraftsModal, editingDraftId
- **Schools (being removed):** schools, selectedSchool, schoolPosts, schoolCouncil, studentOfMonth, + form toggles
- **Videos (dormant):** videos, selectedVideo, showVideoModal, videoCategory, savedVideos, showAddVideoForm

**Unused state variables to clean up:**
- `activeCategory` — setter unused, replaced by selectedCategoryFilter
- `rememberMe` — always true, setter unused
- `setShowFirstTimeTooltip` — value unused, only setter used
- `setPushSubscription` — value unused, only setter used

### Supabase tables (active)

| Table | What it stores |
|-------|---------------|
| articles | News articles and opinion pieces. Has `post_type` field ('lajme' or 'artikuj'). `is_head_article` marks the featured/hero article. |
| events | Calendar events with date, time, location, registration link, spots tracking |
| partners | Organization partnerships with bilingual name/description/vision/goals |
| team_members | Staff/volunteer names and roles for About page |
| user_profiles | User profiles (preferences, school_id, terms_accepted, bio, events_attended, polls_voted) |
| user_badges | Gamification badges earned by users |
| event_interests | "Interested" clicks on events |
| quotes | Homepage testimonial quotes |
| page_views | Analytics — page visit tracking (created in Supabase, not yet integrated in frontend) |
| article_reads | Analytics — article read tracking with duration (created in Supabase, not yet integrated in frontend) |
| daily_stats | Analytics — aggregated daily metrics (created in Supabase, not yet integrated in frontend) |

### Tables in Supabase but NOT referenced in frontend code
| Table | Notes |
|-------|-------|
| profiles | Exists in Supabase but NOT referenced in frontend code — only `user_profiles` is used. Needs consolidation. |
| article_likes | Exist in DB but have no frontend integration |
| article_saves | Exist in DB but have no frontend integration — article saves use localStorage instead |
| saved_events | Exist in DB but have no frontend integration — event saves use localStorage instead |
| event_registrations | Exist in DB but have no frontend integration |
| notification_preferences | Per-user notification settings (BEING REMOVED with push notifications) |
| push_subscriptions | Firebase Cloud Messaging tokens (BEING REMOVED with push notifications) |

### Tables being removed (do NOT query these)
topics, posts, comments, polls, poll_votes, schools, school_posts, school_council, student_of_month

### Tables kept dormant (Shiko page — hidden but code preserved)
videos, video_saves

## What is being worked on RIGHT NOW

### Phase 0 — Remove push notifications / Firebase (DONE)
- Remove all Firebase imports, config, and messaging code
- Remove NotificationModal component
- Remove all notification-related state variables
- Remove push_subscriptions and notification_preferences table queries
- Remove notification bell icon from header
- Remove firebase and @capacitor/push-notifications from package.json

### Phase 1 — Remove dead features
- Remove Komuniteti (polls + discussions) from navigation and rendering
- Remove Schools / School Portal from navigation and rendering
- Hide Shiko from navigation (keep code dormant)
- Remove homepage "Zbulo" section (redundant navigation cards)
- Remove homepage testimonials/quotes section
- Remove homepage poll widget
- Fix footer: change "Lajme" to "N'gazeta"
- Consolidate navigation (bottom nav, desktop nav, hamburger, footer should all be consistent)

### Phase 2 — Redesign homepage
- Clear value proposition in hero section
- Latest articles as the primary content (articles are the product that keeps users)
- Compact upcoming events section
- Partner logos
- CTA footer
- Remove everything redundant

### Phase 3 — Article experience
- Redesign article cards in N'gazeta
- Build admin analytics dashboard (page_views, article_reads data)
- Integrate analytics tracking code into changePage() and article open/close

### Phase 4 — Letra nga Rinasi
- New page: "Letra nga Rinasi" — an archive of emigration testimonies from young Albanians
- Each letter is identified by initials, destination country, and profession
- 1-2 paragraph testimonies about why they left Albania
- Powerful emotional content that differentiates RinON

### Phase 5 — Code cleanup
- Split App.js into component files (EventCalendar, AuthModal, PreferencesModal, ShareModal, etc.)
- Delete dead code (Komuniteti, Schools, unused state variables)
- Consolidate profiles + user_profiles into one table
- Clean unused Supabase tables
- Audit and remove unused dependencies

## Coding conventions

- All components use inline Tailwind CSS classes
- Dark mode is supported via a `darkMode` state variable — every element has conditional classes like `${darkMode ? 'bg-gray-900' : 'bg-white'}`
- Color scheme: amber/yellow primary (#F59E0B), teal/green secondary (#0D9488 / #14B8A6), cream backgrounds, dark mode uses gray-900/800
- The `t(al, en)` function returns Albanian or English text based on `language` state
- Image uploads go to Supabase Storage bucket 'images' via the `uploadImage()` utility function
- DOMPurify is used to sanitize HTML content before rendering
- No TypeScript — everything is plain JavaScript
- No testing framework currently in use

## Important constraints

- The founder is a beginner coder who relies on AI. Code must be clear, well-commented, and avoid unnecessary abstraction.
- This is a volunteer project with zero budget. No paid services beyond Supabase free tier and Vercel free tier.
- The primary audience is Albanian youth. Albanian language quality matters — don't machine-translate, use natural Albanian.
- Mobile-first design. Most visitors come from phones.
- The site functions as a PWA (Progressive Web App).

## File structure (current)

```
rinon-al/
├── public/
│   ├── index.html
│   ├── manifest.json               # PWA manifest
│   ├── privacy-policy.html         # Static privacy policy page
│   ├── terms-of-service.html       # Static terms of service page
│   └── (static assets: favicon, logos, robots.txt)
├── src/
│   ├── App.js                      # THE monolith (10,923 lines)
│   ├── App.css                     # Minimal CSS (most styling is Tailwind inline)
│   └── index.js                    # React entry point
├── android/                        # Capacitor Android project (native app build)
├── .env                            # Environment variables (not committed)
├── capacitor.config.ts             # Capacitor configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── vercel.json                     # Vercel deployment configuration
├── CLAUDE.md                       # This file
├── package.json
└── (config files)
```

## How to run locally

```bash
npm install
npm start
# Opens on http://localhost:3000
```

## Deployment

Push to the main branch on GitHub. Vercel auto-deploys from the repo.
