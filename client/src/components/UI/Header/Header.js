import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faExclamationCircle,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import "./Header.scss";

const Header = () => {
  return (
    <div className="header">
      <div className="logo">
        <div className="help W">
          <span className="help-text">W</span>
        </div>
        <div className="help O">
          <span className="help-text">O</span>
        </div>
        <div className="help I">
          <span className="help-text">I</span>
        </div>
        <div className="help C">
          <span className="help-text">C</span>
        </div>
        <div className="help E">
          <span className="help-text">E</span>
        </div>
      </div>
      <div className="action-btn">
        <FontAwesomeIcon className="icon-block" icon={faQuestionCircle} />
        <FontAwesomeIcon className="icon-block" icon={faExclamationCircle} />
        <FontAwesomeIcon className="icon-block" icon={faCog} />
      </div>
    </div>
  );
};
export default Header;
