import { useEffect, useState } from "react";

import "./CallPage.scss";
import Messenger from "./../UI/Messenger/Messenger";
import MeetingInfo from "../UI/MeetingInfo/MeetingInfo";
import CallPageFooter from "../UI/CallPageFooter/CallPageFooter";
import CallPageHeader from "../UI/CallPageHeader/CallPageHeader";

const CallPage = () => {
  const isAdmin = window.location.hash == "#init" ? true : false;
  const url = `${window.location.origin}${window.location.pathname}`;

  const [meetInfoPopup, setMeetInfoPopup] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      setMeetInfoPopup(true);
    }
  }, []);

  return (
    <div className="callpage-container">
      <video className="video-container" src="" controls></video>

      <CallPageHeader />
      <CallPageFooter />

      {isAdmin && meetInfoPopup && (
        <MeetingInfo setMeetInfoPopup={setMeetInfoPopup} url={url} />
      )}
      <Messenger />
    </div>
  );
};
export default CallPage;
