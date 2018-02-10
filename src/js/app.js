import { retrievePosts, retrieveUsers } from './postdao';
import { createCache, createItem, getItemForKey, getAll, invalidateCache, invalidateAll } from './cache';

createCache('post', 'id', retrievePosts);
createCache('user', 'id', retrieveUsers);

invalidateAll().then(() => {
    const posts = getAll('post');
    const postHtml = posts.reduce((prevVal, post) => prevVal + `<li>${post.title}</li>`, '');
    // document.getElementById('samplePost').innerHTML = postHtml;
    createItem({ name: 'Nathan Johnson' }, 'user');
    const users = getAll('user');
    const userHtml = users.reduce((prevVal, user) => prevVal + `<li>${user.name}</li>`, '');
    document.getElementById('sampleUser').innerHTML = userHtml;
});
