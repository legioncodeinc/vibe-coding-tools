#!/usr/bin/env bash
# Assemble the demo from its edit list. Requires ffmpeg. Run from the demo folder.
# segments.tsv lists one clip per line (file, in_ms, out_ms, scene): reorder lines,
# delete them, trim in/out points, or splice in extra clips placed under clips/.
# After editing it, rerun build-cues.mjs so captions match, then this script.
# Designed by Legion Code Inc.
set -euo pipefail
umask 077
fail() { echo "ERROR: video assembly refused unsafe input or existing output; use a fresh private output directory" >&2; exit 1; }
private_input() {
  [[ -f "$1" && ! -L "$1" ]] || fail
  local links
  links=$(stat -c %h "$1" 2>/dev/null || stat -f %l "$1" 2>/dev/null) || fail
  [[ "$links" == 1 ]] || fail
}
[[ -d scenes && ! -L scenes ]] || fail
for input in segments.tsv captions.vtt assembly.conf; do private_input "$input"; done
END_HOLD=$(sed -n 's/^end_hold_seconds=\([0-9][0-9]*\(\.[0-9][0-9]*\)\{0,1\}\)$/\1/p' assembly.conf | head -n 1)
END_HOLD=${END_HOLD:-0}

files=(); ins=(); outs=()
while IFS=$'\t' read -r file in_ms out_ms _scene || [[ -n "${file:-}" ]]; do
  [[ -z "$file" || "$file" == \#* ]] && continue
  [[ "$file" =~ ^(scenes|clips)/[A-Za-z0-9._-]+\.webm$ && "$file" != *..* ]] || fail
  [[ "$in_ms" =~ ^[0-9]+$ && "$out_ms" =~ ^[0-9]+$ ]] || fail
  # Base 10, as build-cues.mjs reads them: a leading zero is not octal.
  in_ms=$(( 10#$in_ms )); out_ms=$(( 10#$out_ms ))
  (( out_ms > in_ms )) || fail
  [[ "$file" != clips/* ]] || [[ -d clips && ! -L clips ]] || fail
  private_input "$file"
  files+=("$file"); ins+=("$in_ms"); outs+=("$out_ms")
done < segments.tsv
(( ${#files[@]} > 0 )) || fail

# Preflight every derived output before creating the first one.
[[ ! -e segments && ! -L segments ]] || fail
for output in segments-concat.txt demo-silent.mp4 demo.mp4; do
  [[ ! -e "$output" && ! -L "$output" ]] || fail
done
mkdir segments
seconds() { printf '%d.%03d' "$(( $1 / 1000 ))" "$(( $1 % 1000 ))"; }

# 1) Cut and normalize every segment to identical H.264 1920x1080 streams
#    (the concat demuxer needs identical codec parameters). The last one holds its end frame.
last=$(( ${#files[@]} - 1 ))
for i in "${!files[@]}"; do
  n=$(printf '%03d' "$(( i + 1 ))")
  vf="scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black"
  if (( i == last )) && [[ "$END_HOLD" != 0 ]]; then vf="$vf,tpad=stop_mode=clone:stop_duration=$END_HOLD"; fi
  # Trim on the input side: an output -to would also cut off the tpad end hold.
  ffmpeg -v error -n -ss "$(seconds "${ins[$i]}")" -t "$(seconds "$(( outs[i] - ins[i] ))")" -i "${files[$i]}" -vf "$vf" \
    -c:v libx264 -pix_fmt yuv420p -crf 20 -preset slow -r 30 -an "segments/$n.mp4"
  echo "file 'segments/$n.mp4'" >> segments-concat.txt
done
# 2) Concatenate without re-encoding.
ffmpeg -v error -n -f concat -safe 1 -i segments-concat.txt -c copy demo-silent.mp4
# 3) Soft, toggleable captions; +faststart last so playback starts before the download finishes.
ffmpeg -v error -n -i demo-silent.mp4 -i captions.vtt -map 0:v -map 1 -c:v copy -c:s mov_text -movflags +faststart demo.mp4
echo "demo.mp4 assembled from ${#files[@]} segment(s)"
# Optional narration, one clip per cue placed at its start (see narration/tts-manifest.json):
#   ffmpeg -n -i demo.mp4 -i narration.wav -map 0:v -map 1:a -map 0:s? -c:v copy -c:s copy -c:a aac -shortest -movflags +faststart demo-narrated.mp4
# Optional burned-in scene titles (titles.srt) or captions for players without subtitle tracks:
#   ffmpeg -n -i demo-silent.mp4 -vf subtitles=titles.srt -c:v libx264 -pix_fmt yuv420p -crf 20 demo-titled.mp4
# Optional GIF preview (two-pass palette):
#   ffmpeg -n -i demo-silent.mp4 -vf "fps=15,scale=480:-1:flags=lanczos,palettegen" palette.png
#   ffmpeg -n -i demo-silent.mp4 -i palette.png -lavfi "fps=15,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse" demo.gif
