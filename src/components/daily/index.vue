<template>
  <div class="day-item">
    <div class="fun-content" v-if="showCover">
      <a class="fun-content-item product" @click="handleMyAudioPlay">
        <div v-lazy:background-image="day.imgurl" class='day-item-img' ></div>
        <img class="hidden" :src="day.imgurl" @load="loading = false" />
      </a>
    </div>
    <div class="fun-footer">
      <h1 v-if="day.etitle">{{ day.etitle.replace(/&nbsp;/g, " ") }}</h1>
      <div class="audio-container">
        <span @click="handleMyAudioPlay" class="icon" :class="myAudioPlaying ? 'icon-pause' : 'icon-play'"></span>
        <span>{{ day.mp3title }}</span>
        <audio ref="audio" :src="day.mp3url" hidden="true"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    day: {
      type: Object,
      default: {}
    },
    showCover: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      myAudioPlaying: false,
    }
  },
  mounted() {
    this.audioInit()
  },
  // watch: {
  //   day() {
  //     this.$nextTick()
  //   }
  // },
  methods: {
    audioInit() {
      const a = this.$refs['audio'];
      a.addEventListener('ended', e => {
        this.myAudioPlaying = false
      }, false);
      a.addEventListener('pause', e => {
        this.myAudioPlaying = false
      }, false);
      this.audioEl = a
    },
    
    handleMyAudioPlay() {
      if (this.audioEl.playing) {
        this.audioEl.pause()
        this.myAudioPlaying = false
      } else {
        this.audioEl.play()
        this.myAudioPlaying = true
      }
    },
  }
}
</script>

<style lang="less">
@import '../../assets/variable.less';
.day-item {
  // box-shadow: 0 0 2.4rem rgba(0, 0, 0, .15);
  box-shadow: 0.61rem 0.61rem 3.35rem 0.3rem rgba(229,229,229,1);
  background-color: #fff;
  width: 100%;
	-ms-flex-negative: 0;
	flex-shrink: 0;
	background-position: center;
	background-size: 100% 100%;
	background-repeat: no-repeat;
	border-radius: 1.2rem;
	position: relative;
	z-index: 1;
  margin: 0 0 2rem;
  padding: 1rem 1rem 1rem;
  & &-img {
    width: 100%;
    // height: calc((100vw - 1.5rem * 2) * (380 / 670));
    height: calc((100vw - 4.4rem * 2) * (16 / 29));
    border-radius: .8rem;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #eee;
  }
  .fun-content-item {
    margin: 0;
  }
  .fun-footer {
    margin: 1.5rem 1rem;
    h1 {
      font-size: 2.2rem;
    }
  }
}
.icon-play, .icon-pause {
  display: block;
  font-size: 3rem;
  // width: 3.4rem;
  // height: 3.4rem;
  color: @main-color;
  width: auto;
  height: 100%;
  margin-right: .5rem;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.audio-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  span:nth-child(2) {
    font-size: 1.6rem;
    color: #222;
    // font-weight: 700;
    text-indent: .4em;
    line-height: 1;
  }
}
</style>