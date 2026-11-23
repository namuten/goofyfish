export const SITE = {
  name: 'Scherzo',
  url: process.env.SITE_URL ?? 'https://namuten.github.io/goofyfish',
  tagline: 'Small, silly games for the browser',
  description:
    'Small, silly games that run in your browser. Free, no ads, no sign-ups, no downloads. Best with sound on.',
  twitter: '@nilbuild',
  github: 'https://github.com/namuten/goofyfish',
  author: { name: 'Kamran Ahmed', url: 'https://kamran.fyi' },
  // Main hub site; goofyfish is served as its game section.
  hub: { name: 'nyearha', url: 'https://namuten.github.io/nyearha/' },
};

// SITE.url may include a sub-path (GitHub Pages serves this repo at /goofyfish), so append rather than resolve.
export function absoluteUrl(path: string) {
  return SITE.url.replace(/\/$/, '') + (path.startsWith('/') ? path : '/' + path);
}
