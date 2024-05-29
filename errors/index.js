
exports.psqlErrors = (err, req, res, next) => {
    if(err.code){
        res.status(400).send({ msg: "Bad Request" })
    }
    else next(err);
};