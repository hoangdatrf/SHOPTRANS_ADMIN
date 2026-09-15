/**
 * Xử lý các thuộc tính string trong object
 * - Trim các giá trị string
 * - Chuyển null thành empty string
 * @param obj Object cần xử lý
 * @returns Object đã được xử lý
 */
export function processStringProperties(obj: Record<string, any>): Record<string, any> {
    // Duyệt qua các thuộc tính chính của object
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const subObj = obj[key];
            // Kiểm tra subObj là object
            if (subObj && typeof subObj === 'object') {
                // Duyệt qua các thuộc tính con của subObj
                for (const subKey in subObj) {
                    if (Object.prototype.hasOwnProperty.call(subObj, subKey)) {
                        const value = subObj[subKey];
                        // Kiểm tra nếu giá trị là string hoặc null
                        if (typeof value === 'string' || value === null) {
                            // Nếu null, gán thành '', nếu không thì trim
                            subObj[subKey] = value === null ? '' : value.trim();
                        }
                    }
                }
            }
        }
    }
    return obj;
}

/**
 * Kiểm tra object có rỗng không
 * @param obj Object cần kiểm tra
 * @returns true nếu object rỗng, false nếu không
 */
export function isEmptyObject(obj: Record<string, any>): boolean {
    return Object.keys(obj).length === 0;
}

/**
 * Xóa các thuộc tính có giá trị null hoặc undefined
 * @param obj Object cần xử lý
 * @returns Object đã được xử lý
 */
export function removeNullProperties(obj: Record<string, any>): Record<string, any> {
    const result = { ...obj };
    for (const key in result) {
        if (result[key] === null || result[key] === undefined) {
            delete result[key];
        }
    }
    return result;
}

/**
 * Chuyển object thành query params
 * @param obj Object cần xử lý
 * @returns Query params
 */
export function objectToQueryParams(obj: Record<string, any>): string {
    return Object.entries(obj)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
        .join('&');
}