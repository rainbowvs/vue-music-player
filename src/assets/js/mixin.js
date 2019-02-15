import { mapGetters, mapMutations, mapActions } from "vuex";
import { playMode } from 'store/config';
import { shuffle } from 'assets/js/utils';

export const playListMixin = {
  mounted() {
    this.handlePlayList(this.playList);
  },
  activated() {
    this.handlePlayList(this.playList);
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlayList method');
    }
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal);
    }
  },
  computed: {
    ...mapGetters([
      'playList'
    ])
  }
};

export const playerMixin = {
  methods: {
    favoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite';
      }
      return 'icon-not-favorite';
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song);
      } else {
        this.saveFavoriteList(song);
      }
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex(v => {
        return v.id === song.id;
      });
      return index > -1;
    },
    resetCurrentIndex(list) {
      const index = list.findIndex(v => {
        return v.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    changeMode () {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  },
  computed: {
    modeIcon() {
      return this.mode === playMode.sequence
        ? 'icon-sequence'
        : this.mode === playMode.loop
        ? 'icon-loop'
        : 'icon-random';
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'mode',
      'favoriteList'
    ])
  }
};

export const searchMixin = {
  data() {
    return {
      query: ''
    };
  },
  methods: {
    blurInput() {
      this.$refs.searchBox.blur();
    },
    onQueryChange(query) {
      this.query = query;
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
};
