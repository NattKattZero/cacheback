import { test } from 'tape';
import * as mockdao from './mockdao';
import { CacheCollection, Cache } from '../src/js/cache';

/*
 * Cache tests
 */

test('create Cache', t => {
    const cacheName = 'user';
    const pk = 'primaryKey';
    const retriever = () => {};
    const userCache = new Cache(cacheName, pk, retriever);
    t.ok(userCache, 'should return a cache instance');
    t.equal(userCache.name, cacheName, 'cache name should match what was passed into constructor');
    t.equal(userCache.pk, pk, 'pk should match what was passed into constructor');
    t.equal(userCache.retriever, retriever, 'retriever should match what was passed into constructor');
    t.end();
});

test('Cache.invalidate', t => {
    const retriever = (cache) => {
        t.end();
    };
    const userCache = new Cache('user', 'id', retriever);
    userCache.invalidate();
});

test('Cache.cacheItem', t => {
    const userCache = new Cache('user', 'id', null);
    const userItem = { id: 1, name: 'testUser' };
    const cachedItem = userCache.cacheItem(userItem);
    t.ok(cachedItem, 'should return a cached item');
    t.ok(cachedItem.cacheID, 'newly cached item should have a cacheID');
    t.equal(cachedItem.id, userItem.id, 'cached pk should equal item pk');
    t.equal(cachedItem.name, userItem.name, 'cached name should equal item name');
    t.end();
});

test('Cache.getItemByCacheID', t => {
    const userCache = new Cache('user', 'id', null);
    const userItem = { id: 1, name: 'testUser' };
    const cachedItem = userCache.cacheItem(userItem);
    t.ok(cachedItem, 'should return the item that was cached');
    t.ok(cachedItem.cacheID, 'cached item should have a cache ID');
    const retrievedItem = userCache.getItemByCacheID(cachedItem.cacheID);
    t.ok(retrievedItem, 'should return a cached item for the given cacheID');
    t.equal(retrievedItem.cacheID, cachedItem.cacheID, 'retrieved item\'s cacheID should match the cached item\'s cacheID');
    t.equal(retrievedItem.id, userItem.id, 'retrieved pk should equal item pk');
    t.equal(retrievedItem.name, userItem.name, 'retrieved name should equal item name');
    t.end();
});

test('Cache.getItemByPK', t => {
    const userCache = new Cache('user', 'id', null);
    const userItem = { id: 1, name: 'testUser' };
    userCache.cacheItem(userItem);
    const retrievedItem = userCache.getItemByPK(1);
    t.ok(retrievedItem, 'should return a cached item');
    t.equal(retrievedItem.id, userItem.id, 'retrieved pk should equal item pk');
    t.equal(retrievedItem.name, userItem.name, 'retrieved name should equal item name');
    t.end();
});

/*
 * CacheCollection tests
 */

test('CacheCollection.addCache', t => {
    const caches = new CacheCollection();
    const userCache = new Cache('user', 'id', null);
    const addedCache = caches.addCache(userCache);
    t.ok(addedCache, 'should return the added cache');
    t.deepEqual(addedCache, userCache, 'returned cache should equal the one we created');
    t.end();
});

test('CacheCollection.getCache', t => {
    const caches = new CacheCollection();
    const userCache = new Cache('user', 'id', null);
    const addedCache = caches.addCache(userCache);
    t.ok(addedCache, 'should return the newly added cache');
    const retrievedCache = caches.getCache('user');
    t.ok(retrievedCache, 'should return a cache with this cache name');
    t.deepEqual(retrievedCache, userCache, 'cache retrieved should match the one added');
    t.end();
});
