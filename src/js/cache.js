export class Cache {
    constructor(name, pk, dao) {
        this.name = name;
        this.pk = pk;
        this.dao = dao;
        this.nextCacheID = 1;
        this.pkToCacheIDMap = {};
        this.cacheIDToPKMap = {};
        this.data = {};
    }

    invalidate() {
        this.dao.retrieveItems();
    }

    cacheItem(item) {
        const pk = item[this.pk];
        item.cacheID = `${this.name}:${this.nextCacheID}`;
        if (pk) {
            this.pkToCacheIDMap[pk] = item.cacheID;
            this.cacheIDToPKMap[item.cacheID] = pk;
        }
        this.nextCacheID += 1;
        this.data[item.cacheID] = item;
        return item;
    }

    createItem(item) {
        const cachedItem = this.cacheItem(item);
        return cachedItem;
    }

    getItemByPK(pk) {
        const cacheID = this.pkToCacheIDMap[pk];
        return this.getItemByCacheID(cacheID);
    }

    getItemByCacheID(cacheID) {
        return this.data[cacheID];
    }

    updateItem(item) {
        this.data[item.cacheID] = item;
        return item;``
    }

    deleteItem(item) {
        delete this.data[item.cacheID];
        return item;
    }

    commit() {
        this.dao.createItem(null);
        this.dao.updateItem(null);
        this.dao.deleteItem(null);
    }
}

export class CacheCollection {
    constructor() {
        this.caches = {};
    }

    createCache(name, pk, dao) {
        const cache = new Cache(name, pk, dao);
        this.caches[name] = cache;
        return cache;
    }

    getCache(cacheName) {
        return this.caches[cacheName];
    }

    getItem(cacheName, cacheID, pk) {}
    resolve(cacheAddress) {}
}

export class DAO {
    constructor() {}
    retrieveItems() {}
    createItem(item) {}
    updateItem(item) {}
    deleteItem(item) {}
}
