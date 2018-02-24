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
    t.plan(1);
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

test('Cache.commit', t => {
    const dao = new StubDAO(t);
    const userCache = new Cache('user', 'id', dao);
    t.plan(3);
    userCache.commit();
    t.end();
});

/*
 * CacheCollection tests
 */

test('CacheCollection.createCache', t => {
    const caches = new CacheCollection();
    const userCache = caches.createCache('user', 'id', null);
    t.ok(userCache, 'should return the new cache');
    t.equal(userCache.name, 'user', 'cache name should match what was sent in');
    t.equal(userCache.pk, 'id', 'pk should match what was sent in');
    t.end();
});

test('CacheCollection.getCache', t => {
    const caches = new CacheCollection();
    const userCache = caches.createCache('user', 'id', null);
    t.ok(userCache, 'should return the newly created cache');
    const retrievedCache = caches.getCache('user');
    t.ok(retrievedCache, 'should return a cache with this cache name');
    t.deepEqual(retrievedCache, userCache, 'cache retrieved should match the one added');
    t.end();
});

test('CacheCollection.cacheItem', t => {
    const caches = new CacheCollection();
    const userCache = caches.createCache('user', 'id', null);
    const newUser = { id: 1, name:'testUser' };
    const cachedUser = caches.cacheItem(newUser, 'user');
    t.ok(cachedUser, 'should return cached item');
    t.equal(cachedUser.id, newUser.id, 'pk should match item that was passed in');
    t.equal(cachedUser.name, newUser.name, 'name should match item that was passed in');
    t.ok(cachedUser.cacheID, 'cached item should have a cacheID');
    t.end();
});
