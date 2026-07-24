export const SITE_NAME = 'TravelNewsRadar';
export const SITE_URL = 'https://travelnewsradar.com';
/** Public site tagline (About, homepage, schema slogan). */
export const SITE_TAGLINE =
  'Breaking Travel News & What It Means for Travelers';
export const SITE_DESCRIPTION =
  'Breaking travel news & what it means for travelers: what happened, what it means for your trip, and what to check next.';
export const CONTACT_EMAIL = 'info@travelnewsradar.com';
/** Site editorial timezone for dates and Breaking badge expiry */
export const SITE_TZ = 'America/New_York';
/** Default Open Graph / Twitter image (1200×630) when a page has no hero */
export const DEFAULT_OG_IMAGE = '/images/og-default.jpg';
/** Google News / publisher logo (News requires ~600×60) */
export const PUBLISHER_LOGO = `${SITE_URL}/logo-600x60.png`;

/** Primary article categories (extend when a story does not fit). */
export const CATEGORIES = [
  'Flights',
  'Borders',
  'Health',
  'Rewards',
  'Advisories',
  'Labor',
] as const;

export type Category = (typeof CATEGORIES)[number];

export function categorySlug(category: Category): string {
  return category.toLowerCase();
}

export function categoryFromSlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => categorySlug(c) === slug.toLowerCase());
}

export const AUTHOR = {
  name: 'Kevin Gagnon',
  url: '/author/kevin/',
  jobTitle: 'Editor',
  image: '/images/kevin_round.png',
  countriesVisited: 105,
  sameAs: [
    'https://x.com/kevinggagnon/',
    'https://instagram.com/kevin.flytrippers/',
    'https://www.linkedin.com/in/kevin-gagnon-2647a448/',
  ],
  social: [
    {
      id: 'x' as const,
      label: 'X (Twitter)',
      href: 'https://x.com/kevinggagnon/',
    },
    {
      id: 'instagram' as const,
      label: 'Instagram',
      href: 'https://instagram.com/kevin.flytrippers/',
    },
    {
      id: 'linkedin' as const,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/kevin-gagnon-2647a448/',
    },
  ],
};

/** Calendar day (YYYY-MM-DD) of a Date in SITE_TZ — Breaking clears after this day. */
export function calendarDayInSiteTz(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: SITE_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/** Live brand social profiles (footer + Organization sameAs). */
export const SOCIAL_LINKS = [
  {
    id: 'x',
    label: 'X (Twitter)',
    href: 'https://x.com/travelnewsradar',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/travelnewsradar',
  },
] as const;

/** Canonical Organization sameAs URLs for schema (brand profiles only). */
export const ORGANIZATION_SAME_AS: string[] = SOCIAL_LINKS.map((s) => s.href);

export const BEEHIIV_FORM_ID = 'afa8077b-0891-4511-a3f9-527e5748637d';
export const BEEHIIV_LOADER =
  'https://subscribe-forms.beehiiv.com/v3/loader.js';

export function organizationSameAs(): string[] {
  return [...ORGANIZATION_SAME_AS];
}
