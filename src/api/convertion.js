const database = require('../database')

const convertCurrency = (amount, from, to) => { // 20 mlc a usd
    return new Promise((resolve, reject) => {
        try {
            database.getCurrencyValue(from)
            .then(fValue => {
                database.getCurrencyValue(to)
                    .then(tValue =>{
                        resolve((fValue.value / tValue.value * amount).toFixed(2))
                    })
            })
        } catch {
            reject('Something went wrong, please check the docs to make sure your request is valid.')
        }
    })
}

module.exports.convertCurrency = convertCurrency