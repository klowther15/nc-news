
exports.psqlErrors = (err, req, res, next) => {
    if(err.code){
        res.status(400).send({ msg: "Bad Request" })
    }
    else next(err);
};

exports.customErrors = (err, req, res, next) => {
    if(err.msg){
        res.status(err.status).send({msg: err.msg})
    }
    else next(err);
};