// constants/index.js

// Image assets used across the app
export const images = {
  empty: require("../assets/images/bg.png"),
  video: require("../assets/images/video.png"), // placeholder for video thumbnails
};

// (Optional) mock data – not used right now but safe to keep
export const latestVideos = [{ id: "1", title: "Welcome to the app" }];

// Prompts for the Creator Hub random idea generator
export const ideaPrompts = [
  "Show a before and after of a project you recently finished.",
  "Film a 30-second tip you wish you knew one year ago.",
  "Record a time-lapse of you working from start to finish.",
  "Explain a common mistake beginners make and how to avoid it.",
  "Give a quick tour of your tools or workspace.",
  "Share your top 3 lessons learned from a recent job or project.",
  "Answer one question you get asked all the time.",
  "Show a behind-the-scenes moment that people never see.",
  "Explain one concept using a simple analogy or example.",
  "Share a small win from this week and what you learned.",
  "Show how you organize your day to stay productive.",
  "Talk about one failure and how it helped you improve.",
];
