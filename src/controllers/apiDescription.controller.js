const apiDescriptionCtr = {}

apiDescriptionCtr.info = (req, res) => {
    res.send({ application: 'sucreEnvia-app', version: '1' });
}

apiDescriptionCtr.getback = (req, res) => {
    res.send({ ...req.body });
}

module.exports = apiDescriptionCtr;