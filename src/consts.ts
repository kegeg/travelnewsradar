export const SITE_NAME = 'TravelNewsRadar';
export const SITE_URL = 'https://travelnewsradar.com';
export const SITE_DESCRIPTION =
  'Breaking travel news as it enters the radar: what happened, what it means for travelers, and what to do.';
export const CONTACT_EMAIL = 'info@travelnewsradar.com';
/** Site editorial timezone for dates and Breaking badge expiry */
export const SITE_TZ = 'America/New_York';
export const AUTHOR = {
  name: 'Kevin Gagnon',
  url: '/author/kevin/',
  jobTitle: 'Editor',
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

/** Replace `#` when accounts are live. */
export const SOCIAL_LINKS = [
  {
    id: 'x',
    label: 'X (Twitter)',
    href: '#',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: '#',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    href: '#',
  },
] as const;
