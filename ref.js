const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

//add song:
const addSong = $(".js-btn-primary");
const overlay = $(".overlay-modal");
const closeOverlay = $(".btn-close");
const saveSong = $(".btn-saveNewSong");
const nameInput = $(".nameInput");
const singerInput = $(".singerInput");
const pathInput = $(".pathInput");
const imageInput = $(".imageInput");

//add time to input range
const timeRange = $("#timeRange");

//custome for volumn bar
const volumnOption = $(".js-volumn-option");
const volumnValue = $(".volumn-js");
const volumnHeight = $(".volumn-height");
const volumnMiddle = $(".volumn-middle");
const volumnOff = $(".volumn-off");

// tạo một object app để thực thi
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  isVolumeVisible: false,
  songs: [
    {
      name: "Say you wont let go",
      singer: "James Arthur",
      path: "./assets/music/song1.mp3",
      image: "./assets/img/song1.jpg",
      favorite: "0",
    },
    {
      name: "Somewhere only we know",
      singer: "Keane",
      path: "./assets/music/song2.mp3",
      image: "./assets/img/song2.jpg",
      favorite: "0",
    },
    {
      name: "Be more",
      singer: "Stephen Sanchez",
      path: "./assets/music/song3.mp3",
      image: "./assets/img/song3.jpg",
      favorite: "0",
    },
    {
      name: "Another love",
      singer: "Tom Odell",
      path: "./assets/music/song4.mp3",
      image: "./assets/img/song4.jpg",
      favorite: "0",
    },
    {
      name: "Love the way you lie",
      singer: "Eminiem",
      path: "./assets/music/song5.mp3",
      image: "./assets/img/song5.jpg",
      favorite: "0",
    },
    {
      name: "Nơi này có anh",
      singer: "Sơn Tùng M-TP",
      path: "./assets/music/song6.mp3",
      image: "./assets/img/song6.jpg",
      favorite: "0",
    },
    {
      name: "Someone you love",
      singer: "Lewis Capaldi",
      path: "./assets/music/song7.mp3",
      image: "./assets/img/song7.jpeg",
      favorite: "0",
    },
    {
      name: "Photograph",
      singer: "Ed Sheeran",
      path: "./assets/music/song8.mp3",
      image: "./assets/img/song8.png",
      favorite: "0",
    },
    {
      name: "Suýt nữa thì",
      singer: "Andiez",
      path: "./assets/music/song9.mp3",
      image: "./assets/img/song9.jpg",
      favorite: "0",
    },
    {
      name: "Viva la vida",
      singer: "Coldplay",
      path: "./assets/music/song10.mp3",
      image: "./assets/img/song10.jpg",
      favorite: "0",
    },
    {
      name: "Let Her Go (Feat. Ed Sheeran - Anniversary Edition)",
      singer: "Passenger",
      path: "./assets/music/song11.mp3",
      image: "./assets/img/song11.jpg",
      favorite: "0",
    },
  ],
  //key = function render để render playlist
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
                <div class="song ${
                  index === this.currentIndex ? "active" : ""
                }" data-index=${index}>
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body" title="${song.name}
${song.singer}">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>

                    <div class="option js-option-${index}" onclick="handleOptionClick(event)" data-option=${index}>
                        <i class="fas fa-ellipsis-h"></i>
                        <div class="option-container hide btn-group-vertical" >
                            <button class="btn btn-primary option-item option-item1-${index}" type="button">
                                <i class="bi bi-cloud-arrow-down-fill"></i>
                            </button>
                            <button class="btn btn-primary option-item option-item2-${index}" type="button">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
    });
    playlist.innerHTML = htmls.join("");
  },
  //key = function defineProperties để define một phương thức trong app (cụ thể là phương thức currentSong)
  defineProperties: function () {
    //define một phương thức currentSong
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  //key = function handleEvents dùng để xử lí các sự kiện
  handleEvents: function () {
    const _this = this; // vì hàm onclick bên trong nếu gọi this
    // thì sẽ gọi this của hàm onclick đó, nên ta phải khai báo _this bên ngoài
    // để khi gọi _this thì sẽ gọi được this của object app

    //play and pause song
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    //xử lí khi quay cd
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();
    console.log(cdThumbAnimate);

    //khi được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    //Khi bị pause
    audio.onpause = function () {
      player.classList.remove("playing");
      _this.isPlaying = false;
      cdThumbAnimate.pause();
    };

    //Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        console.log(progressPercent, audio.currentTime, audio.duration);
        progress.value = progressPercent;
      }
    };

    //cập nhật giá trị thời gian bên dưới khi tiến độ thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercent;
        timeRange.textContent =
          formatTime(audio.currentTime) + "/ " + formatTime(audio.duration);
      }
    };
    function formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    //Nút random
    randomBtn.onclick = (e) => {
      // console.log(e.currentTarget)
      if (_this.isRandom) {
        _this.isRandom = false;
        e.currentTarget.classList.remove("active");
      } else {
        _this.isRandom = true;
        e.currentTarget.classList.add("active");
      }
      // Save the isRandom state to localStorage
      localStorage.setItem("isRandom", _this.isRandom);
    };

    //khi next song + random
    nextBtn.onclick = () => {
      if (_this.isRandom) {
        _this.playRandom();
        _this.render();
        _this.scrollToActiveSong();
      } else {
        _this.nextSong();
        _this.render();
        _this.scrollToActiveSong();
      }
      audio.play();
    };

    //khi prev song + random
    prevBtn.onclick = () => {
      if (_this.isRandom) {
        _this.playRandom();
        _this.render();
        _this.scrollToActiveSong();
      } else {
        _this.prevSong();
        _this.render();
        _this.scrollToActiveSong();
      }
      audio.play();
    };

    // Xử lí repeat
    repeatBtn.onclick = (e) => {
      if (_this.isRepeat) {
        _this.isRepeat = false;
        e.currentTarget.classList.remove("active");
      } else {
        _this.isRepeat = true;
        e.currentTarget.classList.add("active");
      }
      // Save the isRepeat state to localStorage
      localStorage.setItem("isRepeat", _this.isRepeat);
    };

    //xử lí next khi kết thúc bài hát
    audio.onended = () => {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    //xử lí khi tua
    // sử dụng oninput thay vì onchange vì oninput nó thay đổi tức thì
    // còn onchange thì thay đổi khi người dùng xác nhận thay đổi đó, VD: enter, focus ra ngoài=>Nói chung là chậm hơn
    progress.oninput = function (e) {
      const seekTime = (e.target.value / 100) * audio.duration;
      audio.currentTime = seekTime;
    };

    // xử lí khi người dùng nhấp vào playList
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active");
      // closest() là một phương thức trả về node cha gần nhất của một node nhất định.
      // console.log(songNode);
      if (songNode) {
        //xử lí khi click và song
        //số trong consolelog là màu tím, string là màu trắng
        _this.currentIndex = Number(songNode.dataset.index);
        console.log(_this.currentIndex);
        _this.loadCurrentSong();
        _this.render();
        audio.play();
      }
      // console.log(e.target.closest('.option'));
    };

    //Xử lí khi add song, close form
    addSong.onclick = function () {
      overlay.classList.remove("hide");
    };
    closeOverlay.onclick = function () {
      overlay.classList.add("hide");
    };

    //xử lí khi save new song
    saveSong.onsubmit = function (event) {
      event.preventDefault();
      const newSong = {
        name: nameInput.value,
        singer: singerInput.value,
        path: pathInput.value,
        image: imageInput.value,
      };
      console.log(newSong);
      _this.songs.push(newSong);

      // Đóng popup
      overlay.classList.add("hide");

      // Làm mới danh sách phát và cập nhật giao diện
      _this.render();
      _this.saveToStorage();
    };

    // xử lí khi click vào volumn
    volumnOption.onclick = () => {
      if (_this.isVolumeVisible == false) {
        // Mở rộng thanh input và hiển thị
        volumnValue.style.width = "100px";
        volumnValue.style.opacity = 1;
        _this.isVolumeVisible = true;
      } else {
        // Trả về trạng thái mặc định
        volumnValue.style.width = "0";
        volumnValue.style.opacity = 0;
        _this.isVolumeVisible = false;
      }
      // console.log(volumnValue);
      volumnValue.oninput = () => {
        // console.log(volumnValue.value);
        audio.volume = volumnValue.value;
        // console.log(audio.volume);
        if (audio.volume == 0) {
          volumnOff.classList.remove("hide");
          volumnHeight.classList.add("hide");
          volumnMiddle.classList.add("hide");
        } else if (audio.volume <= 0.3) {
          volumnOff.classList.add("hide");
          volumnHeight.classList.add("hide");
          volumnMiddle.classList.remove("hide");
        } else if (audio.volume > 0.3) {
          volumnOff.classList.add("hide");
          volumnHeight.classList.remove("hide");
          volumnMiddle.classList.add("hide");
        }
      };
    };

    //xử lí phóng to/ thu nhỏ
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = window.scrollY;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };
  },
  //key = function loadCurrentSong để load bài hát hiện tại và hiển thị lên đoạn gần CD
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  //xử lí nextSong
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  //xử lí prevSong
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  //Xử lí random bài hát
  playRandom: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
      console.log(newIndex);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  //Xử lí cuộn playlist into view
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);
  },

  //lưu các giá trị vào local
  saveToStorage: function () {
    localStorage.setItem("songs", JSON.stringify(this.songs));
  },

  //lấy song từ local
  loadSongsFromLocalStorage: function () {
    const storedSongs = localStorage.getItem("songs");
    if (storedSongs) {
      // Chuyển dữ liệu lấy từ Local Storage thành mảng
      this.songs = JSON.parse(storedSongs);
    }
  },

  //key = function start để thực thi các key khác
  start: function () {
    //định nghĩa các thuộc tính cho object
    this.defineProperties();

    // gọi các bài hát từ local
    this.loadSongsFromLocalStorage();

    // Lấy giá trị isRandom và isRepeat từ localStorage
    const savedIsRandom = localStorage.getItem("isRandom");
    const savedIsRepeat = localStorage.getItem("isRepeat");

    // Kiểm tra và gán giá trị đã lưu từ localStorage hoặc mặc định
    if (savedIsRandom !== null) {
      // console.log(savedIsRandom === 'true');
      // hiểu như này: ta so sánh giá trị của savedIsRandom với chuỗi true lấy ra trong localStorage
      // nếu mà điều này là đúng thì phép toán so sánh sẽ trả về true(chứ không phải biến giá trị 'true' thành true boolean), rồi ta lưu true đó vào this.isRandom
      this.isRandom = savedIsRandom === "true"; // Chuyển đổi chuỗi thành giá trị boolean
    }
    if (savedIsRepeat !== null) {
      this.isRepeat = savedIsRepeat === "true"; // Chuyển đổi chuỗi thành giá trị boolean
    }

    if (this.isRepeat) {
      repeatBtn.classList.add("active");
    } else {
      repeatBtn.classList.remove("active");
    }

    if (this.isRandom) {
      randomBtn.classList.add("active");
    } else {
      randomBtn.classList.remove("active");
    }

    //Lắng nghe và xử lí các sự kiện
    this.handleEvents();
    //tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();
    //render bài hát
    this.render();

    // Kiểm tra nếu là thiết bị di động thì sẽ ẩn thanh âm lượng
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      volumnOption.style.display = "none";
    }
  },
};

