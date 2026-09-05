# ExifTool Application Documentation (exiftool_pod) — Phil Harvey

- URL: https://exiftool.org/exiftool_pod.html
- Fetched: 2026-08-17
- Source type: official-docs

Canonical command-line reference for `exiftool` by Phil Harvey. This is the man page rendered
to HTML.

## SYNOPSIS

```
exiftool [OPTIONS] [-TAG...] [--TAG...] FILE...
exiftool [OPTIONS] -TAG[+-<]=[VALUE]... FILE...
exiftool [OPTIONS] -tagsFromFile SRCFILE [-[DSTTAG<]SRCTAG...] FILE...
exiftool [ -ver | -list[w|f|r|wf|g[NUM]|d|x|geo] ]
```

"ExifTool is a command-line interface to Image::ExifTool, used for reading and writing meta
information in a variety of file types." FILE arguments may be filenames, directories, or `-`
for standard input.

## Reading and writing tags

- `-TAG` — extract the named tag (e.g. `-CreateDate`). Multiple `-TAG` args restrict output
  to just those tags.
- `--TAG` — exclude the named tag from extraction.
- `-TAG=VALUE` — write a new value. **An empty VALUE deletes the tag.**
- `-TAG+=VALUE` / `-TAG-=VALUE` — add/remove entries for list-type tags (e.g. keywords), or
  do arithmetic on date/numeric tags (`-alldates+=1`).
- `-TAG#` — suffix a tag name with `#` to disable print conversion for that tag (get the raw
  numeric value instead of the human-readable string).
- Wildcards are permitted in tag names: `?` matches one character, `*` matches many.

## Group syntax

Tags may be prefixed with one or more group names separated by colons:

```
-EXIF:CreateDate
-XMP:Creator
-IPTC:Keywords
-MakerNotes:all
-XMP-plus:DigitalSourceType
-EXIF:GPS:all          # multiple leading groups
```

Group families (selected with `-G[NUM]` or `-g[NUM]`):

- **Family 0** — general location / information type: `EXIF`, `XMP`, `IPTC`, `MakerNotes`,
  `Composite`, `File`, `ICC_Profile`, `JFIF`, `Photoshop`, `PNG`, `QuickTime`
- **Family 1** — specific location: `IFD0`, `ExifIFD`, `GPS`, `InteropIFD`, `XMP-dc`,
  `XMP-exif`, `XMP-plus`, `XMP-photoshop`, `Canon`, `Nikon`, `Sony`
- **Family 2** — category: `Camera`, `Image`, `Time`, `Author`, `Location`, `Other`, `Document`
- Higher families (3–8) cover document number, instance, metadata format, and structure path.

`-G0:1` prints both family 0 and 1 group names.

## Deleting metadata

- `-all=` — delete all writable metadata.
- `-all= --GROUP:all` — delete everything **except** the named group. Common idiom:
  ```bash
  exiftool -all= -tagsfromfile @ -icc_profile image.jpg   # strip all but keep colour profile
  ```
- `-GROUP:all=` — delete all tags in one group, e.g. `-GPS:all=`, `-MakerNotes:all=`,
  `-XMP:all=`, `-IPTC:all=`.
- Note the ordering rule: `-all=` should come first, and any `--GROUP:all` exclusion or
  `-tagsFromFile` re-copy comes after, because ExifTool applies assignments left to right.

## -tagsFromFile

```
exiftool -tagsFromFile SRCFILE [-[DSTTAG<]SRCTAG...] FILE...
```

- Copies tag values from SRCFILE into FILE.
- "SRCFILE may be the same as FILE to move information around within a single file."
- `@` is a special SRCFILE meaning "the destination file itself" — essential for the
  strip-then-restore idiom, and it works per-file in batch/recursive runs.
- Redirection forms are equivalent: `-DSTTAG<SRCTAG` and `-SRCTAG>DSTTAG`.
- With no tag arguments, **all** writable tags are copied.
- Group syntax works on both sides: `-XMP:Creator<EXIF:Artist`, `-EXIF:all`, `-all:all`.
- `-tagsFromFile` may appear multiple times in one command; each applies to the arguments
  that follow it.
- SRCFILE may contain filename format codes (`%d`, `%f`, `%e`) to derive the source name from
  the destination name — useful for copying from RAW to exported JPEG.

## File-handling options

- `-overwrite_original` — overwrite the source file instead of leaving a `FILE_original`
  backup. "By default the original files are preserved with `_original` appended to their
  names."
- `-overwrite_original_in_place` — writes in place, preserving file attributes (Mac OS type/
  creator, extended attributes, hard links, ACLs). Slower; use when attributes matter.
