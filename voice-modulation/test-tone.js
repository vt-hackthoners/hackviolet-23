const meter = new Tone.Meter();
const mic = new Tone.UserMedia().connect(meter);
mic
  .open()
  .then(() => {
    // promise resolves when input is available
    console.log("mic open");
    // print the incoming mic levels in decibels
    // setInterval(() => console.log(meter.getValue()), 100);

    const $startStopButton = document.getElementById("start-stop");
    const $upButton = document.getElementById("up");
    const $downButton = document.getElementById("down");

    const oscillator = new Tone.Oscillator();
    const pitchShift = new Tone.PitchShift();

    mic.connect(pitchShift);
    pitchShift.toMaster();

    $startStopButton.onclick = () => {
      if ($startStopButton.textContent === "start") {
        $startStopButton.textContent = "stop";
        oscillator.start();
      } else {
        $startStopButton.textContent = "start";
        oscillator.stop();
      }
    };

    $upButton.onclick = () => (pitchShift.pitch += 1);
    $downButton.onclick = () => (pitchShift.pitch -= 1);

    let stream = pitchShift.context.createMediaStreamDestination();

    console.log(stream);
  })
  .catch((e) => {
    // promise is rejected when the user doesn't have or allow mic access
    console.log("mic not open");
  });
