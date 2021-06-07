import React from "react";
import axios from "axios";
import GuestStore from "../Stores";
import "./GBList.css";
import uploadFileToBlob from "../azure/BlobStorage";
//const storageConfigured = isStorageConfigured();

class GBList extends React.Component {
  constructor(props) {
    super(props);
    this.store = GuestStore;
    this.state = {
      messages: [],
      blobList: [],
      message: "",
      name: "",
      selectedFile: null,
      inputKey: Math.random().toString(36),
    };
  }

  setInputKey(inputKey) {
    this.setState({ inputKey });
  }

  setBlobList(blobList) {
    this.setState({ blobList });
  }

  onClick = (e) => {
    //  let { name, message } = this.state;

    // console.log("storageConfigured:" + storageConfigured);
    // const blobId = this.onFileUpload();
    // console.log("blobId:" + blobId);
    let config = { headers: { "Access-Control-Allow-Origin": "*" } };
    axios
      .post(
        "https://questbookfunction.azurewebsites.net/api/guestbookf1003?code=kyWhPacBguKahhfrly0B8SSvXOmkfKtTI0hxQh4Xbxj8Z4B2BcTHsA==",
        {
          context: this.state.selectedFile,
        },
        config
      )
      .then((response) => {
        console.log(response, "merge!");
      })
      .catch((err) => {
        console.log(err, "nu merge");
      });

    return;
    // if (
    //   this.state.name.lenght > 0 &&
    //   this.state.message.lenght > 0 &&
    //   this.state.selectedFile != null
    // ) {
    //   axios
    //     .post("/api/review", {
    //       name: name,
    //       message: message,
    //     })
    //     .then((response) => {
    //       console.log(response, "Review added!");
    //     })
    //     .catch((err) => {
    //       console.log(err, "Review not added");
    //     });
    //   this.setState({ message: "", name: "" });
    // }
  };

  handleInputChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState((prevState, props) => {
      return { [name]: value };
    });
  };

  componentDidMount() {
    fetch("/api/reviews").then((results) => {
      results
        .json()
        .then((data) => {
          const messages = data.map((msg) => {
            return {
              name: msg.name,
              text: msg.message,
            };
          });
          this.setState({ messages: messages });
        })
        .catch((err) => console.warn(err.toString()));
    });
  }

  onFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  onFileUpload = () => {
    const blobsInContainer = uploadFileToBlob(this.state.selectedFile);
    console.log("blobsInContainer:", blobsInContainer);
    this.setBlobList(blobsInContainer);
    this.setState({ selectedFile: null });
    this.setInputKey(Math.random().toString(36));
    return this.state.inputKey;
    // const formData = new FormData();
    // formData.append(
    //   "myFile",
    //   this.state.selectedFile,
    //   this.state.selectedFile.name
    // );
    // console.log(this.state.selectedFile);
    // axios
    //   .post("api/upload", formData)
    //   .then((x) => console.log("X:" + x))
    //   .catch((e) => console.log("e:" + e));
  };

  fileData = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <h4>File Details:</h4>
          <p>File Name: {this.state.selectedFile.name}</p>
          <p>File Type: {this.state.selectedFile.type}</p>
          <p>
            Last Modified:{" "}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h5>Choose before Pressing the Upload button</h5>
        </div>
      );
    }
  };

  renderReviews() {
    const reviews = this.state.messages.map((message, index) => {
      return (
        <div key={`${message.name}-${index}`} className="list-group-item">
          <p className="h4 list-group-item-heading">{message.name}</p>
          <p className="list-group-item-text">{message.text}</p>
        </div>
      );
    });
    return reviews;
  }

  render() {
    return (
      <div>
        <form
          method="post"
          action="https://questbookfunction.azurewebsites.net/api/guestbookf1003?code=kyWhPacBguKahhfrly0B8SSvXOmkfKtTI0hxQh4Xbxj8Z4B2BcTHsA=="
          encType="multipart/form-data"
        >
          <label for="myfile">Delect a file:</label>
          <input type="file" id="myfile" name="filename" />
          <input type="submit" />
        </form>

        <div className="panel panel-default">
          <div className="panel-body">
            <div className="container form-group">
              <div className="row">
                <div className="col-4">
                  <label htmlFor="inputName">Name</label>
                  <form autoComplete="new-password">
                    <input
                      type="text"
                      autoComplete="off"
                      className="form-control"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleInputChange}
                      id="nameInput"
                      placeholder="Name (required)"
                    />
                  </form>
                </div>
                <div
                  className="col-11"
                  style={{ paddingTop: "10px", paddingBottom: "10px" }}
                >
                  <label htmlFor="inputMessage">Say something!</label>
                  <input
                    type="text"
                    autoComplete="off"
                    className="form-control"
                    name="message"
                    value={this.state.message}
                    onChange={this.handleInputChange}
                    id="messageInput"
                    placeholder="Message (optional)"
                  />
                </div>
                <div>
                  <input type="file" onChange={this.onFileChange} />
                </div>
                {this.fileData()}
              </div>
              <button className="btn btn-primary" onClick={this.onClick}>
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="list-group">{this.renderReviews()}</div>
      </div>
    );
  }
}

GBList.displayName = "GBList";
export default GBList;
