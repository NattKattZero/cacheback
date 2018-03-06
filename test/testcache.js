import { test } from 'tape';
import { StubDAO } from './mockdao';
import { CacheCollection, Cache, DAO } from '../src/js/cache';

/*
 * Cache tests
 */

test('Cache.invalidate', t => {
    const userCache = new Cache('user', 'id', new StubDAO(t));
    t.plan(1);
    userCache.invalidate();
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

test('CacheCollection.createCache without cacheName', t => {
    const caches = new CacheCollection();
    const badCache = caches.createCache(null, 'id', null);
    t.notOk(badCache, 'should not return a valid cache since name was not provided');
    t.end();
});

test('CacheCollection.createCache without pk', t => {
    const caches = new CacheCollection();
    const badCache = caches.createCache('user', null, null);
    t.notOk(badCache, 'should not return a valid cache since pk was not provided');
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

test('CacheCollection.getCache for cache name that does not exist', t => {
    const caches = new CacheCollection();
    const retrievedCache = caches.getCache('user');
    t.notOk(retrievedCache, 'should not return a cache with this cache name');
    t.end();
});

test('CacheCollection.cacheItem', t => {
    const caches = new CacheCollection();
    const userCache = caches.createCache('user', 'id', null);
    const userItem = { id: 1, name: 'testUser' };
    const cachedItem = caches.cacheItem(userItem, 'user');
    t.ok(cachedItem, 'should return a cached item');
    t.ok(cachedItem.cacheID, 'newly cached item should have a cacheID');
    t.equal(cachedItem.id, userItem.id, 'cached pk should equal item pk');
    t.equal(cachedItem.name, userItem.name, 'cached name should equal item name');
    t.end();
});

test('CacheCollection.cacheItem for cache that does not exist', t => {
    const caches = new CacheCollection();
    const userItem = { id: 1, name: 'testUser' };
    const cachedItem = caches.cacheItem(userItem, 'user');
    t.notOk(cachedItem, 'should not return a cached item');
    t.end();
});

test('CacheCollection.cacheItem without pk', t => {
    const caches = new CacheCollection();
    const userCache = caches.createCache('user', 'id', null);
    const userItem = { name: 'testUser' };
    const cachedItem = caches.cacheItem(userItem, 'user');
    t.ok(cachedItem, 'should return a cached item');
    t.ok(cachedItem.cacheID, 'newly cached item should have a cacheID');
    t.notOk(cachedItem.id, 'cached item should not have a pk');
    t.equal(cachedItem.name, userItem.name, 'cached name should equal item name');
    t.end();
});

test('CacheCollection.createItem', t => {
    const caches = new CacheCollection();
    const userCache = caches.createCache('user', 'id', null);
    const userItem = { name: 'testUser' };
    const cachedItem = caches.createItem(userItem, 'user');
    t.ok(cachedItem, 'should return a cached item');
    t.ok(cachedItem.cacheID, 'newly cached item should have a cacheID');
    t.notOk(cachedItem.id, 'cached pk should not yet exist');
    t.equal(cachedItem.name, userItem.name, 'cached name should equal item name');
    t.end();
});

test('CacheCollection.getItem', t => {
    const caches = new CacheCollection();
    const userCache = caches.createCache('user', 'id', null);
    const userItem = { id: 1, name: 'testUser' };
    const cachedItem = caches.cacheItem(userItem, 'user');
    t.ok(cachedItem, 'should return the item that was cached');
    t.ok(cachedItem.cacheID, 'cached item should have a cache ID');
    const retrievedItem = caches.getItem(cachedItem.cacheID);
    t.ok(retrievedItem, 'should return a cached item for the given cacheID');
    t.equal(retrievedItem.cacheID, cachedItem.cacheID, 'retrieved item\'s cacheID should match the cached item\'s cacheID');
    t.equal(retrievedItem.id, userItem.id, 'retrieved pk should equal item pk');
    t.equal(retrievedItem.name, userItem.name, 'retrieved name should equal item name');
    t.end();
});

test('CacheCollection.getItem with bad cacheID where cache exists', t => {
    const caches = new CacheCollection();
    const userCache = caches.createCache('user', 'id', null);
    const userItem = { id: 1, name: 'testUser' };
    const cachedItem = caches.cacheItem(userItem, 'user');
    t.ok(cachedItem, 'should return the item that was cached');
    t.ok(cachedItem.cacheID, 'cached item should have a cache ID');
    const retrievedItem = caches.getItem('user-999');
    t.notOk(retrievedItem, 'should not return a cached item for the given cacheID');
    t.end();
});

test('CacheCollection.getItem with bad cacheID where cache does not exist', t => {
    const caches = new CacheCollection();
    const userCache = caches.createCache('user', 'id', null);
    const userItem = { id: 1, name: 'testUser' };
    const cachedItem = caches.cacheItem(userItem, 'user');
    t.ok(cachedItem, 'should return the item that was cached');
    t.ok(cachedItem.cacheID, 'cached item should have a cache ID');
    const retrievedItem = caches.getItem('badcache-1');
    t.notOk(retrievedItem, 'should not return a cached item for the given cacheID');
    t.end();
});

test('CacheCollection.getItem with malformed cacheID', t => {
    const caches = new CacheCollection();
    const userCache = caches.createCache('user', 'id', null);
    const userItem = { id: 1, name: 'testUser' };
    const cachedItem = caches.cacheItem(userItem, 'user');
    t.ok(cachedItem, 'should return the item that was cached');
    t.ok(cachedItem.cacheID, 'cached item should have a cache ID');
    const missingCacheNameItem = caches.getItem('-1');
    t.notOk(missingCacheNameItem, 'should not return a cached item if cacheID is missing name');
    const missingIDItem = caches.getItem('user-');
    t.notOk(missingIDItem, 'should not return a cached item if cacheID is ID portion');
    const missingCacheNameAndIDItem = caches.getItem('-');
    t.notOk(missingCacheNameAndIDItem, 'should not return a cached item if cacheID is name and ID portion');
    const missingDashItem = caches.getItem('user1');
    t.notOk(missingDashItem, 'should not return a cached item if cacheID is missing dash');
    const nullCacheID = caches.getItem(null);
    t.notOk(nullCacheID, 'should not return a cached item if cacheID is null');
    t.end();
});

test('CacheCollection.getItemByPK', t => {
    const caches = new CacheCollection();
    const userCache = caches.createCache('user', 'id', null);
    const userItem = { id: 1, name: 'testUser' };
    caches.cacheItem(userItem, 'user');
    const retrievedItem = caches.getItemByPK(1, 'user');
    t.ok(retrievedItem, 'should return a cached item');
    t.equal(retrievedItem.id, userItem.id, 'retrieved pk should equal item pk');
    t.equal(retrievedItem.name, userItem.name, 'retrieved name should equal item name');
    t.end();
});

test('CacheCollection.updateItem', t => {
    const caches = new CacheCollection();
    const userCache = caches.createCache('user', 'id', null);
    const userItem = { id: 1, name: 'testUser' };
    const cachedItem = caches.cacheItem(userItem, 'user');
    t.ok(cachedItem, 'should return the item that was cached');
    const newUserNameItem = { id: cachedItem.id, cacheID: cachedItem.cacheID, name: 'updatedTestUser' };
    const updatedUserItem = caches.updateItem(newUserNameItem, 'user');
    t.ok(updatedUserItem, 'should return an updated item');
    t.equal(newUserNameItem.id, updatedUserItem.id, 'new and updated item\'s pks should match');
    t.equal(newUserNameItem.cacheID, updatedUserItem.cacheID, 'new and updated item\'s cacheID should match');
    t.equal(newUserNameItem.name, updatedUserItem.name, 'new and updated item\'s name should match');
    t.end();
});

test('CacheCollection.deleteItem', t => {
    const caches = new CacheCollection();
    const userCache = caches.createCache('user', 'id', null);
    const userItem = { id: 1, name: 'testUser' };
    const cachedItem = caches.cacheItem(userItem, 'user');
    t.ok(cachedItem, 'should return the item that was cached');
    const removedItem = caches.deleteItem(cachedItem, 'user');
    t.ok(removedItem, 'removed item should be returned');
    t.deepEqual(removedItem, cachedItem, 'returned removed item should match original cached item');
    const retrievedItem = caches.getItem(cachedItem.cacheID);
    t.notOk(retrievedItem, 'should not be able to retrieve item from cache now that it has been removed');
    t.end();
});

test('CacheCollection.relateItems', t => {
    const caches = new CacheCollection();
    const userCache = caches.createCache('user', 'id', null);
    const emailCache = caches.createCache('email', 'id', null);
    caches.cacheItem({ id: 1, name: 'userA' }, 'user');
    const email1 = { id: 1, address: 'userA@example.com' };
    caches.cacheItem(email1, 'email');
    const email2 = { id: 2, address: 'userA.2@example.com' };
    caches.cacheItem(email2, 'email');
    caches.relateItems({ pk1: 1, cacheName1: 'user', pk2: 1, cacheName2: 'email' });
    caches.relateItems({ pk1: 1, cacheName1: 'user', pk2: 2, cacheName2: 'email' });
    const relatedEmails = caches.getRelatedItems({ pk: 1, cacheName: 'user', relatedCacheName: 'email' });
    t.equal(relatedEmails.length, 2, 'should get 2 related email addresses');
    const [ relatedEmail1, relatedEmail2 ] = relatedEmails;
    t.equal(relatedEmail1.id, email1.id, 'first related email id should match first email id');
    t.equal(relatedEmail1.address, email1.address, 'first related email address should match first email address');
    t.equal(relatedEmail2.id, email2.id, 'second related email id should match second email id');
    t.equal(relatedEmail2.address, email2.address, 'second related email address should match second email address');
    t.end();
});

test('CacheCollection.relateItems before related item is cached', t => {
    const caches = new CacheCollection();
    const userCache = caches.createCache('user', 'id', null);
    const emailCache = caches.createCache('email', 'id', null);
    caches.cacheItem({ id: 1, name: 'userA' }, 'user');
    caches.relateItems({ pk1: 1, cacheName1: 'user', pk2: 1, cacheName2: 'email' });
    caches.relateItems({ pk1: 1, cacheName1: 'user', pk2: 2, cacheName2: 'email' });
    const email1 = { id: 1, address: 'userA@example.com' };
    caches.cacheItem(email1, 'email');
    const email2 = { id: 2, address: 'userA.2@example.com' };
    caches.cacheItem(email2, 'email');
    const relatedEmails = caches.getRelatedItems({ pk: 1, cacheName: 'user', relatedCacheName: 'email' });
    t.equal(relatedEmails.length, 2, 'should get 2 related email addresses');
    const [ relatedEmail1, relatedEmail2 ] = relatedEmails;
    t.equal(relatedEmail1.id, email1.id, 'first related email id should match first email id');
    t.equal(relatedEmail1.address, email1.address, 'first related email address should match first email address');
    t.equal(relatedEmail2.id, email2.id, 'second related email id should match second email id');
    t.equal(relatedEmail2.address, email2.address, 'second related email address should match second email address');
    t.end();
});

test('CacheCollection.commit', t => {
    const caches = new CacheCollection();
    const userCache = caches.createCache('user', 'id', new StubDAO(t));
    const emailCache = caches.createCache('email', 'id', new StubDAO(t));
    caches.createItem({ id: 1, name: 'userA' }, 'user');
    caches.createItem({ id: 2, name: 'userB' }, 'user');
    caches.createItem({ id: 1, name: 'userA@example.com' }, 'email');
    t.plan(3);
    caches.commit();
    t.end();
});
