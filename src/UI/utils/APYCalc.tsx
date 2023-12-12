
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(duration);
dayjs.extend(customParseFormat);

export const calculateAPY = (
	contractExpiry: string,
	risk: number,
	earn: number
) => {
	if (risk <= 0 || earn <= 0) return "0"; 
    const current = dayjs();
    const expiry = dayjs(contractExpiry, 'YYMMDDHHm')
    const diff = dayjs.duration(expiry.diff(current)).asYears()
    const apy = (100 * (earn /(risk - 1)) )/ diff;
    return `${apy.toFixed(1)}`
};