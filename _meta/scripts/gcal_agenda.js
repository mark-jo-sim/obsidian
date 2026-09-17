const { execFile } = require('child_process');
const { promisify } = require('util');
const execFileAsync = promisify(execFile);

function escapeCell(value) {
  return String(value ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, '<br>')
    .trim();
}

function toMarkdownTable(rows) {
  const headers = ['Start', 'End', 'Title', 'Location'];
  const headerRow = `| ${headers.join(' | ')} |`;
  const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
  const bodyRows = rows.map(row => (
    `| ${headers.map(header => escapeCell(row[header])).join(' | ')} |`
  ));
  return [headerRow, separatorRow, ...bodyRows].join('\n');
}

function extractEvents(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.events)) return payload.events;
  return [];
}


function formatTime(value) {
 if (!value) return '';

  // All-day events often come through as YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'All day';

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);

  return d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function normalizeEvent(event) {
  const start = event?.start?.dateTime || event?.start?.date || event?.startTime || event?.start || '';
  const end = event?.end?.dateTime || event?.end?.date || event?.endTime || event?.end || '';

  return {
    Start: formatTime(start),
    End: formatTime(end),
    Title: event?.summary || event?.title || event?.name || '(Untitled)',
    Location: event?.location || '',
  };
}


function removeDevroom(row) {
  const devRoom = "Devroom";
  return row.Title !== devRoom;
}

module.exports = async function gcalAgenda(tp, args = {}) {
  const calendar = args.calendar || '';
  const timezone = args.timezone || '';
  const noEventsText = args.noEventsText || 'No calendar events found.';
  const fallbackToCodeBlock = args.fallbackToCodeBlock ?? true;

  const cmd = ['calendar', '+agenda', '--today', '--format', 'json'];
  if (calendar) cmd.push('--calendar', calendar);
  if (timezone) cmd.push('--timezone', timezone);

  try {
    const { stdout } = await execFileAsync('/opt/homebrew/bin/gws', cmd, {
      env: process.env,
      maxBuffer: 1024 * 1024,
    });

    const cleaned = (stdout || '').trim();
    if (!cleaned) return noEventsText;

    const parsed = JSON.parse(cleaned);
    const events = extractEvents(parsed)
      .map(normalizeEvent)
      .filter(removeDevroom);

    if (!events.length) return noEventsText;
    return toMarkdownTable(events);
  } catch (error) {
    const raw = error?.stdout?.trim();
    if (raw && fallbackToCodeBlock) {
      return ['```text', raw, '```'].join('\n');
    }
    return `Calendar import failed: ${error?.stderr?.trim() || error?.message || 'Unknown gws error'}`;
  }
};
