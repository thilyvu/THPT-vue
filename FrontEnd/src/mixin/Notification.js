export const NotificationMixin = {
  methods: {
    openNotificationWithIcon(type, title, text) {
      this.$notification[type]({
        message: title,
        description: text,
      });
    },

    formatStartOfQuestion(index) {
      let character = "";
      switch (parseInt(index)) {
        case 0:
          character = "A";
          break;
        case 1:
          character = "B";
          break;
        case 2:
          character = "C";
          break;
        case 3:
          character = "D";
          break;
        case 4:
          character = "E";
          break;
        case 5:
          character = "F";
          break;
        case 6:
          character = "G";
          break;
        case 7:
          character = "H";
          break;
        case 8:
          character = "I";
          break;
        case 9:
          character = "J";
          break;
        case 10:
          character = "K";
          break;
        case 11:
          character = "L";
          break;
        case 12:
          character = "M";
          break;
        case 13:
          character = "N";
          break;
        case 14:
          character = "i";
          break;
        case 15:
          character = "ii";
          break;
        case 16:
          character = "iii";
          break;
        case 17:
          character = "iv";
          break;
        case 18:
          character = "v";
          break;
        case 19:
          character = "vi";
          break;
        case 20:
          character = "vii";
          break;
        case 21:
          character = "viii";
          break;
        case 22:
          character = "ix";
          break;
        case 23:
          character = "x";
          break;
        case 24:
          character = "xi";
          break;
        case 25:
          character = "xii";
          break;
        case 26:
          character = "xiii";
          break;
        case 27:
          character = "xiv";
          break;
        case 28:
          character = "xv";
          break;
      }
      return character;
    },
    formatStartOfQuestionRoman(index) {
      let character = "";
      switch (parseInt(index)) {
        case 0:
          character = "i";
          break;
        case 1:
          character = "ii";
          break;
        case 2:
          character = "iii";
          break;
        case 3:
          character = "iv";
          break;
        case 4:
          character = "v";
          break;
        case 5:
          character = "vi";
          break;
        case 6:
          character = "vii";
          break;
        case 7:
          character = "viii";
          break;
        case 8:
          character = "ix";
          break;
        case 9:
          character = "x";
          break;
        case 10:
          character = "xi";
          break;
        case 11:
          character = "xii";
          break;
        case 12:
          character = "xiii";
          break;
        case 13:
          character = "xiv";
          break;
        case 14:
          character = "xv";
          break;
      }
      return character;
    },
    makeid(length) {
      var result = "";
      var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },
  },
};
