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
    const nathan = cacheback.cacheItem({ name: 'Nathan Johnson' }, 'user');
    cacheback.relateIDs('post::2', `user:${nathan.cacheID}:`);
    const users = cacheback.getAll('user');
    const userHtml = users.reduce((prevVal, user) => prevVal + `<li rel=${user.cacheID}>id: ${user.id}, cacheID: ${user.cacheID}, ${user.name}</li>`, '');
    document.getElementById('allUsers').innerHTML = userHtml;
}

function showSample() {
    const samplePost = cacheback.getItem('post::2');
    const samplePostUsers = cacheback.getRelatedItems('post::2', 'user');
    let postHTML = `${samplePost.title}<br />by: `;
    for (let user of samplePostUsers) {
        postHTML += `${user.name} `;
    }
    document.getElementById('samplePost').innerHTML = postHTML;
}
