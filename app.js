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

const app = {
  currentIndex: 0,
  playedSong: [],
  isPlaying: false,
  changingProgress: false,
  isRandom: false,
  isRepeated: false,
  songs: [
    {
      name: "Rồi Em Sẽ Gặp Một Chàng Trai Khác",
      singer: "Hippohappy",
      path: "assets/songs/Rồi Em Sẽ Gặp Một Chàng Trai Khác  Hippohappy 𝐓𝐇𝐄 𝐌𝐀𝐒𝐊𝐄𝐑 𝐒𝐈𝐍𝐆𝐄𝐑.mp3",
      image: "https://i.ytimg.com/vi/hB3LJJ5uj_o/sddefault.jpg",
    },
    {
      name: "Bản Tình Ca Đầu Tiên",
      singer: "Duy Khoa",
      path: "assets/songs/Ban-Tinh-Ca-Dau-Tien-Duy-Khoa.mp3",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/4/8/0/d/480d45cf809513f9392b4e5fd199c3e3.jpg",
    },
    {
      name: "Tò te tí",
      singer: "Wren Evans",
      path: "assets/songs/ToTeTi-WrenEvans-13082104.mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2023/12/21/2/f/e/0/1703130676766_640.jpg",
    },
    {
      name: "Bát cơm mặn",
      singer: "Ong Bây Bi",
      path: "assets/songs/y2mate.com - Bát Cơm Mặn  Ong Bây Bi  The Masked Singer Vietnam LYRICS.mp3",
      image: "https://i.ytimg.com/vi/uaKlWUwQKZc/maxresdefault.jpg",
    },
    {
      name: "Khóa ly biệt",
      singer: "Voi Bản Đôn",
      path: "assets/songs/Khóa Ly Biệt feat Voi Bản Đôn.mp3",
      image: "https://media.viez.vn/prod/2023/11/13/image_7cddfd62b5.png",
    },
    {
      name: "Call me",
      singer: "WREN EVANS",
      path: "assets/songs/WREN EVANS  Call Me  LOI CHOI The First Album ft itsnk.mp3",
      image: "https://i.ytimg.com/vi/DlION6FK-Yc/maxresdefault.jpg",
    },
  ],

  render: function () {
    html = this.songs.map((song, index) => {
      return `<div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index = ${index}>
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
    playList.innerHTML = htmls;
  },
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
    console.log(this.playedSong);
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
        rgba(4, 108, 21, 0.5) ${progress.value}%,
        rgba(255, 255, 255,1) ${progress.value}%
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

    // playList.addEventListener("click", (e) => {
    //   const song = e.target.closest(".song:not(.active)");

    //   if (song || e.target.closest(".option")) {
    //     if (song) {
    //       app.currentIndex = Number(song.dataset.index);
    //       app.loadCurrentSong();
    //       app.render();
    //       audio.play();
    //       const activeSong = $(".playlist .song.active");
    //       activeSong.classList.remove("active");
    //       song.classList.toggle("active", true);
    //     }
    //   }
    // });
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
  },
  //   updateDuration: function () {
  //     audio.addEventListener("loadedmetadata", function () {
  //       // loadedmetadata load xong duration mới lấy

  //       end.innerHTML = (audio.duration / 60).toFixed(2);
  //     });
  //   },
  chooseAnotherSong: function () {
    const list = $$(".playlist .song");
    list.forEach((song, index) => {
      song.onclick = function () {
        app.currentIndex = index;
        app.loadCurrentSong();
        app.activatePlayingSong();
        audio.play();
      };
    });
  },
  start: function () {
    this.defineProperties();
    this.handleEvents();
    // this.updateDuration();
    this.loadCurrentSong();

    this.render();

    this.chooseAnotherSong();
  },
};

app.start();
