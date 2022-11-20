const calendarController = {
    getCalendarPage: (req, res) => {
        res.render ("calendar");
    },

    isValidCalendarDate (req, res, next) {
        const year = parseInt (req.query.year);
        const month = parseInt (req.query.month);
        const date = parseInt (req.query.date);
        const checkDate = new Date (year, month, date);
        let validDate = new Date ();
        validDate.setHours (0, 0, 0, 0);

        if (req.user.accountType != 'R') {
            validDate.setMonth (validDate.getMonth () - 1);
            validDate.setDate (1);
        }

        if (checkDate >= validDate) return next ();
        else res.redirect ('/calendar');
    }
};

export default calendarController;