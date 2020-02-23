module.exports = (req, res, next) => {
    return res.status(200).json({ message: 'middleware testing' });
}