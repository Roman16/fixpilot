export function debounce<F extends (...args: any[]) => any>(
    func: F,
    wait: number = 300,
    immediate: boolean = false
) {
    let timeout: ReturnType<typeof setTimeout> | null;

    const debounced = function(this: any, ...args: Parameters<F>) {
        const context = this;

        const later = () => {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };

        const callNow = immediate && !timeout;

        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(later, wait);

        if (callNow) {
            func.apply(context, args);
        }
    };

    debounced.cancel = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };

    return debounced as F & { cancel: () => void };
}
