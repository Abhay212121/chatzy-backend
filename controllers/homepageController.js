const getWelcomePage = (req, res) => {
    console.log(req.user.userName)
    return res.json({ status: 200, userName: req.user.userName })
}

module.exports = { getWelcomePage }