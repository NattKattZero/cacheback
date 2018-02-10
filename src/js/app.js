import { retrievePosts, retrieveUsers } from './postdao';
import { createCache, createItem, getItem, getAll, invalidateCache, invalidateAll } from './cache';

createCache('post', 'id', retrievePosts);
createCache('user', 'id', retrieveUsers);

invalidateAll().then(() => {
    showAll();
    showSample();
});

function showAll() {
    const posts = getAll('post');
    const postHtml = posts.reduce((prevVal, post) => prevVal + `<li rel=${post.cacheId}>id: ${post.id}, cacheId: ${post.cacheId}, ${post.title}</li>`, '');
    document.getElementById('allPosts').innerHTML = postHtml;
    createItem({ name: 'Nathan Johnson' }, 'user');
    const users = getAll('user');
    const userHtml = users.reduce((prevVal, user) => prevVal + `<li rel=${user.cacheId}>id: ${user.id}, cacheId: ${user.cacheId}, ${user.name}</li>`, '');
    document.getElementById('allUsers').innerHTML = userHtml;
}

function showSample() {
    // const samplePost = getItem({ cacheId:'cache-1', cacheName: 'post' });
    const samplePost = getItem({ id: 2, cacheName: 'post' });
    document.getElementById('samplePost').innerHTML = samplePost.title;
}
