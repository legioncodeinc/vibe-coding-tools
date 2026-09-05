# Subnet routers and exit nodes

- URL: https://tailscale.com/kb/1019/subnets ; https://tailscale.com/kb/1103/exit-nodes ; https://tailscale.com/docs/install/cloud/aws ; https://tailscale.com/docs/how-to/connect-vpc
- Fetched: 2026-08-14
- Source type: Official docs
- Component: Subnet routers / Exit nodes

## Content

### Subnet routers - what they're for

A subnet router is a tailnet device that advertises routes to a **conventional (non-Tailscale) subnet**, acting as a gateway so the rest of the tailnet can reach devices that can't or don't run the Tailscale client - e.g. an entire AWS VPC, a legacy office network, a managed database's private subnet.

- Devices reachable **behind** a subnet router do **not** count against the tailnet's device-count pricing limit.
- Direct Tailscale-client install on each device is still preferable for security/performance/simplicity where possible; subnet routers are the bridge for what can't run the client.
- Explicit named use case in the official docs: **"securely connect to cloud-managed services like Amazon RDS or Google Cloud SQL without exposing them to the public internet"** - directly analogous to reaching a Neon Postgres instance's private networking surface, though Neon's own native private-networking path (AWS PrivateLink, see the Neon raw file) is the more direct-to-Neon option when applicable.
- **SNAT by default**: traffic from a device behind the subnet router appears (to the tailnet) to originate from the router itself. Disable SNAT if preserving the original source IP matters.
- Subnet routers vs. exit nodes: subnet routers hand off **specific private subnets**; exit nodes hand off **all internet-bound traffic** as a default route. They solve different problems and often coexist.

### Subnet router setup (Linux)

1. Install Tailscale on the gateway device.
2. Enable IP forwarding:
   ```shell
   echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
   echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
   sudo sysctl -p /etc/sysctl.d/99-tailscale.conf
   ```
   (`firewalld` hosts may additionally need `firewall-cmd --permanent --add-masquerade`.)
3. Advertise routes:
   ```shell
   sudo tailscale set --advertise-routes=10.0.0.0/24,10.0.1.0/24
   ```
4. **Authorize the advertised routes** from the admin console (Machines page) - unless the device is authenticated by a user listed in `autoApprovers` in the tailnet policy file, in which case routes are auto-approved.
5. Add access rules/grants so intended users/tags can reach the subnet:
   ```json
   "grants": [
     { "src": ["john.doe@example.com"], "dst": ["10.0.0.0/24", "10.0.1.0/24"], "ip": ["*"] }
   ]
   ```
6. On the connecting side (Linux), accept routes: `sudo tailscale set --accept-routes`.

### AWS VPC walkthrough specifics

The official AWS subnet-router guide provisions: an EC2 instance in a **public** subnet running as the subnet router (with a security group temporarily allowing inbound SSH for setup, then locked down), and a target EC2 instance in a **private** subnet with no public IP, reachable only via the subnet router once Tailscale is wired up. Recommended production hardening step: **disable key expiry** on the subnet router itself so it doesn't silently drop off the tailnet from a missed re-auth window (`Machines` page > `Disable Key Expiry`). Multiple subnet routers can advertise the same routes across availability zones for high-availability failover.

### Exit nodes - what they're for

An exit node routes a device's **entire internet-bound traffic** (`0.0.0.0/0`, `::/0`) through another tailnet device, similar to a traditional VPN's default-route behavior. Tailscale is normally an **overlay-only** network (it doesn't touch non-tailnet-destined traffic) until a device opts into using an exit node.

- Every device must **explicitly opt in** to use an exit node; the exit-node device must **advertise** itself; an Owner/Admin/Network admin must **allow** it for the tailnet.
- Local network access from the client device is disabled by default when using an exit node; toggle "Allow Local Network Access" (or `--exit-node-allow-lan-access`) to keep it.
- **Access control nuance that trips people up**: granting a group access to `tag:prod` does *not* implicitly grant exit-node usage. Exit-node permission requires a grant/ACL whose `dst` is specifically `autogroup:internet` - a grant naming the exit-node device itself as `dst` only permits connecting *to* that device (e.g. SSH), not routing internet traffic *through* it.

```json
{
  "grants": [
    { "src": ["group:developers"], "dst": ["autogroup:internet"], "ip": ["*"] }
  ]
}
```

### Exit node setup (Linux)

```shell
sudo tailscale set --advertise-exit-node
```
Requires IP forwarding enabled (same sysctl steps as subnet routers). Then an Admin approves it from the Machines page, and each client opts in with:
```shell
sudo tailscale set --exit-node=<exit-node-ip>
```

Framing for a small SvelteKit/Vercel team: exit nodes solve "route my laptop's whole internet connection through a trusted network" (untrusted coffee-shop wifi, geo-restricted access) - a materially different problem from "reach my private Neon database," which is a subnet-router or Neon-native-private-networking problem, not an exit-node one. Do not reach for an exit node to solve a database-reachability problem.
