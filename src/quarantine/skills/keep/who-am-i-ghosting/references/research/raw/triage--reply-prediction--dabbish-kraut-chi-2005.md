# Understanding email use: predicting action on a message

- **Title:** Understanding Email Use: Predicting Action on a Message
- **Authors:** Laura A. Dabbish, Robert E. Kraut, Susan Fussell, Sara Kiesler
- **Venue:** Proceedings of the SIGCHI Conference on Human Factors in Computing Systems
  (CHI 2005). ACM DL: https://dl.acm.org/doi/10.1145/1054972.1055068
- **URL:** https://sfussell.hci.cornell.edu/pubs/Manuscripts/Dabbish_CHI2005.pdf
- **Fetched:** 2026-08-17
- **Source type:** academic (peer reviewed, survey with per-message coding)
- **Window note:** 2005, well outside the default window. Retained because it is the only
  located study that models message-level reply decisions with the specific predictors
  this skill needs (direct request, recipient count, sender relationship), and because
  nothing found in the recent sweep replaces it with better sourcing.

## Design and sample

Web survey in three parts: work context, general email habits, and detailed coding of
five specific inbox messages per respondent. Respondents rated each message's importance
on a four item scale, described the sender relationship, coded the content type, and
reported the action taken.

121 complete responses out of more than 1,100 university email addresses contacted, an 11
percent completion rate. 38 professors and scientists (31 percent), 40 staff (32 percent),
46 students (37 percent). Ages 20 to 57, mean 30. 76 percent male.

## Headline

"Respondents kept half of their new messages in the inbox and replied to about a third of
them."

## Predictors of replying (Table 5, reported as percentage change in reply probability)

| Predictor | Effect on reply probability |
|---|---|
| Message contains an information request | +22% |
| Message is social in content | +23% |
| Rated importance | +7% |
| Many recipients | -18% |
| Work relationship with the sender | -9% |

## Predictors of keeping the message in the inbox (Table 5)

| Predictor | Effect |
|---|---|
| Reply was postponed | +23% |
| Rated importance | +8% |
| Content type | no significant direct effect |

## Predictors of rated importance (Table 4)

| Predictor | Effect on importance |
|---|---|
| Action request | +20% |
| Scheduling content | +24% |
| Work relationship with the sender | +23% |
| More recipients | -10% |
| Social content | -32% |

## Why this source matters here

This is the empirical spine of the ranking model.

- An explicit information request is the single largest positive driver of a reply. A
  message that asks a specific answerable question is the kind of message that gets
  answered, which is why a re-engagement draft should carry exactly one.
- Recipient count cuts both ways and both cuts point the same direction: more recipients
  lowers rated importance by 10 percent and lowers reply probability by 18 percent. A
  group thread is not an owed response by default, and a re-engagement should be sent one
  to one.
- The postponed-reply effect is the mechanism the skill is chasing. Postponing a reply is
  the strongest predictor of a message sitting in the inbox, which is the observable
  residue of the thing this skill calls ghosting.
