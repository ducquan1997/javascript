/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play /Pause /Seek
 * 4. CD rotate
 * 5. Next /Prev
 * 6. Random
 * 7. Next /Repeat when end 
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'PLAYER_STORAGE'

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Trust you",
            singer: "Yuna Ito",
            path: "./assets/music/song1.mp3",
            image: "./assets/img/song1.png"
          },
          {
              name: "Wishing",
              singer: "Nishino Kana",
              path: "./assets/music/song2.mp3",
              image: "./assets/img/song2.png"
          },
          {
              name: "Thinking of you",
              singer: "Nishino Kana",
              path: "./assets/music/song3.mp3",
              image: "./assets/img/song1.png"
          },
          {
              name: "Monsters",
              singer: "Katie Sky",
              path: "./assets/music/song4.mp3",
              image: "./assets/img/song2.png"
          },
          {
              name: "Breathless",
              singer: "Mika Kobayashi",
              path: "./assets/music/song5.mp3",
              image: "./assets/img/song1.png"
          },
          {
              name: "Freesia",
              singer: "Uru",
              path: "./assets/music/song6.mp3",
              image: "./assets/img/song2.png"
          },
          {
              name: "Rain",
              singer: "Sekai No Owari",
              path: "./assets/music/song7.mp3",
              image: "./assets/img/song1.png"
          },
          {
              name: "Haru Natsu Aki Fuyu",
              singer: "Sumika",
              path: "./assets/music/song8.mp3",
              image: "./assets/img/song2.png"
          },
          {
              name: "Rain",
              singer: "SID",
              path: "./assets/music/song9.mp3",
              image: "./assets/img/song1.png"
          },
          {
              name: "Kawaki wo Ameku",
              singer: "Minami",
              path: "./assets/music/song10.mp3",
              image: "./assets/img/song2.png"
          }
    ],

    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function () {
        const _this = this
        const cdWitdh = cd.offsetWidth

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lý phóng to - thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWitdh - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0;
            cd.style.opacity = newCdWidth / cdWitdh;
        }

        // Xử lý khi click Play 
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Khi song play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua 
        progress.oninput = function (e) {
            const seekTime = e.target.value * audio.duration / 100
            audio.currentTime = seekTime 
        }

        // Khi next song 
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            _this.activeSong()
            _this.scrollToActiveSong()
            audio.play()
            // _this.render()
        }

        // Khi prev song 
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            _this.activeSong()
            _this.scrollToActiveSong()
            audio.play()
        }

        // Xử lý bật tắt random song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        } 

        // Xử lý lặp lại một song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Xử lý lắng nghe click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            const songNodeOption = e.target.closest('.option')

            if (songNode || songNodeOption) {   
                // Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.activeSong()
                    audio.play()
                }
                
                // Xử lý khi click song option
                if (songNodeOption) {

                }
            }
        }
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    activeSong: function () {
        var loopSongs = $$('.song')
        for (song of loopSongs) {
                song.classList.remove('active')
        }
        const activeSong = loopSongs[this.currentIndex]
        activeSong.classList.add('active')
    },

    scrollToActiveSong: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }, 200)
    },
    
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }  while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function() {
        // Gán cấu hình từ config vô ứng dụng
        this.loadConfig();

        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();
        
        // Lắng nghe và xử lý các sự kiện DOM Events
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();        

        // Render playlist
        this.render();

        // Hiển thị trạng thái của button Repeat && Random
        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)
    }
}

app.start();
