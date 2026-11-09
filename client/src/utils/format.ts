export function formatDate(iso: string): string {
    return new Date(iso).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// The last 6 characters of the MongoDB id, easy to read for a customer.
export function shortId(id: string): string {
    return `#${id.slice(-6).toUpperCase()}`;
}
