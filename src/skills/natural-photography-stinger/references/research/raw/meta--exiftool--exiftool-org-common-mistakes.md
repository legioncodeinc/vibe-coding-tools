# ExifTool Common Mistakes — Phil Harvey

- URL: https://exiftool.org/mistakes.html
- Fetched: 2026-08-17
- Source type: official-docs

Phil Harvey's list of the errors people actually make. Each is a wrong/right pair.

## 1. Missing duplicate tags

```bash
# WRONG — duplicate tags are suppressed by default, hiding information
exiftool -exif:all image.jpg

# RIGHT
exiftool -a -exif:all image.jpg
```

ExifTool shows only one instance of a tag by default. When the same tag exists in more than one
location (a common situation across EXIF/IPTC/XMP, and within multiple IFDs), you silently miss
values. Add `-a`. Combine with `-G1` to see exactly where each lives:

```bash
exiftool -a -G1 -s image.jpg
```

## 2. Over-use of shell wildcards

```bash
# WRONG
exiftool -exif:all *.*

# RIGHT
exiftool -ext jpg -r .
```

Problems with letting the shell expand wildcards: it feeds unsupported file types to ExifTool,
it is case-sensitive on Unix (so `*.jpg` misses `.JPG`), it does not recurse, and shell
expansion is a security and argument-length hazard. Let ExifTool do the file selection with
`-ext` and `-r`.

## 3. Over-scripting

```bash
# WRONG — a shell find/sed loop calling exiftool once per file

# RIGHT
exiftool -d %Y%m%d "-filename<datetimeoriginal" "-filemodifydate<datetimeoriginal#" -ext jpg -r .
```

ExifTool's own batch processing is dramatically faster than a per-file shell loop, because Perl
startup dominates the cost. One invocation over a directory tree beats N invocations.

## 4. Not combining tag operations

```bash
# WRONG — a separate command per tag

# RIGHT
exiftool -artist=phil -modifydate=now -tagsfromfile %d%f.xmp -xmp:title -xmp:description -ext jpg c:\images
```

Same reason: repeated startup overhead. Note this example also shows `-tagsFromFile` with
**filename format codes** (`%d%f.xmp`) to pull each image's own sidecar.

## 5. Tag redirection syntax errors

```bash
# WRONG — the minus sign makes it a deletion, not a copy
exiftool "-EXIF:Artist<-XMP:Creator" image.jpg

# RIGHT
exiftool "-EXIF:Artist<XMP:Creator" image.jpg
```

```bash
# WRONG — no $ prefix needed when the whole value is one tag
exiftool "-comment<$filename" image.jpg
```

```bash
# WRONG — this does NOT copy to all Time tags
exiftool "-time:all<datetimeoriginal" image.jpg

# RIGHT — the $ makes it a string interpolation applied to each destination
exiftool "-time:all<$datetimeoriginal" image.jpg
```

The rule: `-DST<SRC` copies tag to tag. `-DST<$SRC ...` treats the right side as a **string
template** with `$TAG` interpolation, which is what you need when the destination is a wildcard
group or when you are concatenating literal text with tag values.

## Quoting and shell notes

- Redirection arguments contain `<` and `>`, which the shell interprets as file redirection.
  **Always quote them**: `"-EXIF:Artist<XMP:Creator"`.
- Unix shells: single quotes preserve `$` literally, double quotes let the shell interpolate.
  For ExifTool's own `$TAG` interpolation you generally want **single quotes on Unix** and
  **double quotes on Windows** (cmd.exe does not support single quotes).
- Windows cmd.exe uses `%` for its own variables, so filename format codes must be doubled
  (`%%e`) inside batch files.
- The `-@ ARGFILE` mechanism sidesteps all shell quoting entirely — one argument per line, no
  quoting, no escaping. Prefer it for anything containing spaces, quotes, newlines, or non-ASCII.
