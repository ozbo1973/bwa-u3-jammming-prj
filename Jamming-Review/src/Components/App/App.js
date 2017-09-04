import React from 'react';
//import logo from './logo.svg';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';
import {Spotify} from '../../Util/Spotify';

class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        searchResults: [],
        playlistName: "New Play List",
        playlistTracks: []
      };

      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.updatePlaylistName = this.updatePlaylistName.bind(this);
      this.savePlaylist = this.savePlaylist.bind(this);
      this.search = this.search.bind(this);
  }

  addTrack(track) {
    let tracks= this.state.playlistTracks;
    if (!tracks.includes(track)){tracks.push(track)}
    this.setState({playlistTracks: tracks});
  }

  removeTrack(track) {
    //let tracks = this.state.playlistTracks.filter(selectedTrack => selectedTrack.id !== track.id);
    this.setState({playlistTracks: this.state.playlistTracks.filter(selectedTrack => selectedTrack.id !== track.id)});
  }

  updatePlaylistName (name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName,trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    });
  }

  search(term) {
    Spotify.search(term).then(resultOfSearch => {
      this.setState({searchResults: resultOfSearch})
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
            <SearchBar onSearch={this.search} />

            <div className="App-playlist">
              <SearchResults searchResults={this.state.searchResults}
                onAdd={this.addTrack} />

              <Playlist playlistTracks={this.state.playlistTracks}
                onRemove={this.removeTrack}
                onNameChange={this.updatePlaylistName}
                onSave={this.savePlaylist} />

            </div>
          </div>
        </div>
    );
  }
}

export default App;
