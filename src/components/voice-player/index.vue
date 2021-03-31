<template>
  <div class="other-audio">
    <audio
      :src="src"
      ref="play1"
    ></audio>

    <div class="audio-img" @click="playAudio()">
      <div class="second">
        <div class="dong">
          <img src="./assets/yin1.png" alt class="yin1" />
          <img
            src="./assets/yin.png"
            alt
            class="yin"
            :class="audioImg==true?'animation2':''"
          />
          <img
            src="./assets/yin3.png"
            alt
            class="yin3"
            :class="audioImg==true?'animation3':''"
          />
        </div>
        <p class="second-p">{{ duration }}''</p>
      </div>
      <div class="audio-antime">
        <img src="./assets/zan.png" alt v-show="play==false" />
        <img src="./assets/play.png" alt v-show="play==true" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    src: String,
    duration: Number
  },
  data() {
    return {
      play: true,
      audioImg: false
    };
  },
  methods: {
    playAudio() {
      if (this.play == true) {
        this.$refs.play1.play();
        this.play = false;
        this.audioImg = true;
      } else {
        this.$refs.play1.pause();
        this.play = true;
        this.audioImg = false;
      }
    },
    // 播放结束后
    audioInit() {
      const audio = this.$refs.play1;
      if (audio) {
        audio.loop = false;
        this.play = true;
        this.audioImg = false;
        const handler = e => {
          this.play = true
          this.audioImg = false
        }
        audio.addEventListener("ended", handler, true);
        audio.addEventListener("pause", handler, true);

        this.audio = audio;
      }
    }
  },
  mounted() {
    this.audioInit();
  }
};
</script>
<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.other-audio {
  position: relative;
  .audio-img {
    width: 12rem;
    height: 3rem;
    background-color: #e9e8f7;
    border-radius: 1.5rem;
    position: relative;
    .audio-antime {
      display: flex;
      position: absolute;
      right: 0.4rem;
      top: 0.4rem;
      img {
        width: 2.2rem;
        height: 2.2rem;
      }
    }
    .second {
      position: relative;
      .second-p {
        position: absolute;
        font-size: 1.3rem;
        color: #6a61e7;
        left: 3.8rem;
        top: 0.48rem;
      }
      .dong {
        margin-left: 1.7rem;
        display: flex;
        .yin1 {
          width: 0.4rem;
          height: 0.6rem;
          margin-top: 1.3rem;
          // animation: fadeInOut 1s infinite 0.2s;
        }
        .yin {
          width: 0.5rem;
          height: 1rem;
          margin-top: 1.1rem;
        }
        .animation2 {
          animation: fadeInOut 1s infinite 0.2s;
        }
        .animation3 {
          animation: fadeInOut 1s infinite 0.3s;
        }
        .yin3 {
          width: 0.6rem;
          height: 1.4rem;
          margin-top: 0.9rem;
        }
      }
    }
  }
}
@keyframes fadeInOut {
    0% {
        opacity: 0; /*初始状态 透明度为0*/
    }
    100% {
        opacity: 1; /*结尾状态 透明度为1*/
    }
}
</style>