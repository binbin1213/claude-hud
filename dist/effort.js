import { t } from './i18n/index.js';
import { stdinText } from './stdin.js';
const SYMBOLS = {
    low: '○',
    medium: '◔',
    high: '◑',
    xhigh: '◕',
    max: '●',
};
const LEVEL_KEYS = {
    low: 'effort.low',
    medium: 'effort.medium',
    high: 'effort.high',
    xhigh: 'effort.xhigh',
    max: 'effort.max',
};
export function effortInfo(value) {
    const level = stdinText(value, 32)?.toLowerCase();
    return level ? { level, symbol: SYMBOLS[level] ?? '' } : null;
}
// stdin reports ultracode as an ordinary level, so the transcript marker is what
// distinguishes it; the reported level is wrapped rather than assumed.
export function resolveEffortLevel(effort, ultracodeActive) {
    const info = effortInfo(effort?.level);
    return info && ultracodeActive === true ? { ...info, level: `ultracode(${info.level})` } : info;
}
const localizedLevel = (level) => {
    const ultracode = /^ultracode\((.*)\)$/.exec(level);
    if (ultracode)
        return `ultracode(${localizedLevel(ultracode[1])})`;
    const key = LEVEL_KEYS[level];
    return key ? t(key) : level;
};
/** `◑ high`, `◑`, or `high`, per display.effortFormat. */
export function formatEffort(info, format) {
    const level = localizedLevel(info.level);
    // The symbol alone can't carry the ultracode marker, so symbol mode keeps the full form.
    if (format === 'symbol' && info.symbol && !info.level.startsWith('ultracode('))
        return info.symbol;
    return format === 'text' || !info.symbol ? level : `${info.symbol} ${level}`;
}
//# sourceMappingURL=effort.js.map