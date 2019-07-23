import React, { Component } from "react";
import { userAPI, mediaAPI } from "../../api";
import FeedResults from "../FeedResults";
import Header from "../Header";
import Footer from "../Footer";
import FeedModal from "../FeedModal";
import LoadingIcon from "../LoadingIcon";
import { Redirect } from "react-router-dom";

class Home extends Component {
  state = {
    itemSaved: false,
    redirectTo: "",
    activity: [],
    modalVisible: false,
    loading: true,
    message:""
  };

  getFeed = () =>{
    let feedPosts = []
    userAPI.getFeedItems()
    .then(function(res) {
      feedPosts = res.data
    })
    .then(() => this.setState({message: feedPosts.message}))
    .then(() => this.setState({ activity: feedPosts, loading: false }))
    .catch(err => console.log(err));
  }

  handleRepeat = () => {
    this.setState({modalVisible: true})
  }

  handleClose = () => {
    this.setState({modalVisible: false})
  }

  handleSave = id => {
    const media = this.state.activity.find(media => media.apiId === id);
    mediaAPI.create({
      title: media.title,
      image: media.image,
      description: media.description,
      creator: media.creator,
      type: media.type,
      link: media.link,
      genre: media.genre,
      platform: media.platform,
      year: media.year,
      rating: media.rating,
      apiId: media.apiId
    })
    .then( (res)=>{
      if (res.data.message) {
        this.handleRepeat()
      } else {
        let newPage = media.type
        if (newPage !== "music"){
          newPage += "s"
        }
        this.setState({
          redirectTo: newPage,
          itemSaved: true
        })
      }
    })
  }

  componentDidMount(){
    this.getFeed();
    window.scrollTo(0, 0)
  }

  render() {
    if ( this.state.itemSaved === true){
      this.setState({
        itemSaved: false
      })
      return <Redirect to={"/" + this.state.redirectTo} />
    }
    return (
      <div>
        <Header title="User Feed"/>
        <FeedModal
        handleClose={this.handleClose}
        show={this.state.modalVisible}
        />
        <div className="container">
          <LoadingIcon loading={this.state.loading} />
          <div className="row feed">
            <FeedResults
              message={this.state.message} 
              items={this.state.activity}
              handleSave={this.handleSave}
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Home;
