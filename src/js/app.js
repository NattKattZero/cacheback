import { retrievePosts, retrieveUsers } from './postdao';
import { createCache, getItemForKey, getAll, invalidateCache, invalidateAll } from './cache';

createCache('post', 'id', retrievePosts);
createCache('user', 'id', retrieveUsers);

invalidateAll().then(() => {
    const posts = getAll('post');
    const postHtml = Object.values(posts).reduce((prevVal, post) => prevVal + `<li>${post.title}</li>`, '');
    document.getElementById('samplePost').innerHTML = postHtml;
    const users = getAll('user');
    const userHtml = Object.values(users).reduce((prevVal, user) => prevVal + `<li>${user.name}</li>`, '');
    document.getElementById('sampleUser').innerHTML = userHtml;
});
