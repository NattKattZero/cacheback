const caches = {};

export function createCache(cacheName, pk, retriever) {
    if (!(cacheName in caches)) {
        const cache = { pk, retriever, data: { } };
        caches[cacheName] = cache;
        return cache;
    }
}

export async function invalidateCache(cacheName) {
    const cache = getCache(cacheName);
    cache.data = {};
    return cache.retriever();
}

export async function invalidateAll() {
    for (const cacheName of Object.keys(caches)) {
        await invalidateCache(cacheName);
    }
}

export function createItem(item, cacheName) {
    const cache = getCache(cacheName);
    const key = item[cache.pk];
    cache.data[key] = item;
}

export function getItemForKey(key, cacheName) {
    const cache = getCache(cacheName);
    return cache.data[key];
}

export function getAll(cacheName) {
    const cache = getCache(cacheName);
    return cache.data;
}

export function debugPrintCaches() {
    console.log(caches);
}

function getCache(cacheName) {
    if (cacheName in caches) {
        const cache = caches[cacheName];
        return cache;
    }
    return null;
}