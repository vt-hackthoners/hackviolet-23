import { useEffect, useReducer, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { getRequest, postRequest } from "./../../utils/apiRequests";
import {
  BASE_URL,
  GET_CALL_ID,
  SAVE_CALL_ID,
} from "./../../utils/apiEndpoints";
import io from "socket.io-client";
import Peer from "simple-peer";
import "./CallPage.scss";
import Messenger from "./../UI/Messenger/Messenger";
import MessageListReducer from "../../reducers/MessageListReducer";
import Alert from "../UI/Alert/Alert";
import MeetingInfo from "../UI/MeetingInfo/MeetingInfo";
import CallPageFooter from "../UI/CallPageFooter/CallPageFooter";
import CallPageHeader from "../UI/CallPageHeader/CallPageHeader";
import * as Tone from "tone";

let peer = null;
const socket = io.connect(process.env.REACT_APP_BASE_URL);
const initialState = [];

const CallPage = () => {
  const history = useHistory();
  let { id } = useParams();
  const isAdmin = window.location.hash == "#init" ? true : false;
  const url = `${window.location.origin}${window.location.pathname}`;
  let alertTimeout = null;

  const [messageList, messageListReducer] = useReducer(
    MessageListReducer,
    initialState
  );

  const [streamObj, setStreamObj] = useState();
  const [screenCastStream, setScreenCastStream] = useState();
  const [meetInfoPopup, setMeetInfoPopup] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);
  const [isMessenger, setIsMessenger] = useState(false);
  const [messageAlert, setMessageAlert] = useState({});
  const [isAudio, setIsAudio] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      setMeetInfoPopup(true);
    }
    initWebRTC();
    socket.on("code", (data) => {
      if (data.url === url) {
        peer.signal(data.code);
      }
    });
  }, []);

  const getRecieverCode = async () => {
    const response = await getRequest(`${BASE_URL}${GET_CALL_ID}/${id}`);
    if (response.code) {
      peer.signal(response.code);
    }
  };

  let initWebRTC = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setStreamObj(stream);
        console.log("Got MediaStream:", stream);
        console.log("stream audio", stream.getAudioTracks());

        const mic = new Tone.UserMedia();
        mic
          .open()
          .then(() => {
            // promise resolves when input is available
            console.log("mic open");
            // print the incoming mic levels in decibels
            // setInterval(() => console.log(meter.getValue()), 100);

            const pitchShift = new Tone.PitchShift();

            mic.connect(pitchShift);
            pitchShift.toDestination();
            pitchShift.pitch -= 4;

            let dest = pitchShift.context.createMediaStreamDestination();
            let micstream = dest.stream;

            let audioTrack = micstream.getAudioTracks()[0];
            console.log("audio array", micstream.getAudioTracks());
            console.log("audio track", audioTrack);
            // stream.addTrack(audioTrack);

            console.log("stream after adding", stream);
            console.log("new stream audio", stream.getAudioTracks());

            peer = new Peer({
              initiator: isAdmin,
              trickle: false,
              stream: stream,
            });

            if (!isAdmin) {
              getRecieverCode();
            }

            peer.on("signal", async (data) => {
              if (isAdmin) {
                let payload = {
                  id,
                  signalData: data,
                };
                await postRequest(`${BASE_URL}${SAVE_CALL_ID}`, payload);
              } else {
                socket.emit("code", { code: data, url }, (cbData) => {
                  console.log("code sent");
                });
              }
            });

            peer.on("connect", () => {
              // wait for 'connect' event before using the data channel
            });

            peer.on("data", (data) => {
              clearTimeout(alertTimeout);
              messageListReducer({
                type: "addMessage",
                payload: {
                  user: "other",
                  msg: data.toString(),
                  time: Date.now(),
                },
              });

              setMessageAlert({
                alert: true,
                isPopup: true,
                payload: {
                  user: "other",
                  msg: data.toString(),
                },
              });

              alertTimeout = setTimeout(() => {
                setMessageAlert({
                  ...messageAlert,
                  isPopup: false,
                  payload: {},
                });
              }, 10000);
            });

            peer.on("stream", (stream) => {
              // got remote video stream, now let's show it in a video tag
              console.log("peer side audio", stream.getAudioTracks());

              let video = document.querySelector("video");

              if ("srcObject" in video) {
                video.srcObject = stream;
              } else {
                video.src = window.URL.createObjectURL(stream); // for older browsers
              }
              // video.play();

              video.onloadedmetadata = (e) => {
                video.play();
                video.muted = true;
              };

              // const audioCtx = new AudioContext();
              // const source = audioCtx.createMediaStreamSource(stream);

              // Create a biquadfilter
              // const biquadFilter = audioCtx.createBiquadFilter();
              // biquadFilter.type = "lowshelf";
              // biquadFilter.frequency.value = 1000;
              // biquadFilter.gain.value = range.value;

              // connect the AudioBufferSourceNode to the gainNode
              // and the gainNode to the destination, so we can play the
              // music and adjust the volume using the mouse cursor
              // source.connect(biquadFilter);
              // const pitchShift = new Tone.PitchShift();

              // source.connect(pitchShift);
              // pitchShift.toDestination();
              // pitchShift.pitch -= 1;

              // let dest = pitchShift.context.createMediaStreamDestination();
              // let micstream = dest.stream;

              // let audioTrack = micstream.getAudioTracks()[0];

              // pitchShift.connect(audioCtx.destination);

              // Get new mouse pointer coordinates when mouse is moved
              // then set new gain value

              // range.oninput = () => {
              //   biquadFilter.gain.value = range.value;
              // };
            });
          })
          .catch((e) => {
            // promise is rejected when the user doesn't have or allow mic access
            console.log("mic not open");
          });
      })
      .catch(() => {});
  };

  const sendMsg = (msg) => {
    peer.send(msg);
    messageListReducer({
      type: "addMessage",
      payload: {
        user: "you",
        msg: msg,
        time: Date.now(),
      },
    });
  };

  const screenShare = () => {
    navigator.mediaDevices
      .getDisplayMedia({ cursor: true })
      .then((screenStream) => {
        peer.replaceTrack(
          streamObj.getVideoTracks()[0],
          screenStream.getVideoTracks()[0],
          streamObj
        );
        setScreenCastStream(screenStream);
        screenStream.getTracks()[0].onended = () => {
          peer.replaceTrack(
            screenStream.getVideoTracks()[0],
            streamObj.getVideoTracks()[0],
            streamObj
          );
        };
        setIsPresenting(true);
      });
  };

  const stopScreenShare = () => {
    screenCastStream.getVideoTracks().forEach(function (track) {
      track.stop();
    });
    peer.replaceTrack(
      screenCastStream.getVideoTracks()[0],
      streamObj.getVideoTracks()[0],
      streamObj
    );
    setIsPresenting(false);
  };

  const toggleAudio = (value) => {
    streamObj.getAudioTracks()[0].enabled = value;
    setIsAudio(value);
  };

  const disconnectCall = () => {
    peer.destroy();
    history.push("/");
    window.location.reload();
  };

  return (
    <div className="callpage-container">
      <video className="video-container" src="" controls></video>
      {/* <audio className="audio-container" src="" controls></audio> */}

      <CallPageHeader
        isMessenger={isMessenger}
        setIsMessenger={setIsMessenger}
        messageAlert={messageAlert}
        setMessageAlert={setMessageAlert}
      />
      <CallPageFooter
        isPresenting={isPresenting}
        stopScreenShare={stopScreenShare}
        screenShare={screenShare}
        isAudio={isAudio}
        toggleAudio={toggleAudio}
        disconnectCall={disconnectCall}
      />

      {isAdmin && meetInfoPopup && (
        <MeetingInfo setMeetInfoPopup={setMeetInfoPopup} url={url} />
      )}
      {isMessenger ? (
        <Messenger
          setIsMessenger={setIsMessenger}
          sendMsg={sendMsg}
          messageList={messageList}
        />
      ) : (
        messageAlert.isPopup && <Alert messageAlert={messageAlert} />
      )}
    </div>
  );
};
export default CallPage;
