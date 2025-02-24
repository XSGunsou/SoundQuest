const songs = [
  { name: "Jealous", file: "song_1.mp3" },
  { name: "Sand", file: "song_2.mp3" },
  { name: "Still", file: "song_3.mp3" },
  { name: "Ballin", file: "song_4.mp3" },
  { name: "Avenue", file: "song_5.mp3" },
  { name: "So far so good", file: "song_6.mp3" },
];

// Shuffle helper function
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

let score = 0;
let lastPlayedSongIndex = null;
let isPlaying = false;

// Custom player elements
const audioPlayer = document.getElementById("audioPlayer");
const playPauseButton = document.getElementById("playPauseButton");
const audioProgress = document.getElementById("audioProgress");
const audioProgressBar = document.getElementById("audioProgressBar");
const notification = document.getElementById("notification");

// Function to display notifications
function showNotification(message, type) {
  notification.textContent = message; // Set the notification text
  notification.className = type; // Add class for correct/wrong styling
  notification.style.display = "block"; // Show the notification

  // Fade the notification out after 2 seconds
  setTimeout(() => {
    notification.style.display = "none";
  }, 2000);
}

// Load a random song
function loadRandomSong() {
  let correctSongIndex;

  // Ensure no consecutive repeats
  do {
    correctSongIndex = Math.floor(Math.random() * songs.length);
  } while (correctSongIndex === lastPlayedSongIndex);
  lastPlayedSongIndex = correctSongIndex;

  const correctSong = songs[correctSongIndex];

  // Set audio player source
  audioPlayer.src = `static/${correctSong.file}`;
  audioPlayer.load();
  audioProgressBar.style.width = "0%";
  playPauseButton.textContent = "▶";

  // Create choices
  const otherSongs = songs.filter((_, idx) => idx !== correctSongIndex);
  const randomIncorrect = shuffleArray(otherSongs).slice(0, 3);
  const allChoices = shuffleArray([
    correctSong.name,
    ...randomIncorrect.map(song => song.name),
  ]);

  const choiceButtons = document.querySelectorAll(".choice");
  choiceButtons.forEach((button, index) => {
    button.textContent = allChoices[index];
    button.onclick = () => {
      if (button.textContent === correctSong.name) {
        showNotification("Correct!", "correct"); // Show correct notification
        score++;
      } else {
        showNotification("Wrong!", "wrong"); // Show wrong notification
      }
      document.getElementById("score").textContent = score;
      setTimeout(loadRandomSong, 2000); // Load the next song after 2 seconds
    };
  });
}

// Play/Pause button logic
playPauseButton.addEventListener("click", () => {
  if (isPlaying) {
    audioPlayer.pause();
    playPauseButton.textContent = "▶";
  } else {
    audioPlayer.play();
    playPauseButton.textContent = "⏸";
  }
  isPlaying = !isPlaying;
});

// Update progress bar
audioPlayer.addEventListener("timeupdate", () => {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  audioProgressBar.style.width = `${progress}%`;
});

// Seek on progress bar click
audioProgress.addEventListener("click", (event) => {
  const width = audioProgress.offsetWidth;
  const clickX = event.offsetX;
  const duration = audioPlayer.duration;

  audioPlayer.currentTime = (clickX / width) * duration;
});

// Exit button logic
document.getElementById("exitButton").addEventListener("click", () => {
  showNotification(`Game Over! Your final score is: ${score}`, "correct");
  setTimeout(() => window.location.reload(), 2000); // Reload game after 2 seconds
});

// Start game
window.onload = loadRandomSong;