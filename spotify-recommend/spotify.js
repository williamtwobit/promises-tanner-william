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

var getRelatedArtist = function(artist, ID, endpoint) {
  const url = new URL(`https://api.spotify.com/v1/${artist}/${ID}/${endpoint}`);
  return fetch(url).then(function(response) {
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }
    return response.json();
  });
};



var artistID;
var artist;
var topTracks = [];
var getArtist = function(name) {
  let query = {
    q: name,
    limit: 1,
    type: 'artist'
  };
  console.log('hello');
  return getFromApi('search', query)
    .then( response =>{
      artist = response.artists.items[0];
      artistID = response.artists.items[0].id;
      console.log(artistID);
      return artistID;
    }).then((artistID)=>{
      return getRelatedArtist('artists', artistID, 'related-artists');})
        .then((value)=>{
          artist.related = value.artists;
          artist.related.forEach(obj=>{
            topTracks.push(getRelatedArtist('artists', obj.id, 'top-tracks?country=US'));
          });
          return topTracks;
        })
        .then(array => {
          return Promise.all(array);
        })
        .then(response => {
          let i = 0;
          response.forEach(obj=>{
            artist.related[i].tracks = obj.tracks;
            i++;
          });
          return artist;
        })
        .catch( err =>{
          console.error('OOOOPS');
          return;
        }
      );};
