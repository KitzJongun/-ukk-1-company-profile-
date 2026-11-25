# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary visitor is a potential client — a business owner or decision-maker looking to hire Nusantara Digital for a website, application, or content-strategy project. They arrive to evaluate credibility, understand services, review past work, and make contact. Secondary audiences (existing clients, partners, recruiters) exist but are not the primary design target.

## Product Purpose

Nusantara Digital is a company profile site for a digital studio that builds websites and applications and advises on content strategy for growing businesses (UMKM through mid-size companies). The site exists to convert visitors into qualified leads by presenting services, portfolio, and company story, and by routing inquiries through a contact form. Success is measured in qualified contact inquiries and a credible, trustworthy first impression.

## Positioning

Transparency and fixed pricing agreed up front: estimates for time and cost are set before work begins, with no hidden costs mid-project. This is the claim a neighboring agency could not truthfully copy unless it operates the same way.

## Operating Context

- Public content (pages, services, portfolios) is managed by an admin through a Laravel REST API; the Next.js frontend renders it with 60-second revalidation. Content is not hardcoded in the frontend.
- Admin panel exists for managing pages, services, portfolios, and contact messages; admin auth via Sanctum bearer token.
- Contact form submissions are stored as contact messages and reviewed in admin.
- Backend defaults to SQLite locally; MySQL supported. Images uploaded via Laravel storage.

## Capabilities and Constraints

- Bilingual reality: all user-facing copy is in Bahasa Indonesia. English appears only in labels like "About us", "Services", "Portfolio" as section eyebrows.
- Frontend is Next.js 16 (App Router) with Tailwind CSS 3; backend is Laravel 11/12 on PHP >= 8.3.
- Public pages: Home, About, Services (+ detail), Portfolio (+ detail), Contact. Admin: login + dashboard (pages, services, portfolios, messages).
- Hardcoded stats on the home page (120+ projects, 45 active clients, 8 years experience) are not verified against real data; treat as unconfirmed.
- No verified testimonials, client logos, or case-study metrics exist on hand.

## Brand Commitments

- Name: Nusantara Digital.
- Voice: professional, direct, transparent, Indonesian-language, no hype.
- Visual world: Annual Report register (corporate annual report). Clean white plates, navy ink (#0f172a), single blue accent (#1e3a8a). Single type family (Source Sans 3). 6px radius. No decoration beyond the grid. Selected by the user from the safer register.

## Evidence on Hand

- Real content: service records, portfolio records, page content (About) managed via admin API.
- No testimonials, client logos, or verified metrics. Home-page stats are hardcoded and unverified.
- No brand assets (logo file, favicon beyond default) beyond the "ND" monogram in the navbar.

## Product Principles

- Transparency over polish: the site should feel honest and specific, not slick or vague.
- Content is owned by the client through the admin; the frontend must not drift from API data.
- Lead generation is the job; every page should make contacting the studio easy and low-friction.
- Indonesian-first copy; clarity beats cleverness.

## Accessibility & Inclusion

No product-specific accessibility requirement established beyond standard web practice.