//xử lí khi click option
function handleOptionClick(event) {
  event.stopPropagation();
  const optionEl = event.target.closest(".option");
  // Lấy giá trị data-option từ phần tử
  const dataOption = optionEl.dataset.option;
  const optionContainer = $(`.js-option-${dataOption} .option-container`);
  optionContainer.classList.toggle("hide");

  // khi click vào nút download
  const optionItem1 = $(`.option-item1-${dataOption}`);
  optionItem1.onclick = function () {
    const downloadSong = app.songs[dataOption];
    console.log(downloadSong);
    //tạo thẻ a để tải xuống
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadSong.path; // Lấy đường dẫn của bài hát từ downloadSong
    downloadLink.download = downloadSong.name + ".mp3";

    // Kích hoạt sự kiện click trên liên kết để tải file về máy
    downloadLink.click();
  };

  // khi click vào nút remove
  const optionItem2 = $(`.option-item2-${dataOption}`);
  optionItem2.onclick = function () {
    const indexToRemove = Number(dataOption);
    console.log(dataOption);
    if (!isNaN(indexToRemove)) {
      app.songs.splice(indexToRemove, 1);
      app.saveToStorage();
      location.reload();
    }
    if (app.songs.length === 0) {
      alert("No any songs available");
    }
  };
}

//chạy chương trình
app.start();
