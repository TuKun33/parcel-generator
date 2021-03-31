import './style.less';

export default {
  template: /*html*/`
    <div class="timeline">
      <div class="timeline-item" v-for="(item, i) in data" :key='i'>
        <div class="timeline-item--aside">
          <div class="timeline-item--date text-center">
            <div class='date' v-if='showDate(data, i)'>{{ item.date | getDate }}</div>
            <div class='time'>{{ item.date | getTime }}</div>
            <div class="timeline-item--dot" :class='{ "bg-transparent": !showDate(data, i) }'></div>
          </div>
        </div>
        <div class="timeline-item--context">
          <p>{{ item.text }}</p>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  methods: {
    showDate(datas, i) {
      const getDate = t => t.slice(0, 10)
      if (i === 0) {
        return true
      } else {
        //后一个日期与当前日期比较，不同就return出去
        return getDate(datas[i - 1].date) !== getDate(datas[i].date)
      }
    }
  },
  filters: {
    getDate(t) {
      return t.slice(5, 10)
    },
    getTime(t) {
      return t.slice(11)
    }
  }
}