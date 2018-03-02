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
        item.cacheID = `${this.name}-${this.nextCacheID}`;
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
        const cacheID = this.getCacheIDForPK(pk);
        return this.getItemByCacheID(cacheID);
    }

    getItemByCacheID(cacheID) {
        return this.data[cacheID];
    }

    getCacheIDForPK(pk) {
        const cacheID = this.pkToCacheIDMap[pk];
        return cacheID;
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
        this.relationships = {};
        this.pendingOperations = [];
    }

    createCache(name, pk, dao) {
        const cache = new Cache(name, pk, dao);
        this.caches[name] = cache;
        return cache;
    }

    getCache(cacheName) {
        return this.caches[cacheName];
    }

    cacheItem(item, cacheName) {
        const cache = this.getCache(cacheName);
        const cachedItem = cache.cacheItem(item);
        return cachedItem;
    }

    getItem(cacheID) {
        const cacheName = this.getCacheName(cacheID);
        const cache = this.getCache(cacheName);
        return cache.getItemByCacheID(cacheID);
    }

    getItemByPK(pk, cacheName) {
        const cache = this.getCache(cacheName);
        return cache.getItemByPK(pk);
    }

    createItem(item, cacheName) {
        const cache = this.getCache(cacheName);
        const newItem = cache.createItem(item);
        this.addPendingOperation(CacheCollection.CREATE_OPER, item.cacheID);
        return newItem;
    }

    updateItem(item, cacheName) {
        const cache = this.getCache(cacheName);
        const updatedItem = cache.updateItem(item);
        this.addPendingOperation(CacheCollection.UPDATE_OPER, updatedItem.cacheID);
        return updatedItem;
    }

    deleteItem(item, cacheName) {
        const cache = this.getCache(cacheName);
        const deletedItem = cache.deleteItem(item);
        this.addPendingOperation(CacheCollection.DELETE_OPER, deletedItem.cacheID);
        return deletedItem;
    }

    relateItems(relInfo) {
        const relName = `${relInfo.cacheName1}-${relInfo.cacheName2}`;
        const cache1 = this.getCache(relInfo.cacheName1);
        const cacheID1 = cache1.getCacheIDForPK(relInfo.pk1);
        const inverseRelName = `${relInfo.cacheName2}-${relInfo.cacheName1}`;
        const cache2 = this.getCache(relInfo.cacheName2);
        const cacheID2 = cache2.getCacheIDForPK(relInfo.pk2);
        let rel;
        rel = this.relationships[relName];
        if (!rel) {
            rel = {}
            this.relationships[relName] = rel;
        }
        if (!(cacheID1 in rel)) {
            rel[cacheID1] = [];
        }
        let inverseRel;
        inverseRel = this.relationships[inverseRelName];
        if (!inverseRel) {
            inverseRel = {};
            this.relationships[inverseRelName] = inverseRel;
            
        }
        if (!(cacheID2 in inverseRel)) {
            inverseRel[cacheID2] = [];
        }
        rel[cacheID1].push(cacheID2);
        inverseRel[cacheID2].push(cacheID1);
    }

    getRelatedItems(relInfo) {
        const relName = `${relInfo.cacheName}-${relInfo.relatedCacheName}`;
        const cache1 = this.getCache(relInfo.cacheName);
        const cacheID1 = cache1.getCacheIDForPK(relInfo.pk);
        const rel = this.relationships[relName];
        const relatedCacheIDs = rel[cacheID1];
        const cache2 = this.getCache(relInfo.relatedCacheName);
        const relatedItems = relatedCacheIDs.map(cacheID => cache2.getItemByCacheID(cacheID));
        return relatedItems;
    }

    getCacheName(cacheID) {
        const [ cacheName ] = cacheID.split('-');
        return cacheName;
    }

    addPendingOperation(operation, cacheID) {
        this.pendingOperations.push({ operation, cacheID });
    }

    commit() {
        for (let operation of this.pendingOperations) {
            const cacheName = this.getCacheName(operation.cacheID);
            const cache = this.getCache(cacheName);
            const item = cache.getItemByCacheID(operation.cacheID);
            switch (operation.operation) {
            case CacheCollection.CREATE_OPER:
                cache.dao.createItem(item);
                break;
            case CacheCollection.UPDATE_OPER:
                cache.dao.updateItem(item);
                break;
            case CacheCollection.DELETE_OPER:
                cache.dao.deleteItem(item);
            }
        }
        this.pendingOperations = [];
    }
}

CacheCollection.CREATE_OPER = 1;
CacheCollection.UPDATE_OPER = 2;
CacheCollection.DELETE_OPER = 3;

export class DAO {
    constructor() {}
    retrieveItems() {}
    createItem(item) {}
    updateItem(item) {}
    deleteItem(item) {}
}
