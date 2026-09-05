# AI search has a citation problem

- **URL:** https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php
- **Publisher:** Columbia Journalism Review, Tow Center for Digital Journalism
- **Authors:** Klaudia Jazwinska and Aisvarya Chandrasekar
- **Published:** 6 March 2025
- **Fetched:** 2026-08-17
- **Source type:** academic research centre, published in a journalism outlet
- **Note on quotes:** dashes inside quoted passages normalized to spaced hyphens.

## Method

Eight generative search tools tested: ChatGPT Search, Perplexity, Perplexity Pro, DeepSeek
Search, Microsoft Copilot, Grok-2, Grok-3 beta, and Google Gemini.

Twenty news publishers with varying AI-access policies were selected, and ten articles
chosen at random per publisher. A direct excerpt from each article was given to each
chatbot, with a query asking for "headline, original publisher, publication date, and URL."

Total queries: 1,600 (20 publishers by 10 articles by 8 tools).

## Headline finding

The tools collectively delivered incorrect answers to "more than 60 percent of queries."

| Tool | Result |
|---|---|
| Perplexity | 37 percent incorrect, the best performer |
| ChatGPT Search | 134 of 200 articles incorrectly identified |
| DeepSeek | Misattributed sources 115 out of 200 times |
| Grok-3 | 94 percent incorrect |

## Confidence without grounds

ChatGPT "incorrectly identified 134 articles, but signaled a lack of confidence just fifteen
times out of its two hundred responses, and never declined to provide an answer." Most tools
rarely used qualifying phrases such as "it appears" and rarely admitted knowledge gaps.

**This is the finding that matters most for a synthesis tool.** The error rate is a tooling
problem. The absence of hedging is a trust problem, because it removes the reader's only
cue that a claim needs checking.

## Paid tiers were worse in a specific way

Premium versions (Perplexity Pro at 20 dollars per month, Grok-3 at 40 dollars per month)
"answered more prompts correctly than their corresponding free equivalents" but
"demonstrated higher error rates" by giving "definitive, but wrong, answers" where the free
versions declined or hedged.

## Fabricated and broken URLs

"More than half of responses from Gemini and Grok 3 cited fabricated or broken URLs." For
Grok-3, 154 of 200 citations led to error pages.

## Misattribution to syndicated copies

Content was frequently credited to a republisher rather than the original outlet. Perplexity
Pro "cited syndicated versions of Tribune articles for three out of the ten queries" despite
a partnership with the Texas Tribune. ChatGPT cited a Yahoo News syndication of a USA Today
article despite USA Today blocking its crawler.

Licensing partnerships gave "no guarantee of accurate citation": despite the Hearst and
OpenAI partnership, ChatGPT correctly identified only one of ten San Francisco Chronicle
excerpts.

## Crawler exclusion not honoured

Perplexity "correctly identified nearly a third of the ninety excerpts from articles it
should not have had access to" and returned all ten paywalled National Geographic excerpts
despite the crawler block.

## Related finding quoted by the authors

From a BBC report on AI assistants: "when AI assistants cite trusted brands like the BBC as
a source, audiences are more likely to trust the answer - even if it's incorrect."

## Scope caveat

This study measures citation of **news articles** by consumer AI search products. It does
not measure citation accuracy in an agent that fetches a page and quotes it. The transferable
findings are the two structural ones: a URL that has not been opened may not exist, and a
confident tone is not evidence of a checked source.
