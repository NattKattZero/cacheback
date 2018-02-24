import { test } from 'tape';
import { StubDAO } from './mockdao';
import { CacheCollection, Cache, DAO } from '../src/js/cache';

/*
 * Cache tests
 */

test('create Cache', t => {
    const cacheName = 'user';
    const pk = 'primaryKey';
    const stubDAO = new StubDAO(t);
    const userCache = new Cache(cacheName, pk, stubDAO);
    t.ok(userCache, 'should return a cache instance');
    t.equal(userCache.name, cacheName, 'cache name should match what was passed into constructor');
    t.equal(userCache.pk, pk, 'pk should match what was passed into constructor');
    t.equal(userCache.dao, stubDAO, 'retriever should match what was passed into constructor');
    t.end();
});

test('Cache.invalidate', t => {
    const userCache = new Cache('user', 'id', new StubDAO(t));
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

test('Cache.createItem', t => {
    const userCache = new Cache('user', 'id', null);
    const userItem = { name: 'testUser' };
    const cachedItem = userCache.createItem(userItem);
    t.ok(cachedItem, 'should return a cached item');
    t.ok(cachedItem.cacheID, 'newly cached item should have a cacheID');
    t.notOk(cachedItem.id, 'cached pk should not yet exist');
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

test('Cache.updateItem', t => {
    const userCache = new Cache('user', 'id', null);
    const userItem = { id: 1, name: 'testUser' };
    const cachedItem = userCache.cacheItem(userItem);
    t.ok(cachedItem, 'should return the item that was cached');
    const newUserNameItem = { id: cachedItem.id, cacheID: cachedItem.cacheID, name: 'updatedTestUser' };
    const updatedUserItem = userCache.updateItem(newUserNameItem);
    t.ok(updatedUserItem, 'should return an updated item');
    t.equal(newUserNameItem.id, updatedUserItem.id, 'new and updated item\'s pks should match');
    t.equal(newUserNameItem.cacheID, updatedUserItem.cacheID, 'new and updated item\'s cacheID should match');
    t.equal(newUserNameItem.name, updatedUserItem.name, 'new and updated item\'s name should match');
    t.end();
});

test('Cache.deleteItem', t => {
    const userCache = new Cache('user', 'id', null);
    const userItem = { id: 1, name: 'testUser' };
    const cachedItem = userCache.cacheItem(userItem);
    t.ok(cachedItem, 'should return the item that was cached');
    const removedItem = userCache.deleteItem(cachedItem);
    t.ok(removedItem, 'removed item should be returned');
    t.deepEqual(removedItem, cachedItem, 'returned removed item should match original cached item');
    const retrievedItem = userCache.getItemByCacheID(cachedItem.cacheID);
    t.notOk(retrievedItem, 'should not be able to retrieve item from cache now that it has been removed');
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