- `-P` / `-preserve` — **preserve the filesystem modification date/time** of the original file.
  Without `-P`, writing metadata updates the file's mtime to now.
- `-r` / `-recurse` — recurse into subdirectories. `-r.` also descends into directories whose
  names begin with `.`.
- `-ext EXT` / `--ext EXT` — process only / skip files with the given extension.
  `-ext+ EXT` adds EXT to the normally-processed types. Multiple `-ext` args allowed.
  `-ext "*"` processes all files regardless of extension.
- `-o OUTFILE` — write output to a new file rather than modifying the input.
- `-m` / `-ignoreMinorErrors` — downgrade minor errors to warnings so the write proceeds.
- `-q` / `-quiet` — suppress informational messages; `-q -q` also suppresses warnings.

## Output formats

- `-j` / `-json` — JSON output. `-json` plus `-G` gives group-prefixed keys.
  `-j=JSONFILE` / `-j+=JSONFILE` **imports** a JSON file to write metadata.
- `-csv` / `-csv=CSVFILE` — CSV export/import. First row must contain tag names; the
  `SourceFile` column identifies the target on import.
- `-X` / `-xmlFormat` — RDF/XML output.
- `-s` / `-short` — print tag names rather than descriptions. `-s -s` (`-s2`) removes column
  padding; `-s -s -s` (`-s3`) prints values only.
- `-S` / `-veryShort` — equivalent to `-s2`.
- `-b` / `-binary` — output metadata in binary form (needed to extract embedded previews,
  thumbnails, ICC profiles).
- `-n` — disable print conversion globally (raw values).
- `-d FMT` — set date/time output format using `strftime` codes.
- `-w EXT` / `-textOut` — write console output to text files, one per source file. Supports
  format codes `%d` (directory), `%f` (filename without extension), `%e` (extension),
  `%c` (copy number).

## Argument files

- `-@ ARGFILE` — read command-line arguments from a file, **one argument per line**.
  This is the reliable way to pass values containing spaces, newlines, quotes, or non-ASCII
  characters, and to keep long metadata templates under version control.
  Use `-@ -` to read arguments from standard input.
  Lines beginning with `#` are comments. A `#[CSTR]` prefix enables C-string escapes.
  Blank lines are ignored.
  Note that `-@` does **not** shell-split lines: `-Artist=Jane Doe` on one line is a single
  argument, so no quoting is needed or wanted.

## Conditional processing and batching

- `-if EXPR` — process only files for which the Perl-like expression is true. Tag values are
  referenced as `$TagName`. Multiple `-if` options are ANDed.
  ```bash
  exiftool -shutterspeed -if '$make eq "Canon"' dir
  ```
- `-execute` — split the command line into multiple executions within a single process
  (much faster for large batches).
- `-common_args` — arguments following this apply to **all** `-execute` commands.
- `-stay_open True -@ ARGFILE` — keep exiftool running and feed it commands, for maximum
  throughput from a wrapper script.
- `-fileOrder TAG` — set processing order.
- `-progress` — show a progress indicator.

## Other

- `-charset [TYPE=]CHARSET` — set character encoding (`UTF8`, `Latin`, `Cyrillic`, …).
  Sub-types: `-charset filename=UTF8`, `-charset exif=…`, `-charset iptc=…`.
- `-api OPT[=VAL]` — set an Image::ExifTool API option, e.g.
  `-api QuickTimeUTC=1`, `-api LargeFileSupport=1`, `-api Compact=all`,
  `-api StructFormat=JSON`.
- `-list`, `-listw`, `-listf`, `-listg1`, `-listx` — enumerate tags, writable tags, supported
  file types, group names, and full tag database as XML.
- `-ver` — print version.

## Example command lines from the documentation

```bash
# Extract all EXIF data
exiftool -EXIF:all image.jpg

# Copy all tags from one image to another
exiftool -tagsFromFile source.jpg dest.jpg

# Batch rename by capture date, preserving file mod time and no backups
exiftool -overwrite_original -P "-filename<createdate" -d %Y%m%d.%%e DIR

# Shift all date tags forward by one year, only for files after a cutoff
exiftool -alldates+=1 -if '$CreateDate ge "2006:04:02"' dir

# Recursive JSON dump restricted to JPEGs
exiftool -r -ext jpg -json DIR > output.json

# Round-trip through CSV
exiftool -common -csv dir > out.csv
exiftool -csv=out.csv dir

# Write output text file next to each source file
exiftool -w %d%f.txt source.jpg

# Print shutter speed only for Canon files in a directory
exiftool -shutterspeed -if '$make eq "Canon"' dir
```
