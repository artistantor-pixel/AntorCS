export const driveImageIds = [
  "10eZ-0_k8i7v1iaOmNCJLMiJTgzuNJ2mg",
  "11VWagkPMtnskQ_q9h3G7vx_aTScpyCxT",
  "11dwtwybJKkUkzpGpZJpIr3ut2zoIrECu",
  "12YSNUD9WDf9uqdMx7n_YiyZBVxFQby7-",
  "12pkD135RbRCIblRnl-yrB-ft6taHfiHX",
  "14JrmWLqQ4pUpYkBuHfUoEorGecO3YCP8",
  "15yTgI2MLuSvhrXVpegmYVhj5cIP0-WK-",
  "17-FWyWwTq-L9DsJijAgJAMSJxk7Ybp07",
  "18Hb4Xw5G4auTtLroAWr-chSynNzez621",
  "19IgQeFkh2Be9-5kJOS3FHXu30tWHmdFW",
  "1BFEMrcyxv1Vx0yYXCeGuQgwprtGILUin",
  "1BKfWbysoFyTTtAh1x88KRxG7nCI0PnLN",
  "1De_U6Rg05Px14lEyV6Lqw5ozV4c9QAku",
  "1EpmZUK2FwMWyvyhsIZ90rLsYLT_HpmcV",
  "1Fn0wDbBR6FFTe4TpDQ6mkKP8ueGlphkp",
  "1Fyjwnd8SmyB7ru0y_wdeUB4AyKpFGgWj",
  "1GAZcUKCgiHvJSyYnXQLIW2bCGdqFcYi4",
  "1GwTT_Ii3ceu-5rU5NRxjwbz5YY922l47",
  "1HMmT2TWYwgfquLqrd1UxyBKyKra0FH2Z",
  "1JAhgkrOY1JEmXplXBbp7ELX3qGJT9Ckl",
  "1JaUb7qPDvBSwUhILeIpEXPQI57aC_E_p",
  "1KhfoMMmKBYsC0Yleq3D_7gnvQecK6XLS",
  "1KsUP3OJNx7Guy9iPYoCUS2q1N-sQkU9m",
  "1ME7kSn66aGLdTylUAMQXC89YmC2DPNWu",
  "1Mu53ZEC9_Vu3r1gIhOszmOClHrs6ljXf",
  "1MynHMZf9MMBzRsOalhdBO_6RxwFHrr--",
  "1OIlJfC6l_24rlCK1Yo_Iqcsih3SAyH6c",
  "1OxHjyi6ScJ3w4qzD6tomEbKqR7XMcSzD",
  "1PSRF_9XfyUdl6hWUW7-07qM5Z0Y1Q1Tx",
  "1QIlzBHtm-xr-jIgj1tOARzI4XW7KAWCx"
];

// Map the IDs into full image URLs for the gallery
export const socialMediaProjectUrls = driveImageIds.map(id => `https://drive.google.com/uc?export=view&id=${id}`);

// Create a mock project object to inject into the portfolio
export const socialMediaProject = {
  id: "drive-social-media-posts",
  title: "Social Media Post Design",
  slug: "social-media-post-design",
  catId: "Social Media Design",
  overview: "A collection of 30+ premium social media post designs created for various brands and campaigns. Each post is crafted to maximize engagement, visual hierarchy, and brand consistency.",
  image: socialMediaProjectUrls[0], // Use the first image as the thumbnail
  client: "Multiple Brands",
  role: "Social Media Designer",
  year: "2024",
  gallery: socialMediaProjectUrls,
  blocks: [], // Empty blocks as we use the gallery feature
  themeBackground: "white"
};
