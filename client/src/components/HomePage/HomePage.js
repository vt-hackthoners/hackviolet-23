import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faKeyboard } from "@fortawesome/free-solid-svg-icons";
import shortid from "shortid";
import "./HomePage.scss";
import Header from "../UI/Header/Header";
import banner from "../../../src/Group-video-amico.png";

const HomePage = () => {
  const history = useHistory();

  const startCall = () => {
    const uid = shortid.generate();
    history.push(`/${uid}#init`);
  };

  return (
    <div className="home-page">
      <Header />
      <div className="body">
        <div className="left-side">
          <div className="content">
            <h2>Where Skills Trump Bias</h2>
            <p>We re-engineered the service to make it more Just.</p>
            <div className="action-btn">
              <button className="btn green" onClick={startCall}>
                <FontAwesomeIcon className="icon-block" icon={faVideo} />
                New Meeting
              </button>
              <div className="input-block">
                <div className="input-section">
                  <FontAwesomeIcon className="icon-block" icon={faKeyboard} />
                  <input placeholder="Enter a code or link" />
                </div>
                <button className="btn no-bg">Join</button>
              </div>
            </div>
          </div>
          <div className="help-text">
            <a href="">Learn more</a> about Woice, a bias free interviewing
            platform.
          </div>
        </div>
        <div className="right-side">
          <div className="content">
            <img src={banner} alt="banner image" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
