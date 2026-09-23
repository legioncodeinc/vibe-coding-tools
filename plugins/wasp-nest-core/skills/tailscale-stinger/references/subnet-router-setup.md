# Exit-node and subnet-router setup: command sequence

Grounded in [raw/tailscale--subnet-routers-exit-nodes--private-network-access.md]. Run on the Linux device that will act as the gateway.

## Subnet router (reach a private CIDR, e.g. a VPC or office LAN)

```bash
# 1. Install Tailscale on the gateway device (see tailscale.com/download for the
#    current install command for your distro - not reproduced here since install
#    commands change independently of the networking facts this skill grounds).

# 2. Enable IP forwarding.
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
sudo sysctl -p /etc/sysctl.d/99-tailscale.conf

# firewalld hosts only - work around a known masquerade issue.
# sudo firewall-cmd --permanent --add-masquerade

# 3. Advertise the subnet(s).
sudo tailscale set --advertise-routes=10.0.0.0/24,10.0.1.0/24

# 4. Authorize the route from the admin console (Machines page), unless the
#    advertising user is listed in `autoApprovers` in the tailnet policy file.

# 5. On the connecting Linux client, accept advertised routes.
sudo tailscale set --accept-routes
```

Add the corresponding grant to the tailnet policy file:

```json
"grants": [
  { "src": ["group:engineering"], "dst": ["10.0.0.0/24", "10.0.1.0/24"], "ip": ["*"] }
]
```

Production hardening: **disable key expiry** on the subnet router itself (Machines page > Disable Key Expiry) so a missed re-auth window doesn't silently take the whole subnet offline - this is the documented use case for disabling expiry, not a blanket default [raw/tailscale--key-expiry-and-security-model--zero-trust.md].

## Exit node (route a device's whole internet connection through another device)

```bash
# Same IP-forwarding steps as above, then:
sudo tailscale set --advertise-exit-node

# Admin approves the exit node from the Machines page (or via autoApprovers),
# then each client opts in:
sudo tailscale set --exit-node=<exit-node-tailscale-ip>
```

The access grant for exit-node *usage* must target `autogroup:internet`, not the device:

```json
"grants": [
  { "src": ["group:engineering"], "dst": ["autogroup:internet"], "ip": ["*"] }
]
```

Do not use this pattern to reach a private database - that's the subnet-router pattern above, or `db-bastion-pattern.md` [raw/tailscale--subnet-routers-exit-nodes--private-network-access.md].
