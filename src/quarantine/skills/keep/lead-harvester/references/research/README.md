# Research archive for lead-harvester

Stage 2 and stage 3 of the Queen Bee forge pipeline for this skill.

## What is here

```
research/
├── README.md                                     this file
├── distilled-keyword-comment-lead-generation.md  stage 3, every claim cited
└── raw/                                          stage 2, one file per source
```

15 sources archived on 2026-08-17. Every file in `raw/` carries a title, URL, fetch date,
and source type in its header, plus a "Claims this source supports" block that the
distillation cites.

## Source mix

| Type | Count | Files |
|---|---|---|
| official-docs | 6 | Meta Messenger policy, Meta Private Replies, Meta Community Standards Spam, X Automation Rules, FTC CAN-SPAM guide, ManyChat product help |
| vendor-blog | 7 | PhantomBuster, AnyBiz, SumGenius, Highspot, Artemis GTM, LeadResponse, Expandi |
| community | 1 | ManyChat user forum thread |
| academic / legal | 1 | Digital Media Law Project on Facebook v. MaxBounty |

## Research window

Default window was the last 6 months, meaning roughly 2026-02 to 2026-08. Two archived
sources fall outside it, on purpose, and both say so in their own headers:

- `leadharvest--legal--dmlp-facebook-v-maxbounty.md` describes a 2011 district court
  decision. It is kept because no newer authority on the question was found and because
  the question matters.
- The Harvard Business Review speed-to-lead study referenced inside
  `leadharvest--speed-to-lead--leadresponse-statistics-2026.md` is from 2011. It is
  recorded as a secondhand citation only, because HBR is paywalled.

## Known gaps, stated rather than padded

1. **LinkedIn official limits.** LinkedIn's User Agreement and Help Center block
   automated fetching via robots.txt. No numeric limit in this archive comes from a
   LinkedIn-published document. LinkedIn's own text confirms it does not publish those
   numbers.
2. **Social-lead conversion data.** No source found isolates conversion rates for inbound
   SOCIAL hand-raisers. All speed-to-lead numbers describe form-fill leads worked by
   phone. The skill applies the direction, not the magnitude.
3. **Comment automation rate limits.** No vendor or platform publishes a comment-trigger
   rate limit. The ManyChat community thread shows an operator asking and not getting an
   official answer.
4. **Facebook personal profile posts.** Meta's Private Replies documentation covers
   Instagram professional accounts and Facebook Pages. Keyword campaigns run from a
   personal Facebook profile, which is common among the operators this skill targets, are
   not covered by any documented API path in this archive.
