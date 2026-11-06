const SOUND_DIR = "assets/music/";
const VOLUME = 0.2;

export function createSounds() {
  const music = new Audio(SOUND_DIR + "background_music/Funny Game Loop.mp3");
  music.loop = true;

  const crash = new Audio(SOUND_DIR + "crash/Cartoon Crash Boing.mp3");
  const failJingle = new Audio(SOUND_DIR + "endcard_fail/Fail.mp3");
  const cheer = new Audio(SOUND_DIR + "endcard_win/Celebrative Happy Woohoo Cheer 2.mp3");
  const applause = new Audio(SOUND_DIR + "endcard_win/applause.mp3");

  const allSounds = [music, crash, failJingle, cheer, applause];
  allSounds.forEach((sound) => {
    sound.volume = VOLUME;
  });
  function playFromStart(sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {}); // a blocked play() must not break the game
  }

  return {
    startMusic() {
      playFromStart(music);
    },

    playFail() {
      music.pause();
      playFromStart(crash);
      playFromStart(failJingle);
    },

    playWin() {
      music.pause();
      playFromStart(cheer);
      playFromStart(applause);
    },

    // Replay calls this, so no sound from the last run can play over the new one.
    stopAll() {
      allSounds.forEach((sound) => sound.pause());
    },

    setMuted(muted) {
      allSounds.forEach((sound) => {
        sound.muted = muted;
      });
    },
  };
}
