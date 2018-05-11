const fetch = require('node-fetch');

const requestAnimePromise = () => {
    fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=Main%20Page&prop=revisions&rvprop=content&format=json&formatversion=2`)
    .then( res => res.json())
    .then( res => console.log(res));
}

const requestAnimeAwait = async () => {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=Main%20Page&prop=revisions&rvprop=content&format=json&formatversion=2`);
    const json = await res.json();
    console.log('asyn/await based');
    console.log(json);
}

requestAnimePromise();
requestAnimeAwait();