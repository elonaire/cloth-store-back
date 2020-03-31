exports.homePageData = (req, res, next) => {
    res.status(200).json({
        message: 'load some home page data'
    });
}