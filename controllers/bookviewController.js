const bookviewController = {
    getBookview: (req, res) => {
        res.render ("tempBookingAndViewing", {id: req.query.id, month: req.query.month, year: req.query.year});
    }
};

export default bookviewController;