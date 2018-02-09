import { retrievePosts, retrieveUsers } from './postdao';
import { createCache, getItemForKey, getAll, invalidateCache, invalidateAll } from './cache';

createCache('post', 'id', retrievePosts);
createCache('user', 'id', retrieveUsers);
// invalidateCache('post').then(posts => {
//     const post = getItemForKey(1, 'post');
//     document.getElementById('samplePost').innerHTML = post.title;
//     samplePostElement.innerHTML = post.title;
// });
// invalidateCache('user').then(users => {
//     const user = getItemForKey(1, 'user');
//     document.getElementById('sampleUser').innerHTML = user.name;
// });

invalidateAll().then(() => {
    const posts = getAll('post');
    console.log(posts);
    const stuff = [1, 2, 3, 4];
    Object.values(posts).map(post => console.log('woot' + post));
    // const postHtml = posts.reduce((prevVal, post) => prevVal + post, '');
    // document.getElementById('samplePost').innerHTML = postHtml;
    // const user = getItemForKey(1, 'user');
    // document.getElementById('sampleUser').innerHTML = user.name;
});
