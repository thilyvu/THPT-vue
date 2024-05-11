import moment from "moment";

export const DatetimeMixin = {
  methods: {
    formatDateTime(date) {
      return moment(date).format("DD/MM/YYYY, h:mm A");
    },
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY");
    },
    formatCalendarDate(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    getBetweenDates(startDate, endDate) {
      const dates = [];
      let currentDate = startDate;
      const addDays = function(days) {
        const date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
    while (currentDate <= endDate) {
        dates.push(this.formatCalendarDate(currentDate));
        currentDate = addDays.call(currentDate, 1);
      }
      return dates;
    },
    diffDateFromNow(yourDate) {
      return moment(new Date(yourDate)).fromNow()
    }
  },
};
