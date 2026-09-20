export const siteUrl = "https://momentumpace.com";
export const siteName = "Momentum";
export const siteTagline = "Paid Ads for Niche Fitness Clubs";
export const siteDescription =
  "Momentum is a paid advertising agency for boutique gyms, Pilates and yoga studios, and boxing and martial arts clubs. AI-assisted, human-led Meta and Google campaigns. Book a strategy call.";

export const faqs = [
  { q: "Is Momentum a good fit for my club?", a: "We focus on independent gyms, boutique studios, and specialist fitness clubs. The strategy call helps us understand your offer, capacity, and goals, then decide together whether paid ads make sense for your business." },
  { q: "What budget do I need, and what does it cost?", a: "Your ad budget depends on your location, offer, and growth goals. On the call, we’ll discuss a realistic starting budget and the scope of our work. Ad spend is paid directly to Meta or Google; our management fee is separate. You’ll receive a clear proposal before committing." },
  { q: "How soon can I expect results?", a: "Early campaigns help us learn which messages and offers generate interest. Reliable decisions take testing, conversion tracking, and feedback from your team. Timing varies by market and budget, so we don’t promise a fixed number of leads or a guaranteed return." },
  { q: "Do you have case studies or use AI to run the ads?", a: "Momentum is a new agency, so we don’t have client case studies to share yet. We’ll walk you through our approach, campaign structure, and reporting before you decide. AI supports research and creative ideas; a person reviews the strategy, ads, and budget decisions." },
  { q: "What happens after I request a strategy call?", a: "We’ll review your details and follow up by email to arrange a time. The call covers your club, your current marketing, and possible next steps. There’s no obligation to sign up. If we move forward, you’ll review the scope, fees, and terms first, and keep ownership of your ad accounts." },
];

const services = [
  "Meta advertising for fitness clubs",
  "Google Ads for gyms and studios",
  "Paid media strategy and audits",
  "Lead tracking and conversion reporting",
];

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      description: siteDescription,
      logo: { "@type": "ImageObject", url: `${siteUrl}/favicon.svg` },
      image: `${siteUrl}/og-image.png`,
      areaServed: "Worldwide",
      knowsAbout: services,
      slogan: "We run the ads. You run the club.",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Paid advertising services",
        itemListElement: services.map(service => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: service },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: `${siteName} | ${siteTagline}`,
      description: siteDescription,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: faqs.map(faq => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ],
};
