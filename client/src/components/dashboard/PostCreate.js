import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createPost } from "../../actions/postActions";
import { Modal, Button } from "react-materialize";
import HobbyTree from "../set/HobbyTree";
import Location from "../set/Location";

class PostCreate extends Component {
  constructor() {
    super();
    this.state = {
      content: "",
      category: "",
      location: {
        country: "US",
        state: "Florida",
        county: "Alachua"
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tree) {
      if (nextProps.tree.category) {
        this.setState({
          category: nextProps.tree.category
        });
      }
    }
  }
  onSubmit = e => {
    e.preventDefault();

    const newPost = {
      content: this.state.content,
      category: this.state.category,
      location: this.state.location,
      _userid: this.props.auth.user.id
    };
    console.log(newPost);
    this.props.createPost(newPost, this.props.history);
  };

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    return (
      <Modal trigger={<Button waves="light">Create a Post.</Button>}>
        <form noValidate onSubmit={this.onSubmit}>
          <div className="input-field col s12">
            <input
              onChange={this.onChange}
              value={this.state.content}
              id="content"
              type="text"
            />
            <label htmlFor="Thoughts">Thoughts</label>
          </div>
          <br />
          <div className="row">
            <div className="col s6">
              Location
              <Location />{" "}
            </div>
            <div className="col s6">
              Categories
              <HobbyTree />
              {this.state.category}
            </div>
          </div>

          <div
            className="col s12  center-align"
            style={{ paddingLeft: "11.250px" }}
          >
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              type="submit"
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Post
            </button>
          </div>
        </form>
      </Modal>
    );
  }
}

PostCreate.propTypes = {
  createPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post,
  auth: state.auth,
  errors: state.errors,
  tree: state.tree
});

export default connect(
  mapStateToProps,
  { createPost }
)(PostCreate);
