<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="visible" @click.self="hide">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text" v-text="text"></p>
          <div class="operate">
            <div @click="cancel" class="operate-btn left" v-text="cancelBtnText"></div>
            <div @click="confirm" class="operate-btn" v-text="confirmBtnText"></div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: ''
      },
      confirmBtnText: {
        type: String,
        default: '确定'
      },
      cancelBtnText: {
        type: String,
        default: '取消'
      }
    },
    data () {
      return {
        visible: false
      };
    },
    methods: {
      show() {
        this.visible = true;
      },
      hide() {
        this.visible = false;
      },
      confirm() {
        this.hide();
        this.$emit('confirm');
      },
      cancel() {
        this.hide();
        this.$emit('cancel');
      }
    }
  };
</script>

<style lang="scss" scoped>
  .confirm {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 998;
    background-color: $color-background-d;
    &.confirm-fade-enter-active {
      animation: confirm-fadein 0.3s;
      .confirm-content {
        animation: confirm-zoom 0.3s;
      }
    }
    .confirm-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
      .confirm-content {
        width: 5.4rem;
        border-radius: .26rem;
        background: $color-highlight-background;
        .text {
          margin: 0;
          padding: .38rem .3rem;
          line-height: .44rem;
          text-align: center;
          font-size: $font-size-medium-x;
          color: $color-text-l;
        }
        .operate {
          display: flex;
          align-items: center;
          text-align: center;
          font-size: $font-size-medium-x;
          @include border(1, $color-background-d, top);
          .operate-btn {
            flex: 1;
            line-height: .44rem;
            padding: .2rem 0;
            color: $color-text-d;
            &.left {
              @include border(1, $color-background-d, right);
            }
          }
        }
      }
    }
  }

  @keyframes confirm-fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes confirm-zoom {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
