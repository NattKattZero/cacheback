const caches = {};

export function createCache(cacheName, pk, retriever) {
    if (!(cacheName in caches)) {
        const cache = { pk, retriever, nextId: 1, data: {}, uncommittedData: {} };
        caches[cacheName] = cache;
        return cache;
    }
}

export async function invalidateCache(cacheName) {
    const cache = getCache(cacheName);
    cache.data = {};
    cache.uncommittedData = {};
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
    if (key) {
        cache.data[key] = item;
    }
    else {
        cache.uncommittedData[cache.nextId] = item;
        cache.nextId += 1;
    }
}

export function getItemForKey(key, cacheName) {
    const cache = getCache(cacheName);
    if (key in cache.data) {
        return cache.data[key];
    }
    if (key in cache.uncommittedData) {
        return cache.uncommittedData[key];
    }
    return null;
}

export function getAll(cacheName) {
    const cache = getCache(cacheName);
    return Object.values(cache.data).concat(Object.values(cache.uncommittedData));
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
