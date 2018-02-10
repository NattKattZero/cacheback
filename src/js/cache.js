const caches = {};
const cacheIdLookups = {};

export function createCache(cacheName, pk, retriever) {
    if (!(cacheName in caches)) {
        const cache = { pk, retriever, nextId: 1, data: {} };
        caches[cacheName] = cache;
        cacheIdLookups[cacheName] = {};
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
    const cacheId = `cache-${cache.nextId}`;
    cache.nextId += 1;
    item.cacheId = cacheId;
    cache.data[cacheId] = item;
    cacheIdLookups[cacheName][key] = cacheId;
}

export function getItem(lookup) {
    const cacheName = lookup.cacheName;
    let cacheId;
    if (lookup.cacheId) {
        cacheId = lookup.cacheId;
    }
    else {
        cacheId = cacheIdLookups[cacheName][lookup.id];
    }
    const cache = getCache(cacheName);
    if (cacheId in cache.data) {
        return cache.data[cacheId];
    }
    return null;
}

export function getAll(cacheName) {
    const cache = getCache(cacheName);
    return Object.values(cache.data);
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
