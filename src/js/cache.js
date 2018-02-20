export class Cache {
    constructor(name, pk, retriever) {
        this.name = name;
        this.pk = pk;
        this.retriever = retriever;
        this.data = {};
    }

    invalidate() {
        this.retriever();
    }

    cacheItem(item) {
        const pk = item[this.pk];
        this.data[pk] = item;
        return item;
    }

    getItem(pk) {
        return this.data[pk];
    }
}

export class CacheCollection {
    constructor() {
        this.caches = {};
    }

    addCache(cache) {
        this.caches[cache.name] = cache;
        return cache;
    }

    getCache(cacheName) {
        return this.caches[cacheName];
    }

    getItem(cacheName, cacheID, pk) {}
    resolve(cacheAddress) {}
}