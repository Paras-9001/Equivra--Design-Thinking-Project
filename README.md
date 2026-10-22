# Equivra

**Balance Your Work. Empower Your Mind.**

Equivra is a frontend-only academic Design Thinking prototype for working professionals. It explores four connected ideas: realistic workload planning, pseudonymous peer support, fictional professional discovery, and private voluntary well-being tracking.

## Stack

React 18, JavaScript/JSX, Vite, Tailwind CSS, React Router, Lucide React, Recharts, Motion for React, date-fns, React Context, and browser localStorage. There is no backend, authentication, payment, AI API, or server database.

## Run locally

Use Node.js 18 or newer. From this directory:

```sh
npm install
npm run dev
npm run build
npm run test
```

Open the local URL printed by Vite. The project can be opened directly in VS Code. `npm run preview` serves a built copy.

## Demo access and flow

Choose **Explore demo** on the landing page, then **Working Professional** or **Support Professional**. No credentials are required. The professional demo lets you choose which of the eight fictional providers to manage. Registration offers additional fictional profile fields.

Employee journey: add or edit tasks → configure working time and fixed meetings → generate a smart plan → drag focus sessions or unscheduled work onto the week board → inspect conflicts and deadline risks → select an emoji mood and save a stress check-in → comment in the community → browse fictional practitioners → book a simulated slot → review appointments and updated dashboard. The professional portal has its own overview, editable fictional profile, appointment rescheduling/cancellation modals, and weekly availability. Add a professional window, then return to the employee directory to book a time from it.

## Planner logic

`src/utils/planner.js` ranks open tasks deterministically using deadline urgency, importance, effort, dependent tasks, and manual adjustment. The scheduler computes the next seven days of configured capacity, including only remaining time today, subtracts meetings and daily lunch/break/buffer time, topologically orders dependencies, and allocates focus-sized sessions only in valid work slots up to each deadline. It reports unscheduled effort, conflicting meetings, invalid durations, dependency cycles, and unavailable time. The interactive week board lets you drag sessions to half-hour start times or select a session and choose from valid day/time options for keyboard and touch access. Moves reject protected meetings and breaks, work outside configured hours, moves after deadlines, and dependency violations. Manual placements persist locally. The dashboard reads the same plan and shows an out-of-date warning when tasks or availability change; regenerate to reconcile new inputs. It never silently schedules past a deadline or suggests overtime as the default.

## Persistence and controls

Fictional tasks, posts, bookings, check-ins, work-hour logs, professional availability, and preferences persist in this browser's localStorage. Saved user tasks remain intact when updating the app. A fresh installation or an explicit **Reset demo data** loads the twelve varied sample tasks. Both Settings pages use a confirmation modal before reset. Custom cursor animation works on fine-pointer desktop devices using `requestAnimationFrame`, has a Settings toggle, and falls back to the native cursor on touch devices or when reduced motion is requested. Keyboard focus remains visible.

## Shared booking and well-being rules

`src/utils/booking.js` generates times from each provider’s weekly availability windows. It checks future dates, session duration, and existing bookings; changing a window never deletes confirmed appointments. Cancelled times return only if the window still offers them. Provider profiles, slots, and appointments share stable IDs across both portals.

`src/utils/workload.js` labels and calculates **next seven days**, **calendar week**, **today**, and **all pending work** separately. Remaining effort subtracts user-entered progress hours but never treats a scheduled session as completed work. The well-being filters apply to self-reported check-ins and recorded hours; future task capacity is labeled separately. Emoji moods remain compatible with earlier saved text values. Trend suggestions require enough check-ins and do not claim causation.

`npm run test` runs focused logic regression tests using Node’s built-in test runner. The tests cover sample data migration, matching workload ranges, split task sessions, dependency and conflict checks, manual moves and persistence, bookings and rescheduling, and mood data. Browser interaction and a production build should also be checked after dependencies install.

## Prototype boundaries

All names, profiles, qualifications, posts, appointments, and work records are fictional. The “demo verified” badge has no real verification process. Bookings do not provide sessions or charge money. Community reporting is a local simulation; pseudonyms cannot guarantee anonymity. Wellness instructors provide general wellness activities, distinct from clinical support. Equivra provides no diagnosis or crisis response. The support resources page advises contacting local emergency services when in immediate danger. Private check-ins are not displayed in community posts or professional pages. Avoid entering real sensitive data into a shared browser.

## Find Support walkthrough

1. Open **Find support** from the employee navigation. Select one or more needs, change category tabs, and combine the specialization, language, maximum fee, availability, session mode, and budget filters. Sorting and Reset Filters respond immediately.
2. Open a profile or choose **Book Appointment**. The card's next opening comes from the same weekly windows and existing bookings used by the booking form; choose a listed slot and confirm. Manage it under **My appointments** to reschedule or cancel.
3. On **My well-being**, set the stress slider to 7 or above to see the optional **Explore Support for Work Stress** link. This only selects a directory filter; check-in details are not sent to the professional portal.
4. The urgent-help link opens the existing **Support resources** page. This prototype has no verified helpline directory.

Run `npm test` for appointment and state logic and `npm run build` after installing dependencies. All professionals, bookings, and session modes are fictional demo data.

## Flexible session booking

The professional portal now has **Manage Sessions** for adding, editing, deactivating and removing individual offerings, with any whole-minute duration from 5–480 minutes, a price, mode and optional description. **My Profile** manages public demo contact details, structured education and fictional clinic locations. Professionals can set a 0–120 minute break between appointments.

In Find Support, cards show the cheapest active offering, available duration range, calculated fictional review rating and the next compatible slot. Profile visitors choose a session, mode, and (for in-person care) demo clinic before a date and time. The booking checks the selected duration against availability and occupied intervals. Existing bookings retain their stored session length, fee and location after an offering is edited or removed. Reviews are seeded fictional examples; the prototype does not accept review submissions.

Try creating 30, 60 and 120 minute offerings on the professional side, then book each on the employee side. Book a 120-minute slot and check that another session cannot overlap it; cancel or reschedule in My appointments. `npm test` covers these rules and saved-data migration.
