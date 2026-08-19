// Copy this file to "config.js" (same folder as alchemist_hq.html) and fill
// in your real values. config.js is gitignored — never commit real secrets.

window.APP_CONFIG = {
  // Client-side-only gate for this dashboard. NOT real security — anyone who
  // views page source or the network tab can read this. Fine for a private
  // personal tool behind a private URL; do not rely on it for sensitive data.
  APP_PASSWORD: "0000",

  // Project Settings → API → Project URL
  SUPABASE_URL: "https://rxtnkpymuquholxcfhqd.supabase.co",

  // Project Settings → API → anon public key
  // (safe to expose client-side as long as Row Level Security policies are
  // correctly restricting access — see README-setup.md)
  SUPABASE_ANON_KEY: "sb_publishable_x6DJExOrip8bee566gtnfA_NKnFxh22"
};
