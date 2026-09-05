# Raw source: Advanced SEO Support in AI Studio

- URL: https://help.gohighlevel.com/support/solutions/articles/155000007691-advanced-seo-support-in-ai-studio
- Fetched: 2026-09-03
- Visible source date: 2026-09-02
- Source type: Official HighLevel Support Portal (primary)
- Archive method: Firecrawl Markdown scrape with main-content extraction
- Research window: 2026-03-03 through 2026-09-03
- Status: In-window primary source

---

All

Articles


### Recent Searches

Clear all

No recent searches

### Popular Articles

* * *

### Articles

[View all](https://help.gohighlevel.com/support/search/solutions)

* * *

### Topics

[View all](https://help.gohighlevel.com/support/search/topics)

* * *

### Tickets

[View all](https://help.gohighlevel.com/support/search/tickets)

![no results](https://help.gohighlevel.com/assets/cdn/portal/images/no-results.png)

Sorry! nothing found for

# Advanced SEO Support in AI Studio

Modified on: Wed, 2 Sep, 2026 at 8:35 AM

Your AI Studio sites just got a whole lot "louder" for the rest of the internet to hear! Improve the SEO readiness of your AI Studio projects with Advanced SEO Support. Advanced SEO Support helps make published AI Studio sites easier for search engines, social platforms, and AI crawlers to read.

```
Important: AI Studio is available through Labs. Turn it on for your sub-account before using it. For more, refer to Labs Features - Complete Overview.
```

* * *

**TABLE OF CONTENTS**

- [What is Advanced SEO Support for AI Studio?](https://help.gohighlevel.com/support/solutions/articles/155000007691-advanced-seo-support-in-ai-studio#What-is-Advanced-SEO-Support-for-AI-Studio?)
- [Key Benefits of Advanced SEO for AI Studio](https://help.gohighlevel.com/support/solutions/articles/155000007691-advanced-seo-support-in-ai-studio#Key-Benefits-of-Advanced-SEO-for-AI-Studio)
- [Pre-render SEO](https://help.gohighlevel.com/support/solutions/articles/155000007691-advanced-seo-support-in-ai-studio#Pre-render-SEO)
- [How to Enable Advanced SEO Support for AI Studio](https://help.gohighlevel.com/support/solutions/articles/155000007691-advanced-seo-support-in-ai-studio#How-to-Enable-Advanced-SEO-Support-for-AI-Studio)
- [Social Media & Link Previews](https://help.gohighlevel.com/support/solutions/articles/155000007691-advanced-seo-support-in-ai-studio#Social-Media-&-Link-Previews)
- [Generate Sitemap](https://help.gohighlevel.com/support/solutions/articles/155000007691-advanced-seo-support-in-ai-studio#Generate-Sitemap)
- [Frequently Asked Questions](https://help.gohighlevel.com/support/solutions/articles/155000007691-advanced-seo-support-in-ai-studio#Frequently-Asked-Questions)
- [Related Articles](https://help.gohighlevel.com/support/solutions/articles/155000007691-advanced-seo-support-in-ai-studio#Related-Articles)

* * *

## **What is Advanced SEO Support for AI Studio?**

Advanced SEO Support in AI Studio helps published AI Studio sites become easier for search engines, social platforms, and AI crawlers to read. This matters because most AI Studio sites are Single-Page Applications (SPAs). While they are fast for humans, they often look like "empty boxes" to bots because they require JavaScript to load. This meant:

- Google took weeks to index your content.

- Social Previews (on Slack/Twitter) looked blank or generic.

- AI Search (ChatGPT/Perplexity) couldn't "read" your site to cite it.

With **Advanced SEO Support**, supported bots can receive rendered HTML instead of an empty SPA shell. This helps improve crawlability, supports better social link previews, and makes published content easier for AI-powered tools to understand.

Advanced SEO Support includes:

- **Pre-render SEO:** Helps supported bots receive rendered page content instead of the default SPA response.

- **Social Media & Link Previews:** Helps shared links display the correct title, description, and preview image.

- **Generate Sitemap:** Helps search engines discover important pages on your published site more efficiently.

Together, these tools improve visibility and discoverability while keeping the normal visitor experience unchanged.

**_![](https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/155069337327/original/JQEfEbjbC4npyO1t5FZF_0S65XppVumRuQ.jpeg?1776378012)_**

![](https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/155069337332/original/3zepGl7NsIRV0ryzy8V7yF8HCinxfHOzdg.png?1776378021)

* * *

## **Key Benefits of Advanced SEO for AI Studio**

- **Rich Social Previews:** When you share a link on LinkedIn, WhatsApp, or X, it now displays the correct title, description, and Open Graph image.

- **AI Search Visibility:** AI-powered search engines (ChatGPT, Claude, Gemini) can now understand and cite your content in their answers.

- **Edge-Level Performance:** Pre-rendered pages are served from the Cloudflare edge in under 10ms. It’s lightning-fast for bots and has zero impact on your actual site visitors.

- **Instant Indexability:** Search engines receive fully rendered HTML. No more waiting for Google’s JS queue; you're indexable on the first crawl.

- **Per-Project Control:** Pre-rendering can be enabled or disabled per project from the settings panel.

* * *

## **Pre-render SEO**

Pre-render SEO helps supported bots receive fully rendered HTML instead of the default single-page application shell.

```
Note: Pre-render SEO is available only for published projects with a connected custom domain.
```

When it is enabled through **Advanced SEO Support**, supported bots can access page content, metadata, images, canonical tags, and structured data that already exist on the page. This is especially helpful for search engines and AI crawlers that may delay JavaScript rendering or skip it entirely.

Instead of seeing an empty app shell, supported bots can receive rendered content on the first request, which improves crawlability, makes content easier to interpret, and helps pages surface more accurately in search results, previews, and AI-powered experiences.

Key operational details include:

- **Automatic bot detection:** Supported search engine crawlers, social media bots, and AI crawlers are served rendered HTML automatically.

- **Graceful fallback:** If pre-rendering is not enabled or a page is not yet cached, bots receive the standard SPA (same behavior as before). No degradation from current experience.

- **Automatic cache refresh:** Pre-rendered pages are automatically regenerated on every publish, domain change, or site update. No manual cache clearing or rebuilding required. The system handles up to 150 routes per site.

- **Edge-level serving:** Pre-rendered pages are served from Cloudflare's edge network in under 10ms. No additional latency for bots or users.

* * *

## **How to Enable Advanced SEO Support for AI Studio**

Enabling Advanced SEO Support helps turn on the SEO tools available for your published AI Studio project. This setup is completed from the SEO settings inside the project and requires a connected custom domain.

From within your AI Studio project, follow these steps:

1. Open the AI Studio project you want to configure

2. Click \*\* **More**\\*\\* at the top of the builder. In the More panel, open \*\* **SEO & AI search**\*\*



![](https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/155079917962/original/Jx2xQbkhl-JPN8Zq9WIkCF5g3d4x-GFjow.png?1788355686)

3. Make sure the project is published, a custom domain is connected, and the custom domain is set as primary.



For more info on publishing AI Studio projects, see: [Publishing Your AI Studio Projects](https://help.gohighlevel.com/support/solutions/articles/155000007587-ai-studio-in-highlevel?utm_source=chatgpt.com#Publishing-Your-Projects)



![](https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/155069332146/original/3vcUYZb42nAW25K7dqMbIshS6ANXokgZJQ.png?1776366016)

4. Click **Enable** to turn on **Advanced SEO Support**.



![](https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/155069332136/original/IJ6ImAL5yipWf8xBvPzzG9axVF6naCvvfQ.png?1776365981)

5. Confirm the toggle turns purple when it is enabled. Now re-publish the project so the latest rendered output is available to supported bots.



![](https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/155069332124/original/bwwtDtzP8lL5-ZkxsOrnH4_OVj16X50HRA.png?1776365958)


* * *

## **Social Media & Link Previews**

With Advanced SEO Support enabled, links shared on Facebook, Twitter, LinkedIn, WhatsApp, Slack, and Discord can display the correct page title, description, and Open Graph image instead of showing blank or generic previews. Each page can also serve its own unique title, description, and preview image to social platforms rather than relying on a single site-wide fallback.

The **Improve social preview content** action uses a **Copy prompt** workflow to apply SEO metadata across the project. When Advanced SEO Support is enabled, supported bots can receive those tags in rendered HTML, helping each page show the correct preview details instead of a generic fallback.

To generate social media and link previews:

1. Open the AI Studio project you want to update.

2. Click \*\* **More**\\*\\* at the top of the builder, then open \*\* **SEO & AI search**\*\*.



![](https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/155079918427/original/nMre5csDOlqLBug2cUOs-4n1Q9dYu_KNzg.png?1788355885)

3. Find **Improve social preview content** and click **Copy prompt**.



![](https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/155079918507/original/aWwzBsRfTILM0fsAxPBuyTTJYDzmiXQ4Zg.png?1788355914)

4. Paste the copied prompt into the AI Studio chat.



![](https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/155069335531/original/PfYQEObBtubtMLq-VIe1x6YK6jzokMkhzQ.png?1776372507)

5. Review the returned update summary in the builder, then publish your project to apply the updates.



![](https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/155069335730/original/DguwRcIw0eFaf9-_piaigDZ5khr8Xg8WQQ.png?1776373017)

6. Use these checks to confirm it is working:


- Share the live URL on a supported platform such as Facebook, Twitter, LinkedIn, WhatsApp, Slack, or Discord. Confirm the preview shows the expected title, description, and Open Graph image.

- Use[Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) or [Twitter Card Validator](https://cards-dev.twitter.com/validator) to confirm Open Graph tags are being served.


* * *

## **Generate Sitemap**

Generate Sitemap helps search engines discover the important pages on your site more efficiently. In AI Studio, the **Generate sitemap** action uses a **Copy prompt** workflow to create sitemap support for the project.

Rendered output refreshes automatically when the site is published, updated, or moved to a different domain, which helps keep the sitemap aligned with the latest site content and structure.

To generate a sitemap:

1. Open the AI Studio project you want to update.

2. Click \*\* **More**\\*\\* at the top of the builder, then open \*\* **SEO & AI search**\*\*.



![](https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/155079918693/original/e5fIvAe1HlX4qA_AWKmvZsyVArwwRHrRcA.jpeg?1788355982)

3. Find **Generate sitemap** and click **Copy prompt**.



![](https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/155069332162/original/ETkb4VGmYgZ5_niWHwrgfTqBh33hY5M7OA.png?1776366055)

4. Paste the copied prompt into the AI Studio chat.



![](https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/155069335739/original/H765GV75hozWe6QqsIDj65ViWVSasPdHcA.png?1776373064)

5. Review the returned update summary in the builder, then publish your project to apply the updates. Click **Details** to view your sitemap.



![](https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/155069335827/original/98shH1SJJWIus2bAC1SvgqF39h0mgkeTEw.png?1776373260)

6. Submit your sitemap to Google Search Console to help Google discover your URLs and monitor sitemap processing.



![](https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/155069335797/original/Wd88q0mIPDw939R8w8tQTAsl9x7Eb7FIVQ.png?1776373179)

* * *

## **Frequently Asked Questions**

**Q: Do I need to publish the project before enabling Advanced SEO Support?**

Yes. Publishing is required before completing the custom domain and SEO setup flow.

**Q: Does pre-rendering change how my site looks or behaves for regular visitors?**

No. Human visitors still receive the same fast, interactive SPA experience. Only bots and crawlers are served the pre-rendered HTML snapshots.

**Q: Does Advanced SEO Support include automated schema markup injection?**

No. Schema markup is not added automatically by Advanced SEO Support itself. If you add schema through an AI Studio prompt and it is generated in the page code, supported bots can receive that schema as part of the rendered HTML when pre-rendering is enabled.

**Q: How does the cache refresh work?**

The cache refreshes automatically when you publish the project, change the connected domain, or update the site and re-publish.

* * *

## **Related Articles**

- [AI Studio in HighLevel](https://help.gohighlevel.com/en/support/solutions/articles/155000007587)

- [Connect Forms and Calendars in AI Studio](https://help.gohighlevel.com/en/support/solutions/articles/155000007599)

- [AI Product Pricing](https://help.gohighlevel.com/en/support/solutions/articles/155000006652)

- [Code Editor in AI Studio](https://help.gohighlevel.com/en/support/solutions/articles/155000007652)

### Was this article helpful?

No
Yes


That’s Great!

Thank you for your feedback

Sorry! We couldn't be helpful

Thank you for your feedback

Your e-mail address

\*

Let us know how can we improve this article!\*

Need more information



Difficult to understand



Inaccurate/irrelevant content



Missing/broken link



Select at least one of the reasons


Please give your comments



reCAPTCHA

Recaptcha requires verification.

I'm not a robot

reCAPTCHA

reCAPTCHA

CAPTCHA verification is required.


Cancel


Send


Feedback sent

We appreciate your effort and will try to fix the article

![Article views count](https://help.gohighlevel.com/support/solutions/articles/155000007691-advanced-seo-support-in-ai-studio/hit)

