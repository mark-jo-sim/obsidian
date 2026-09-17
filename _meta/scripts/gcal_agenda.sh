#!/usr/bin/env bash
# gcal agenda -> markdown table (bash port of gcal_agenda.js)
# Runs `gws calendar +agenda --today --format json` and renders the day's
# events as a markdown table, minus "Devroom".

set -uo pipefail

GWS=/opt/homebrew/bin/gws
CALENDAR=""
TIMEZONE=""
NO_EVENTS_TEXT="No calendar events found."
FALLBACK_TO_CODEBLOCK=1

while [[ $# -gt 0 ]]; do
  case "$1" in
    --calendar) CALENDAR="${2-}"; shift 2 ;;
    --timezone) TIMEZONE="${2-}"; shift 2 ;;
    --no-events-text) NO_EVENTS_TEXT="${2-}"; shift 2 ;;
    --no-fallback) FALLBACK_TO_CODEBLOCK=0; shift ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
done

cmd=("$GWS" "calendar" "+agenda" "--today" "--format" "json")
[[ -n "$CALENDAR" ]] && cmd+=(--calendar "$CALENDAR")
[[ -n "$TIMEZONE" ]] && cmd+=(--timezone "$TIMEZONE")

errfile="$(mktemp)"
raw="$("${cmd[@]}" 2>"$errfile")"
rc=$?
stderr="$(<"$errfile")"
rm -f "$errfile"

# gws failed: fall back to the raw stdout in a code block, else report why
if [[ $rc -ne 0 ]]; then
  if [[ -n "${raw// /}" && $FALLBACK_TO_CODEBLOCK -eq 1 ]]; then
    printf '```text\n%s\n```\n' "$raw"
  else
    why="${stderr:-unknown gws error}"
    [[ -n "${raw// /}" || -n "${stderr// /}" ]] || why="unknown gws error"
    echo "Calendar import failed: $why"
  fi
  exit 0
fi

if [[ -z "${raw// /}" ]]; then
  echo "$NO_EVENTS_TEXT"
  exit 0
fi

jqerr="$(mktemp)"
rows="$(printf '%s' "$raw" | jq -r '
  def esc:
    (tostring // "")
    | gsub("\\|"; "\\\\|")
    | gsub("[\\r\\n]+"; "<br>")
    | gsub("^\\s+|\\s+$"; "");

  # formatTime: date-only -> "All day", dateTime -> HH:MM (24h), else raw
  def fmtime:
    if . == null or . == "" then ""
    elif test("^\\d{4}-\\d{2}-\\d{2}$") then "All day"
    else . as $v
      | ((try capture("[T ](?<t>[0-9]{2}:[0-9]{2})") catch null) | .t? // $v)
    end;

  def endpoint($obj; $top):
    if ($obj | type) == "object"
    then ($obj.dateTime // $obj.date // $obj.startTime // $top // "")
    elif ($obj | type) == "string"
    then $obj
    else ($top // "")
    end;

  (if type == "array" then .
   elif (.items? | type) == "array" then .items
   elif (.events? | type) == "array" then .events
   else []
   end)[]
  | . as $e
  | {
      Start: (endpoint($e.start; $e.startTime) | fmtime),
      End: (endpoint($e.end; $e.endTime) | fmtime),
      Title: ($e.summary // $e.title // $e.name // "(Untitled)"),
      Location: ($e.location // "")
    }
  | select(.Title != "Devroom")
  | "| \(.Start | esc) | \(.End | esc) | \(.Title | esc) | \(.Location | esc) |"
' 2>"$jqerr")"
jqrc=$?
if [[ $jqrc -ne 0 ]]; then
  if [[ $FALLBACK_TO_CODEBLOCK -eq 1 ]]; then
    printf '```text\n%s\n```\n' "$raw"
  else
    echo "Calendar import failed: $(<"$jqerr")"
  fi
  rm -f "$jqerr"
  exit 0
fi
rm -f "$jqerr"

if [[ -z "${rows//[[:space:]]/}" ]]; then
  echo "$NO_EVENTS_TEXT"
  exit 0
fi

echo "| Start | End | Title | Location |"
echo "| --- | --- | --- | --- |"
echo "$rows"
