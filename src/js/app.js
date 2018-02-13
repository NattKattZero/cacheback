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
    const postHtml = posts.reduce((prevVal, post) => prevVal + `<li rel=${post.cacheID}>id: ${post.id}, cacheID: ${post.cacheID}, ${post.title}, userID: ${post.userId}</li>`, '');
    document.getElementById('allPosts').innerHTML = postHtml;
    // cacheback.createItem({ name: 'Nathan Johnson' }, 'user');
    const users = cacheback.getAll('user');
    const userHtml = users.reduce((prevVal, user) => prevVal + `<li rel=${user.cacheID}>id: ${user.id}, cacheID: ${user.cacheID}, ${user.name}</li>`, '');
    document.getElementById('allUsers').innerHTML = userHtml;
}

function showSample() {
    // const samplePost = getItem({ cacheId:'cache-1', cacheName: 'post' });
    const samplePost = cacheback.getItem({ id: 2, cacheName: 'post' });
    const samplePostUsers = cacheback.getRelatedItems({ id: 2, cacheName: 'post' }, 'user');
    let postHTML = `${samplePost.title}<br />by: `;
    for (let user of samplePostUsers) {
        postHTML += `${user.name} `;
    }
    document.getElementById('samplePost').innerHTML = postHTML;
}
