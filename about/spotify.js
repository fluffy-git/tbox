var serviceHost = "https://spotify-listening-to-worker.eduardgavrila475204.workers.dev/";
var spotifyUser = "fluffy";

var songData, progressSeconds, totalSeconds, progressInterval;

  function updatePlayer() {
    fetch(`${serviceHost}/get-now-playing`)
      .then((response) => response.json())
      .then((data) => {
        if (data.hasOwnProperty("ERROR")) {
          document.getElementById(
            "player-song"
          ).innerHTML = `${spotifyUser} isn't playing anything.`;
          document.getElementById("player-artist").innerHTML = "  ";
					document.getElementById("player-pt").setAttribute("style","display: none;");
					updatePlayer();
        }
        songData = data;
        document.getElementById("player-song").innerHTML = data.item.name;
        document.getElementById("player-artist").innerHTML =
          data.item.artists[0].name;
        document.getElementById("player-status").innerHTML = data.is_playing
          ? `▶️ ${spotifyUser}'s now playing...`
          : `⏸️ ${spotifyUser} has paused.`;
        document
          .getElementById("player-album-art")
          .setAttribute("src", data.item.album.images[1].url);
        document
          .getElementById("player-progress")
          .setAttribute(
            "style",
            document.getElementById("player-progress").getAttribute("style") +
              `width: ${(data.progress_ms * 100) / data.item.duration_ms}%`
          );


        progressSeconds = Math.ceil(songData.progress_ms / 1000);
        totalSeconds = Math.ceil(songData.item.duration_ms / 1000);
        
				setProgress();
				updatePlayer();
      });
  }

  function setProgress() {
    if (progressSeconds > totalSeconds) {
      clearInterval(progressInterval);
      updatePlayer();
      return;
    }
    ++progressSeconds;
    var totalLabel =
      pad(parseInt(totalSeconds / 60)) + ":" + pad(totalSeconds % 60);
    var progressLabel =
      pad(parseInt(progressSeconds / 60)) + ":" + pad(progressSeconds % 60);
    document.getElementById("player-time").innerHTML =
      progressLabel + " / " + totalLabel;
    document.getElementById("player-progress").style.width = `${
      (progressSeconds * 100) / totalSeconds
    }%`;
  }

  function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  }

  // Load player for the first time
  updatePlayer();