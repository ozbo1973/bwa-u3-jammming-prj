
const clientId= "41b941fa464d4511a70b34ea5541f69e";
const redirectURI = 'http://jammingBB.surge.sh/' //'http://localhost:3000/';
const appApiUrl = 'https://api.spotify.com';
const appUserAccntUrl = 'https://accounts.spotify.com'
let accessToken;

export const Spotify = {
  getAccessToken() {
    if(accessToken){
      return accessToken;
    }

    const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const tokenExpire = window.location.href.match(/expires_in=([^&]*)/);

    if (tokenMatch && tokenExpire){
      accessToken = tokenMatch[1];
      const expiresIn = Number(tokenExpire[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const spotifyAccessURL = `${appUserAccntUrl}/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = spotifyAccessURL;
    }
  }, //.getAccessToken

  search(term) {
    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`}
    return fetch(`${appApiUrl}/v1/search?type=track&q=${term}`, {
      headers: headers
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      console.log(jsonResponse.tracks);
      if (!jsonResponse.tracks) {
        return [];
      }
       return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }))
      });
  }, // .search

  savePlaylist(name,trackURIs) {
    if (!name || !trackURIs.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`};
    let userId;

    //retriveing user id from spotify
    return fetch(`${appApiUrl}/v1/me`,{headers: headers}
  ).then(response => response.json()
).then(jsonResponse => {
  userId = jsonResponse.id;
  return fetch(`${appApiUrl}/v1/users/${userId}/playlists`,
    {
    headers: headers,
    method: 'POST',
    body: JSON.stringify({name: name})
  }).then(response => response.json()
).then(jsonResponse => {
  const playlistId = jsonResponse.id;
  return fetch(`${appApiUrl}/v1/users/${userId}/playlists/${playlistId}/tracks`,
  {
    headers: headers,
    method: 'POST',
    body: JSON.stringify({uris:trackURIs}),
    success: console.log(`Playlist: ${name} was successfully saved to your account`)
  })
})//.jsonResponse
})//.jsonResponse

  } //.savePlaylist



}
