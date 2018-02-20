export class CacheCollection {
    constructor() {
        this.caches = {};
        this.cacheIDToIDMaps = {};
        this.idToCacheIDMaps = {};
        this.relationships = {};
    }

    createCache(cacheName, pk, retriever) {
        if (cacheName in this.caches) {
            return null;
        }
        const cache = { cacheName, pk, retriever, nextID: 1, data: {} };
        this.caches[cacheName] = cache;
        this.cacheIDToIDMaps[cacheName] = {};
        this.idToCacheIDMaps[cacheName] = {};
        return cache;
    }

    async invalidateCache(cacheName) {
        const cache = getCache(cacheName);
        cache.data = {};
        return cache.retriever();
    }

    async invalidateAll() {
        for (const cacheName of Object.keys(caches)) {
            await invalidateCache(cacheName);
        }
    }

    cacheItem(item, cacheName) {
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
        return item;
    }

    relateIDs(addr1, addr2) {
        const lookup1 = parseCacheAddress(addr1);
        const lookup2 = parseCacheAddress(addr2);
        const relationshipName = `${lookup1.cacheName}:${lookup2.cacheName}`;
        if (!(relationshipName in relationships)) {
            relationships[relationshipName] = {};
        }
        const cacheID1 = findCacheID(lookup1);
        const cacheID2 = findCacheID(lookup2);
        if (cacheID1 in relationships[relationshipName]) {
            relationships[relationshipName][cacheID1].push(cacheID2);
        }
        else {
            relationships[relationshipName][cacheID1] = [cacheID2];
        }
    }

    getRelatedItems(addr, relatedCacheName) {
        const lookup = parseCacheAddress(addr);
        const cacheID = findCacheID(lookup);
        const relationshipName = `${lookup.cacheName}:${relatedCacheName}`;
        if (cacheID in relationships[relationshipName]) {
            const relatedIDs = relationships[relationshipName][cacheID];
            const relatedItems = relatedIDs.map(relatedID => getItem(`${relatedCacheName}:${relatedID}|`));
            return relatedItems;
        }
        return [];
    }

    getItem(addr) {
        const lookup = parseCacheAddress(addr);
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

    getAll(cacheName) {
        const cache = getCache(cacheName);
        return Object.values(cache.data);
    }

    debugPrintCaches() {
        console.log(caches);
    }

    debugPrintRelationships() {
        console.log(relationships);
    }

    getCache(cacheName) {
        if (cacheName in caches) {
            const cache = caches[cacheName];
            return cache;
        }
        return null;
    }

    getNextCacheID(cacheName) {
        const cache = getCache(cacheName);
        if (cache) {
            const nextCacheID = `cache-${cache.nextID}`;
            cache.nextID += 1;
            return nextCacheID;
        }
        return null;
    }

    findCacheID(lookup) {
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

    parseCacheAddress(addr) {
        console.log(`parsingAddr...${addr}`);
        const [ cacheName, ids ] = addr.split(':');
        const [ id, cacheID ] = ids.split('|');
        console.log(`parsing...${cacheName} : ${id} | ${cacheID}`);
        return { cacheName, cacheID, id };
    }
}
