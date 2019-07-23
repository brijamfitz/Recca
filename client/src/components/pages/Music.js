import React, { Component } from "react";
import { musicAPI, mediaAPI, userAPI, postAPI } from "../../api";
import SearchForm from "../SearchForm";
import Sidebar from "../Sidebar";
import Results from "../Results";
import Footer from "../Footer";
import "./mediaPages.scss";

class Music extends Component {
  state = {
    search: "",
    saved: [],
    results: [],
    postText: "",
    message: ""
  }

  handleInputChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  };

  handleSearch = event => {
    event.preventDefault();
    this.searchMusic(this.state.search)
  }

  truncateByChar = (string, maxLength) => {
    return string.length > maxLength ? string.substring(0, maxLength - 3) + "..." : string.substring(0, maxLength);
  }

  searchMusic = query => {
    const results = [];
    musicAPI.searchAlbum(query)
      .then(res => {
        // If no results, set state with message
        if (res.data.message) {
          this.setState({ results: [], message: res.data.message })
        } else {
          res.data.forEach(music => {
            results.push(
              {
                type: "music",
                title: music.albumName ? this.truncateByChar(music.albumName, 60) : "",
                image: music.image ? music.image : "/images/placehold-img-sq.jpg",
                link: music.albumLink.spotify ? music.albumLink.spotify : "",
                creator: music.artist ? music.artist.join(", ") : "",
                apiId: music.apiId
              }
            )
          });
          this.setState({ results: results, message: "" })
        }
      })
      .then(() => this.setState({ results }))
      .catch(err => console.log(err));
  };

  clearResults = () => {
    this.setState({results: []})
  }

  componentDidMount() {
    this.getMusic();
    window.scrollTo(0, 0)
  }

  handleSave = id => {
    const music = this.state.results.find(music => music.apiId === id);
    this.setState({ search: "", results : [] })
    mediaAPI.create({
      type: "music",
      title: music.title,
      image: music.image,
      link: music.link,
      creator: music.creator,
      apiId: music.apiId
    }).then((res) => {
      //Once the music is saved, reset state for results
      this.setState({ results : [], message : res.data.message })
      this.getMusic()
    })
  }

  getMusic = () => {
    userAPI.getUserMedia()
    .then((res) => {
      this.setState({ saved: res.data.media });
    })
    .catch(err => console.log(err));
  }

  handleRecommend = mediaObj => {
    mediaObj.postText = this.state.postText;
    postAPI.post(mediaObj);
    this.setState({postText: ""})
    // set recommended = true if the mediaObj came from the user's list
    // send recommendation to user's friends
  }

  handleDelete = id => {
    mediaAPI.delete(id)
    .then(this.getMusic)
    .catch(err => console.log(err))
  }

  toggleActive = id => {
    mediaAPI.toggleActive(id)
    .then(this.getMusic)
    .catch(err => console.log(err))
  }

  toggleComplete = id => {
    mediaAPI.toggleComplete(id)
    .then(this.getMusic)
    .catch(err => console.log(err))
  }


  typeCheckPluralizer(type, string) {
    var creatorTitle;
    
    if (type === "book") {
      creatorTitle = "Author"
    } else if (type === "music") {
      creatorTitle = "Artist"
    } else if (type === "movie") {
      creatorTitle = "Director"
    } else if (type === "show") {
      creatorTitle = "Writer"
    } else {
      return creatorTitle = "Creator"
    }

    if (string.includes(",")) {
      return `${creatorTitle}s`
    } else {
      return creatorTitle;
    }
  }
  platformText(string) {
    if (string.includes(",")) {
      return "Platforms: "
    } else {
      return "Platform: "
    }
  }
  genreText(string) {
    if (string.includes(",")) {
      return "Genres: "
    } else {
      return "Genre: "
    }
  }

  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-9 main">
              <SearchForm 
                search={this.state.search}
                handleInputChange={this.handleInputChange}
                handleSearch={this.handleSearch}
                mediaType="music"
              />
              {this.state.results.length ? 
                <div className="media-wrapper">
                  <h2 className="text-center sr-only">Results</h2>
                  <button onClick={this.clearResults} className="btn-clear">Clear <i className="icon icon-collapse"></i></button>
                  <div className="clearfix"></div>
                  <Results 
                    items={this.state.results}
                    clearResults={this.clearResults}
                    resultType="results"
                    mediaType="music"
                    handleSave={this.handleSave}
                    handleRecommend={this.handleRecommend}
                    handleInputChange={this.handleInputChange}
                    postText={this.state.postText}
                    typeCheckPluralizer={this.typeCheckPluralizer}
                    platformText={this.platformText}
                    genreText={this.genreText}
                  />
                </div> : ""}
              {this.state.message ? 
                <p className="no-results">{this.state.message}</p> : ""
              }
              <hr />
              {this.state.saved ? 
                <div className="media-wrapper">
                  <h2 className="text-center header-saved">Saved Music</h2>
                  <Results 
                    items={this.state.saved}
                    resultType="saved"
                    mediaType="music"
                    handleDelete={this.handleDelete}
                    toggleActive={this.toggleActive}
                    toggleComplete={this.toggleComplete}
                    handleInputChange={this.handleInputChange}
                    postText={this.state.postText}
                    handleRecommend={this.handleRecommend}
                    typeCheckPluralizer={this.typeCheckPluralizer}
                    platformText={this.platformText}
                    genreText={this.genreText}
                  />
                </div> : 
                <p className="text-center empty-media-msg">Use the search bar above to find and save music!</p> }
            </div>
            
            <Sidebar 
              items={this.state.saved}
              toggleActive={this.toggleActive}
              toggleComplete={this.toggleComplete}
              handleDelete={this.handleDelete}
              handleRecommend={this.handleRecommend}
              handleInputChange={this.handleInputChange}
              postText={this.state.postText}
              mediaType="music"
            />
          </div>
        </div>
        <Footer />
      </div>
    )
  }
};

export default Music;
