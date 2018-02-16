import * as cache from './cache';

async function getPosts() {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    return data;
}

async function getUsers() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json();
    return data;
}

export async function retrievePosts() {
    return getPosts().then(posts => {
        for (let post of posts) {
            cache.cacheItem(post, 'post');
            cache.relateIDs(`post::${post.id}`, `user::${post.userID}`);
        }
    });
}

export async function retrieveUsers() {
    return getUsers().then(users => {
        for (let user of users) {
            cache.cacheItem(user, 'user');
        }
    });
}
