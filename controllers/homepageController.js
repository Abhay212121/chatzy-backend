const getWelcomePage = (req, res) => {
    return res.json({ status: 200, userName: req.user.userName })
}

module.exports = { getWelcomePage }