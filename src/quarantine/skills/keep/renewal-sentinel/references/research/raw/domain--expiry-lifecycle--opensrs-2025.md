# OpenSRS: What happens when a domain expires

- **Title:** What happens when a domain expires and what to do about it
- **URL:** https://opensrs.com/blog/what-happens-when-a-domain-expires
- **Fetch date:** 2026-08-17
- **Source type:** vendor-blog (registrar; describes its own and general registrar practice, so it is authoritative on practice and interested in renewals happening)
- **Publication date:** 2025-11-26

## The lifecycle with day counts

| Phase | Duration | WHOIS status | Service state |
|---|---|---|---|
| Expiration day | day 1 | clientHold or serverHold | "Websites stop resolving, email stops routing" |
| Renewal grace | 30 to 45 days | clientHold | Offline; standard renewal fee applies |
| Redemption | approximately 30 days | redemptionPeriod | Offline; additional redemption fee required |
| Pending delete | 5 days | pendingDelete | Locked; unrecoverable |
| Public release | ongoing | new owner | Available for re-registration |

## Service interruption timing

"Most registrars suspend connected services right away" on expiry, though some allow a short
grace before taking them offline. Registrars typically replace the DNS records with their
own, pointing at a renewal reminder or parked page.

## Cost of recovery

Redemption requires a redemption fee on top of the standard renewal fee. The source does not
give amounts.

## After deletion

The name returns to the unregistered pool, and "high-value domains are often claimed
instantly through backorder services". The original owner then has to negotiate a purchase
or register a different name.

## Notes for the sentinel

The email line is the one that changes the severity ranking. A lapsed domain does not merely
take a website offline. It stops mail routing, which means the user stops receiving the
password resets, the client replies, and the renewal notices for everything else they own.
This is why domains get their own class in the output and are never ranked by dollar amount.

The total window from expiry to permanent loss is roughly 65 to 80 days by these numbers,
and the site is dark for essentially all of it.
