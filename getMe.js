const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node');
const token = "BQDCLNJL1FnerE2WsVl9tGU7hltMDq9Gb9xRYwIrIrJU8M_iRO_CReghx6-QAs87K_FNSXtOuX4VDMJag3MT8OVxBEVKxfHAJZ2wAeI4UH3s0HdrRCQ-3palLJWIWVJ56Jq0d8YwYc50jf2LV1M3JfCmliXfLxifyZq2LR1US6wIgduFCvLYt0gs3DuhDgLS-PPBUvF5i-4Um9cKku8sBk1JUxob1VbJcUdBgJDc5kvs70oM2cRbW7AHcHXKf33_8BVs0vEbik00z557B9kRdIDV7jfahy3W7g";

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);

//GET MY PROFILE DATA
function getMyData() {
  (async () => {
    const me = await spotifyApi.getMe();
    // console.log(me.body);
    getUserPlaylists(me.body.id);
  })().catch(e => {
    console.error(e);
  });
}

//GET MY PLAYLISTS
async function getUserPlaylists(userName) {
  const data = await spotifyApi.getUserPlaylists(userName)

  console.log("---------------+++++++++++++++++++++++++")
  let playlists = []

  for (let playlist of data.body.items) {
    console.log(playlist.name + " " + playlist.id)
    
    let tracks = await getPlaylistTracks(playlist.id, playlist.name);
    // console.log(tracks);

    const tracksJSON = { tracks }
    let data = JSON.stringify(tracksJSON);
    fs.writeFileSync(playlist.name+'.json', data);
  }
}

//GET SONGS FROM PLAYLIST
async function getPlaylistTracks(playlistId, playlistName) {

  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 1,
    limit: 100,
    fields: 'items'
  })

  console.log('The playlist contains these tracks', data.body);
  // console.log('The playlist contains these tracks: ', data.body.items[0].track);
  console.log("'" + playlistName + "'" + ' contains these tracks:');
  let tracks = [];

  for (let track_obj of data.body.items) {
    const track = track_obj.track
    tracks.push(track);
    console.log(track.name + " : " + track.artists[0].name)
  }
  
  console.log("---------------+++++++++++++++++++++++++")
  return tracks;
}

getMyData();
