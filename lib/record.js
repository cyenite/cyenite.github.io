/**
 * The contribution record published by the cyenite/cyenite profile workflow.
 * Daily counts arrive anonymous; repositories are public ones only.
 */

export const RECORD_URL =
    process.env.NEXT_PUBLIC_RECORD_URL || 'https://raw.githubusercontent.com/cyenite/cyenite/master/assets/activity.json';

export const RANGES = [
    { label: '1M', span: 30 },
    { label: '3M', span: 90 },
    { label: '6M', span: 180 },
    { label: '1Y', span: 365 },
];

export const MIN_SPAN = 14;

// en-GB abbreviates September as "Sept"; three-letter months keep the axis labels a fixed width.
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const toDate = (iso) => new Date(`${iso.slice(0, 10)}T00:00:00Z`);

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
export const formatMonth = (iso) => MONTHS[toDate(iso).getUTCMonth()];
export const formatShort = (iso) => `${toDate(iso).getUTCDate()} ${formatMonth(iso)}`;
export const formatFull = (iso) => `${DAYS[toDate(iso).getUTCDay()]} ${formatShort(iso)} ${iso.slice(0, 4)}`;
export const formatValue = (value) => value.toFixed(1);

export function parseRecord(raw) {
    const days = raw.days.map(([date, count, open, high, low, close, ma20], index) => ({
        index,
        date,
        count,
        open,
        high,
        low,
        close,
        ma20,
        isUp: close >= open,
    }));
    const indexByDate = new Map(days.map((day) => [day.date, day.index]));
    const repos = raw.repos
        .filter((repo) => indexByDate.has(repo.created))
        .map((repo) => ({ ...repo, index: indexByDate.get(repo.created) }));

    return { ...raw, days, repos };
}

/** Round-number gridlines, the way a printed graticule steps its interval. */
export function niceTicks(min, max, count = 4) {
    const raw = (max - min) / count;
    const magnitude = 10 ** Math.floor(Math.log10(raw || 1));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? raw;
    const ticks = [];
    for (let tick = Math.ceil(min / step) * step; tick <= max + 1e-9; tick += step) {
        ticks.push(Number(tick.toFixed(6)));
    }
    return ticks;
}
