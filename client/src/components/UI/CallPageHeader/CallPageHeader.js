import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserFriends,
  faCommentAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./CallPageHeader.scss";

const CallPageHeader = () => {
  let interval = null;

  return (
    <div className="frame-header">
      <div className="header-items icon-block">
        <FontAwesomeIcon className="icon" icon={faUserFriends} />
      </div>
      <div className="header-items icon-block">
        <FontAwesomeIcon className="icon" icon={faCommentAlt} />
      </div>
      <div className="header-items date-block">2:00pm</div>
      <div className="header-items icon-block">
        <FontAwesomeIcon className="icon profile" icon={faUserCircle} />
      </div>
    </div>
  );
};

export default CallPageHeader;
