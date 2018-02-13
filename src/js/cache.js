const caches = {};
const cacheIDToIDMaps = {};
const idToCacheIDMaps = {};
const relationships = {};

export function createCache(cacheName, pk, retriever) {
    if (!(cacheName in caches)) {
        const cache = { pk, retriever, nextID: 1, data: {} };
        caches[cacheName] = cache;
        cacheIDToIDMaps[cacheName] = {};
        idToCacheIDMaps[cacheName] = {};
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

export function cacheItem(item, cacheName) {
    const cache = getCache(cacheName);
    const key = item[cache.pk];
    const cacheID = findCacheID({
        cacheName,
        id: key
    });
    item.cacheID = cacheID;
    cache.data[cacheID] = item;
    cacheIDToIDMaps[cacheName][cacheID] = key;
    idToCacheIDMaps[cacheName][key] = cacheID;
}

export function relateIDs(lookup1, lookup2) {
    const relationshipName = `${lookup1.cacheName}:${lookup2.cacheName}`;
    if (!(relationshipName in relationships)) {
        relationships[relationshipName] = {};
    }
    const cacheID1 = findCacheID(lookup1);
    const cacheID2 = findCacheID(lookup2);
    if (cacheID1 in relationships[relationshipName]) {
        relationships[relationshipName][cacheID1].push(cacheID2);
        console.log(`relating: ${cacheID1} to ${cacheID2}`);
    }
    else {
        relationships[relationshipName][cacheID1] = [cacheID2];
    }
}

export function getRelatedItems(lookup, relatedCacheName) {
    const cacheID = findCacheID(lookup);
    const relationshipName = `${lookup.cacheName}:${relatedCacheName}`;
    if (cacheID in relationships[relationshipName]) {
        const relatedIDs = relationships[relationshipName][cacheID];
        const relatedItems = relatedIDs.map(relatedID => getItem({ cacheID: relatedID, cacheName: relatedCacheName }));
        return relatedItems;
    }
    return [];
}

export function getItem(lookup) {
    const cacheName = lookup.cacheName;
    let cacheID;
    if (lookup.cacheID) {
        cacheID = lookup.cacheID;
    }
    else {
        cacheID = idToCacheIDMaps[cacheName][lookup.id];
    }
    const cache = getCache(cacheName);
    if (cacheID in cache.data) {
        return cache.data[cacheID];
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

export function debugPrintRelationships() {
    console.log(relationships);
}

function getCache(cacheName) {
    if (cacheName in caches) {
        const cache = caches[cacheName];
        return cache;
    }
    return null;
}

function getNextCacheID(cacheName) {
    const cache = getCache(cacheName);
    if (cache) {
        const nextCacheID = `cache-${cache.nextID}`;
        cache.nextID += 1;
        return nextCacheID;
    }
    return null;
}

function findCacheID(lookup) {
    if (lookup.cacheID) {
        return lookup.cacheID;
    }
    if (lookup.id in idToCacheIDMaps[lookup.cacheName]) {
        return idToCacheIDMaps[lookup.cacheName][lookup.id];
    }
    const cacheID = getNextCacheID(lookup.cacheName);
    idToCacheIDMaps[lookup.cacheName][lookup.id] = cacheID;
    cacheIDToIDMaps[lookup.cacheName][cacheID] = lookup.id;
    return cacheID;
}
