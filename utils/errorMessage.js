function error(err){
    return {
        status: 500,
        message: err
    }
}

module.exports = error;