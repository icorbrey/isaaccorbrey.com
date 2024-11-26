export const classes = (optional: Record<string, boolean>, always?: string) =>
	Object.keys(optional).filter(k => optional[k]).join(' ')
	+ (0 < (always?.length ?? 0) ? ` ${always}` : '');
