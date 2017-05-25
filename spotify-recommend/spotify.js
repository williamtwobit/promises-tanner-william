var getFromApi = function(endpoint, query={}) {
    const url = new URL(`https://api.spotify.com/v1/${endpoint}`);
    Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
    return fetch(url).then(function(response) {
        if (!response.ok) {
            return Promise.reject(response.statusText);
        }
        return response.json();
    });
};


var artist;
var getArtist = function(name) {
    let query = {
      q: name,
      limit: 1,
      type: 'artist'
    };
    console.log('hello');
    getFromApi('search', query)
    .then(
      (item)=>{
        artist = item.artists.items[0];
        console.log(artist);
        Promise.resolve(artist);
      }).catch( err =>{
        console.error(err.message);
        }
      );
};