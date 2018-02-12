import * as postdao from './postdao';
import * as cacheback from './cache';

cacheback.createCache('post', 'id', postdao.retrievePosts);
cacheback.createCache('user', 'id', postdao.retrieveUsers);

cacheback.invalidateAll().then(() => {
    showAll();
    showSample();
});

function showAll() {
    const posts = cacheback.getAll('post');
    const postHtml = posts.reduce((prevVal, post) => prevVal + `<li rel=${post.cacheId}>id: ${post.id}, cacheId: ${post.cacheId}, ${post.title}</li>`, '');
    document.getElementById('allPosts').innerHTML = postHtml;
    cacheback.createItem({ name: 'Nathan Johnson' }, 'user');
    const users = cacheback.getAll('user');
    const userHtml = users.reduce((prevVal, user) => prevVal + `<li rel=${user.cacheId}>id: ${user.id}, cacheId: ${user.cacheId}, ${user.name}</li>`, '');
    document.getElementById('allUsers').innerHTML = userHtml;
}

function showSample() {
    // const samplePost = getItem({ cacheId:'cache-1', cacheName: 'post' });
    const samplePost = cacheback.getItem({ id: 2, cacheName: 'post' });
    document.getElementById('samplePost').innerHTML = samplePost.title;
}
