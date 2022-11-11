const bookviewController = {
    getBookview: (req, res) => {
        res.render ("tempBookingAndViewing", {date: req.query.date, month: req.query.month, year: req.query.year});
    }
};

export default bookviewController;