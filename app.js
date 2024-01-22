/**
 * 1. render songs
 * 2. scroll top
 * 3. play /pause / seek
 * 4. CD rotate
 * 5. Next / Prev
 * 6. random
 * 7. loop
 * 8. active songs
 * 9. scroll active song into view
 * 10. play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2");
const singer = $("header h3");
const CDThumb = $(".cd-thumb");
const audio = $("#audio");

const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const iconElement = playBtn.querySelector("i");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const start = $(".duration span:first-child");
const end = $(".duration span:last-child");
const playList = $(".playlist");
const dashboard = $(".dashboard");
const title = $("title");
const love = $(".btn-love");
const eachLoveIcon = $$(".each-love");
const favList = $("#favorite-list");
const favWrap = $(".fav-wrap");
const iconFavList = $(".favorite-songs");
const volumeIcon = $(".btn.btn-volume");
const volumeIconOff = $(".btn.btn-volume i");

const app = {
  isMuted: false,
  currentIndex: 0,
  playedSong: [],
  favSong: [],
  isPlaying: false,
  changingProgress: false,
  isRandom: false,
  isRepeated: false,
  songs: [],

  render: function (songs, place) {
    html = songs.map((song, index) => {
      return `<div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index = ${index} data-liked = "${song.favorite}">
          <div
            class="thumb"
            style="
              background-image: url(${song.image});
            "
          ></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <div class="btn btn-love each-love ${
              song.favorite === "1" ? "active" : ""
            }"  >
              <i class="fas fa-heart"></i>
            </div>
            <i class="fas fa-ellipsis-h"></i>
          </div>
          <div class="line-wrap d-flex">
            <div class="line line1"></div>
            <div class="line line2"></div>
            <div class="line line3"></div>
            <div class="line line4"></div>
          </div>
        </div>`;
    });
    htmls = html.join("");
    place.innerHTML = htmls;
  },
  changeFavStatus: function () {},
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  nextSong: function () {
    this.currentIndex++;

    if (app.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;

    if (app.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  randomSong: function () {
    var newRandomSong;
    this.playedSong.push(this.currentIndex);

    if (this.playedSong.length >= this.songs.length) {
      this.playedSong = [];
    }
    // console.log(this.playedSong);
    do {
      newRandomSong = Math.floor(Math.random() * this.songs.length);
    } while (
      newRandomSong == this.currentIndex ||
      this.playedSong.includes(newRandomSong)
    );
    this.currentIndex = newRandomSong;
    this.loadCurrentSong();
  },

  updateTime: function () {
    var min = Math.floor(audio.currentTime / 60);
    var curMin = min < 10 ? "0" + min : min;
    var sec = Math.floor(audio.currentTime - curMin * 60);
    var curSec = sec < 10 ? "0" + sec : sec;
    start.innerHTML = curMin + ":" + curSec;

    var songDuration_Minute = Math.floor(audio.duration / 60);
    var maxDuration_Minute =
      songDuration_Minute < 10
        ? "0" + songDuration_Minute
        : songDuration_Minute;

    var songDuration_Second = Math.round(audio.duration % 60);
    var maxDuration_Second =
      songDuration_Second < 10
        ? "0" + songDuration_Second
        : songDuration_Second;
    // console.log(songDuration_Second);
    end.innerHTML = maxDuration_Minute + ":" + maxDuration_Second;
  },
  handleEvents: function () {
    _this = this;
    // scroll
    const cdWidth = cd.offsetWidth;
    const initialDashboardHeight = dashboard.offsetHeight; // Chiều cao ban đầu của dashboard
    let isScrollingUp = false;

    document.addEventListener("scroll", () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCDWidth = cdWidth - scrollTop;

      cd.style.width = newCDWidth > 0 ? newCDWidth + "px" : 0;
      const dashboardHeight = dashboard.offsetHeight;
      // console.log(dashboardHeight);

      if (dashboardHeight < initialDashboardHeight) {
        isScrollingUp = true;
      } else {
        isScrollingUp = false;
      }

      if (dashboardHeight === initialDashboardHeight && !isScrollingUp) {
        dashboard.style.backgroundColor = "rgba(153, 186, 231, 0)";
      } else {
        dashboard.style.backgroundColor = "rgba(153, 186, 231, 0.5)";
      }
    });

    // play on click
    playBtn.addEventListener("click", () => {
      if (_this.isPlaying) {
        audio.pause();
        const lineWrap = $$(".line-wrap");
        lineWrap.forEach((line) => {
          line.classList.remove("active");
        });
      } else {
        app.activatePlayingSong();
        audio.play();
      }
    });
    var animateCD = CDThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 12000,
        iterations: Infinity,
      }
    );
    animateCD.pause();

    audio.onplay = function () {
      _this.isPlaying = true;
      iconElement.classList.remove("fa-play");
      iconElement.classList.add("fa-pause");
      animateCD.play();
    };

    audio.onpause = function () {
      _this.isPlaying = false;
      iconElement.classList.add("fa-play");
      iconElement.classList.remove("fa-pause");
      animateCD.pause();
    };

    //cap nhat thanh progress
    audio.ontimeupdate = function () {
      if (audio.duration && !app.changingProgress) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        // console.log(progress.value);
        progress.value = progressPercent;
        progress.style.background = `linear-gradient(
        90deg,
        rgba(4, 108, 21, 0.5) ${progress.value}%,
        rgba(255, 255, 255,1) ${progress.value}%
      )`;
        app.updateTime();
      }
    };

    //tua
    progress.oninput = function (e) {
      app.changingProgress = true;
      const seekTime = (audio.duration * e.target.value) / 100;
      audio.currentTime = seekTime;

      app.updateTime();
    };

    progress.onchange = function () {
      app.changingProgress = false;
    };

    progress.addEventListener("input", () => {
      var value = progress.value;
      progress.style.background = `linear-gradient(
        90deg,
        rgba(4, 108, 21, 0.5) ${value}%,
        rgba(255, 255, 255,1) ${value}%
      )`;
    });

    nextBtn.onclick = function () {
      if (app.isRandom) {
        app.randomSong();
        app.activatePlayingSong();
      } else {
        app.nextSong();
        app.activatePlayingSong();
      }

      audio.oncanplaythrough = function () {
        audio.play();
        audio.oncanplaythrough = null; // Reset the event handler
        app.scrollToActiveSong();
      };
    };

    prevBtn.onclick = function () {
      if (app.isRandom) {
        app.randomSong();
        app.activatePlayingSong();
      } else {
        app.prevSong();
        app.activatePlayingSong();
      }

      audio.oncanplaythrough = function () {
        audio.play();
        audio.oncanplaythrough = null; // Reset the event handler
        app.scrollToActiveSong();
      };
    };

    randomBtn.onclick = function () {
      app.isRandom = !app.isRandom;
      randomBtn.classList.toggle("active", app.isRandom);
      app.activatePlayingSong();
    };

    repeatBtn.onclick = function () {
      app.isRepeated = !app.isRepeated;
      repeatBtn.classList.toggle("active", app.isRepeated);
    };

    audio.onended = function () {
      if (app.isRepeated) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    love.addEventListener("click", () => {
      app.currentSong.favorite = app.currentSong.favorite == "0" ? "1" : "0";

      if (!app.favSong.includes(app.currentSong)) {
        app.favSong.push(app.currentSong);
      }
      app.favSong = app.favSong.filter((song) => song.favorite == "1");

      app.likeSong();
      app.render(app.favSong, favList);
      var activeInList = $("#favorite-list .song.active");
      if (activeInList) {
        activeInList.classList.remove("active");
      }
    });

    iconFavList.addEventListener("click", (e) => {
      e.stopPropagation();
      favWrap.classList.toggle("active");
    });
    document.addEventListener("click", (e) => {
      if (!favWrap.contains(e.target)) {
        favWrap.classList.remove("active");
      }
    });

    volumeIcon.addEventListener("click", () => {
      if (app.isMuted) {
        app.isMuted = false;
        audio.volume = 1;
        volumeIconOff.classList.add("fa-volume-up");
        volumeIconOff.classList.remove("fa-volume-slash");
        volumeIcon.classList.remove("active");
      } else {
        app.isMuted = true;
        audio.volume = 0;
        volumeIconOff.classList.remove("fa-volume-up");
        volumeIconOff.classList.add("fa-volume-slash");
        volumeIcon.classList.add("active");
      }
    });
  },

  likeSong: function () {
    this.render(this.songs, playList);
    this.activatePlayingSong();

    if (this.currentSong.favorite === "1") {
      love.classList.add("active");
    } else {
      love.classList.remove("active");
    }
  },

  scrollToActiveSong: function () {
    // var songActive = $(".song.active");
    // console.log(songActive);
    // var songs = Array.from($$(".song"));

    // var index = songs.indexOf(songActive);
    // console.log(index);

    $(".song.active").scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  },
  activatePlayingSong: function () {
    const activeSong = $(".playlist .song.active");
    activeSong.classList.remove("active");
    const currentSong = $$(".playlist .song")[app.currentIndex];
    currentSong.classList.toggle("active", true);
    const lineWrap = $$(".line-wrap");
    lineWrap.forEach((line) => {
      line.classList.remove("active");
    });
    lineWrap[this.currentIndex].classList.toggle("active", true);
  },

  loadCurrentSong: function () {
    title.innerHTML = this.currentSong.name;
    heading.innerHTML = this.currentSong.name;
    singer.innerHTML = this.currentSong.singer;
    CDThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
    audio.src = this.currentSong.path;
    app.likeSong();
  },
  changeFavStatus: function () {},
  chooseAnotherSong: function () {
    const playlist = $(".playlist");
    playlist.addEventListener("click", function (e) {
      const song = e.target.closest(".song");
      if (song) {
        var loveIcon = song.querySelector(".option .fas.fa-heart");
        if (song.contains(e.target) && e.target != loveIcon) {
          app.currentIndex = Number(song.dataset.index);
          app.loadCurrentSong();
          app.activatePlayingSong();
          audio.play();
        } else if (loveIcon.contains(e.target)) {
          // console.log(song.dataset.index);
          var songFav = app.songs[song.dataset.index];

          songFav.favorite = songFav.favorite === "0" ? "1" : "0";

          if (!app.favSong.includes(songFav)) {
            app.favSong.push(songFav);
          }
          app.favSong = app.favSong.filter((song) => song.favorite == "1");

          app.render(app.favSong, favList);
          app.likeSong();
        }
      }
    });
  },

  fetchSongs: async function () {
    try {
      const response = await fetch("songs.json");
      const data = await response.json();
      return data.songs;
    } catch (error) {
      console.error("Error fetching songs:", error);
      return [];
    }
  },
  start: async function () {
    this.songs = await this.fetchSongs();
    this.defineProperties();
    this.handleEvents();
    // this.updateDuration();

    this.loadCurrentSong();

    this.render(this.songs, playList);

    this.chooseAnotherSong();
  },
};

app.start();
