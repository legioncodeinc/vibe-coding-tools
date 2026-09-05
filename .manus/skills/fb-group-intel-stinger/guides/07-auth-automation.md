# Guide 07: Auth Automation (Proton Pass CLI + Mail Bridge)

This guide closes the last accessibility gap: it lets the rig complete logins, 2FA, and passkey flows with **no codes from the operator**. Passwords and TOTP codes come from Proton Pass CLI; email codes and magic links come from Proton Mail Bridge over local IMAP. The operator is never asked to read or type a code.

## What is automatable

| Auth type | Source | Hands-off |
|---|---|---|
| Password | Proton Pass CLI | Yes |
| TOTP (authenticator code) | Proton Pass CLI | Yes |
| Email code / magic link | Proton Mail Bridge (IMAP) | Yes |
| Passkey | Proton Pass assertion + OS input | Mostly |
| SMS | Not on the computer | Only if forwarded to email |

The design rule is simple: **make TOTP the primary 2FA and email the recovery channel on every account, so SMS is never on the critical path.**

## Proton Pass CLI

Install on the Ubuntu rig:

```bash
curl -fsSL https://proton.me/download/pass-cli/install.sh | bash
pass-cli --version
```

Log in once (this is the only interactive step, done at setup):

```bash
pass-cli login
pass-cli vault list
```

Retrieve a password and type it via OS input:

```bash
pass-cli item view "pass://Vault/Facebook-Alice/password"
```

Retrieve the current TOTP code for an account (resolves to the live 6-digit code by default):

```bash
pass-cli item view "pass://Vault/Facebook-Alice/totp"
```

Get the raw `otpauth://` URI instead (for re-import or backup):

```bash
pass-cli item view "pass://Vault/Facebook-Alice/totp?totp=uri"
```

Inject a secret into a command's environment without printing it:

```bash
export FB_PASS='pass://Vault/Facebook-Alice/password'
pass-cli run -- ./collect.sh
```

The secret-reference syntax is `pass://<vault>/<item>/<field>`, with `username`, `password`, `email`, `url`, `note`, and `totp` as the common login fields. Names with spaces work; use the Share ID and Item ID to disambiguate duplicates [1].

## Proton Mail Bridge (email codes)

Bridge serves IMAP and SMTP on localhost so the rig can read email codes without the operator. Install the DEB on Ubuntu:

```bash
wget https://proton.me/download/bridge/protonmail-bridge_*_amd64.deb
sudo apt install ./protonmail-bridge_*_amd64.deb
```

On the headless rig, run the CLI to log in and confirm the account:

```bash
protonmail-bridge --cli
>>> login
>>> info
```

Bridge listens on **IMAP 127.0.0.1:1143** and **SMTP 127.0.0.1:1025** by default (STARTTLS) [2]. Fetch the latest code with a small Python poll:

```python
import imaplib, re, time

def latest_code(user, bridge_pass, timeout=90):
    mail = imaplib.IMAP4("127.0.0.1", 1143)
    mail.starttls()
    mail.login(user, bridge_pass)   # bridge_pass from `protonmail-bridge --cli` info
    mail.select("INBOX")
    deadline = time.time() + timeout
    while time.time() < deadline:
        _, ids = mail.search(None, "UNSEEN")
        for i in ids[0].split()[::-1]:
            _, data = mail.fetch(i, "(RFC822)")
            body = data[0][1].decode("utf-8", "replace")
            m = re.search(r"\b(\d{6})\b", body)
            if m:
                return m.group(1)
        time.sleep(5)
    return None
```

Bridge only binds to localhost, which is what we want: the credentials never leave the machine [2].

## Account-hardening checklist (per identity)

Apply this to every Facebook/TikTok account in the rig so no flow ever depends on the operator:

1. Set 2FA to **authenticator app (TOTP)** and store the TOTP secret in Proton Pass under the account's item.
2. Set the **recovery email** to the Proton address that Bridge reads.
3. **Disable SMS 2FA**, or point the number at a service that forwards SMS to the Proton email so codes still land in IMAP.
4. Store the account password in the same Proton Pass item so `pass://Vault/<account>/password` and `/totp` both resolve.
5. Generate and store **recovery codes** in the item's note field.
6. Record the profile-to-proxy binding in `agents.md` so the account always appears from its fixed locality.

## Security note

This concentrates passwords, TOTP secrets, and email on one machine. That is acceptable for a controlled investigative rig, but it makes the cloud computer's disk encryption, SSH hardening (key-only auth, no password login), and snapshot access control critical. Treat the rig as a high-value target.

## References

[1] Proton Pass CLI documentation, secret references and TOTP. https://protonpass.github.io/pass-cli/commands/contents/secret-references/
[2] Proton Mail Bridge for Linux and default ports. https://proton.me/support/bridge-for-linux and https://proton.me/support/port-already-occupied-error
