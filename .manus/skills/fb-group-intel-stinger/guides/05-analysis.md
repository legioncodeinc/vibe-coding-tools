# Guide 05: Analyzing the collected dataset

## Inputs

The group JSONL (`groups.jsonl`), the admin JSONL (`admins.jsonl`), and optionally the search-phase CSVs. Load with pandas: `pd.read_json(path, lines=True)`.

## Name-change analysis (the headline question)

The `history` array per group answers "did they rename, and when." A group is flagged as renamed when its history contains any `name_changed` event. Produce:

1. A summary table: total groups, groups with any name change, percentage, per search query.
2. A timeline: count of name-change events by month/year, which reveals coordinated renaming waves (e.g., a cluster of groups renamed around the same date suggests a network).
3. A rename-age column: days between creation and last name change. Groups created long ago and renamed recently are the interesting outliers.
4. Cross-reference: admins whose `admin_of_groups` list contains multiple renamed groups. Repeat offenders are the network nodes.

## Admin network analysis

Build an admin-to-groups adjacency from `admin_of_groups`. Admins controlling 3+ groups, admins shared between the two search verticals (elon vs dachshund), and Page-type admins (commercial operations) each get their own table. Location fields, when present, cluster geographically.

## Deliverables

Write analysis outputs as CSVs plus a short markdown report: `name_changes.csv` (one row per rename event), `admin_network.csv` (one row per admin with group counts and locations), and `report.md` summarizing findings with tables. Rank everything by member count so the highest-reach entities surface first.
