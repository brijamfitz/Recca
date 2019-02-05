import React, { Component } from "react";
import bookAPI from "../../utils/bookAPI";
import mediaAPI from "../../utils/mediaAPI";
import userAPI from "../../utils/userAPI";
import postAPI from "../../utils/postAPI";
import SearchForm from "../SearchForm";
import Sidebar from "../Sidebar";
import Results from "../Results";
import Footer from "../Footer";
import "./mediaPages.scss";

class Books extends Component {
  state = {
    search: "",
    saved: [],
    results: [],
    postText: "",
    message: "",
    length:""
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
    this.searchBooks(this.state.search)
  }

  truncateByChar = (string, maxLength) => {
    return string.length > maxLength ? string.substring(0, maxLength - 3) + "..." : string.substring(0, maxLength);
  }

  searchBooks = query => {
    const results = [];
    bookAPI.search(query)
      .then(res => {
        // If no results, set state with message
        if (res.data.totalItems === 0) {
          this.setState({ results: [], message: "No results found" })
        } else {
          res.data.items.forEach(book => {
            results.push(
              {
                type: "book",
                title: book.volumeInfo.title ? this.truncateByChar(book.volumeInfo.title, 60) : "",
                image: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "/images/placehold-img.jpg",
                description: book.volumeInfo.description ? book.volumeInfo.description : "",
                link: book.volumeInfo.infoLink ? book.volumeInfo.infoLink : "",
                creator: book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "",
                genre: book.volumeInfo.categories ? book.volumeInfo.categories.join(", ") : "",
                apiId: book.id
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
    this.getBooks();
    window.scrollTo(0, 0)
  }

  handleSave = id => {
    const book = this.state.results.find(book => book.apiId === id);
    this.setState({ search: "", results : [] })
    mediaAPI.create({
      type: "book",
      title: book.title,
      image: book.image,
      description: book.description,
      link: book.link,
      creator: book.creator,
      genre: book.genre,
      apiId: book.apiId
    }).then((res) => {
      //Once the book is saved, reset state for results
      this.setState({ results : [], message : res.data.message })
      this.getBooks()
    })
  }

  getBooks = () => {
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
    console.log(id);
    mediaAPI.delete(id)
    .then(this.getBooks)
    .catch(err => console.log(err))
  }

  toggleActive = id => {
    mediaAPI.toggleActive(id)
    .then(this.getBooks)
    .catch(err => console.log(err))
  }

  toggleComplete = id => {
    mediaAPI.toggleComplete(id)
    .then(this.getBooks)
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
                mediaType="book"
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
                    mediaType="book"
                    handleSave={this.handleSave}
                    handleRecommend={this.handleRecommend}
                    handleInputChange={this.handleInputChange}
                    postText={this.state.postText}
                    length={this.state.length}
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
                  <h2 className="text-center header-saved">Saved Books</h2>
                  <Results 
                    items={this.state.saved}
                    resultType="saved"
                    mediaType="book"
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
                <p className="text-center empty-media-msg">Use the search bar above to find and save books!</p> }
            </div>
            
            <Sidebar 
              items={this.state.saved}
              toggleActive={this.toggleActive}
              toggleComplete={this.toggleComplete}
              handleDelete={this.handleDelete}
              handleRecommend={this.handleRecommend}
              handleInputChange={this.handleInputChange}
              postText={this.state.postText}
              mediaType="book"
            />
          </div>
        </div>
        <Footer />
      </div>
    )
  }
};

export default Books;
