
const debugLog = (action, data = {}) => {
    const timestamp = new Date().toISOString();
    console.log(`[StorageUtil] ${action}:`, { timestamp, ...data });
};

export const storage = {
    setItem: (key, value) => {
        try {
            if (localStorage) {
                localStorage.setItem(key, value);
                debugLog('setItem_localStorage_success', { key });
                return true;
            }
        } catch (e) {
            debugLog('setItem_localStorage_failed', { key, error: e.message });
        }

        try {
            if (sessionStorage) {
                sessionStorage.setItem(key, value);
                debugLog('setItem_sessionStorage_success', { key });
                return true;
            }
        } catch (e) {
            debugLog('setItem_sessionStorage_failed', { key, error: e.message });
        }

        try {
            document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
            debugLog('setItem_cookie_success', { key });
            return true;
        } catch (e) {
            debugLog('setItem_cookie_failed', { key, error: e.message });
        }

        return false;
    },

    getItem: (key) => {
        try {
            if (localStorage) {
                const value = localStorage.getItem(key);
                if (value !== null) {
                    debugLog('getItem_localStorage_success', { key });
                    return value;
                }
            }
        } catch (e) {
            debugLog('getItem_localStorage_failed', { key, error: e.message });
        }

        try {
            if (sessionStorage) {
                const value = sessionStorage.getItem(key);
                if (value !== null) {
                    debugLog('getItem_sessionStorage_success', { key });
                    return value;
                }
            }
        } catch (e) {
            debugLog('getItem_sessionStorage_failed', { key, error: e.message });
        }

        try {
            const match = document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
            if (match) {
                const value = decodeURIComponent(match[2]);
                debugLog('getItem_cookie_success', { key });
                return value;
            }
        } catch (e) {
            debugLog('getItem_cookie_failed', { key, error: e.message });
        }

        debugLog('getItem_not_found', { key });
        return null;
    },

    removeItem: (key) => {
        try {
            if (localStorage) localStorage.removeItem(key);
        } catch (e) {}
        try {
            if (sessionStorage) sessionStorage.removeItem(key);
        } catch (e) {}
        try {
            document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
        } catch (e) {}
        debugLog('removeItem_completed', { key });
    }
};
