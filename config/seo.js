const siteUrl = "https://app.terp.network";
const siteAddress = new URL(siteUrl);
const canonical = siteAddress.href.slice(0, -1);
const title = "Community Widget Dashboard";
const description = "Community Widget Dashboard";
const fbAppId = null;
module.exports = {
  title,
  canonical,
  description,
  openGraph: {
    type: "website",
    url: siteUrl,
    title,
    description,
    site_name: title,
    images: [
      {
        url: canonical + "/og_image.png",
        // width: 942,
        // height: 466,
        alt: title,
      },
    ],
  },
  twitter: {
    handle: "@terp-core",
    site: "@terp-core",
  },
  facebook: fbAppId
    ? {
        appId: fbAppId,
      }
    : undefined,
};
