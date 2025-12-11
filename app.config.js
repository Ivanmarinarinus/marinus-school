// app.config.js
export default {
  expo: {
    name: "marinus",
    slug: "marinus",
    extra: {
      // read from process.env at config time
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    },
    plugins: ["expo-router", "expo-video"],


  },
};

