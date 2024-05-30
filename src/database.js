import mysql from 'mysql2'

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS
})

export const validateToken = (reqToken) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM `users` WHERE `utoken` = "'+reqToken+'"', (err, results) => {
                if(!err) {
                    if(results.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                } else {
                    reject(err)
                }
            }
        )
    })
}

export const getAllCurrencies = () => {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM `currencies`",
            (err, result) => {
                if(!err) {
                    const objects = []

                    result.map(r => {
                        objects.push({
                            name: r.name,
                            value: r.value,
                            tendency: r.tendency,
                            lastUpdate: r.updated_on
                        })
                    })

                    resolve(objects)
                } else {
                    reject()
                }
            }
        )
    })
}

export const updateCurrencyValue = (currencyName, value, tendency) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `UPDATE currencies SET value = '${value}', tendency = '${tendency}' 
            WHERE currencies.name = '${currencyName}'`,
            (err, result) => { 
                if(!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            }
        )
    })
}

export const getCurrencyValue = (currencyName) => {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM `currencies` WHERE `name` = '"+currencyName+"'",
            (err, result) => {
                if(!err) {
                    resolve({
                        name: result[0].name,
                        value: result[0].value,
                        tendency: result[0].tendency,
                        lastUpdate: result[0].updated_on
                    })
                } else {
                    reject()
                }
            }
        )
    })
}

export const getSupportedCurrencies = () =>{
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM `currencies`',
            (err, result) =>{
                if(!err) {
                    const supportedCurrencies = []

                    result.map(row => supportedCurrencies.push(row.name))
                    resolve(supportedCurrencies)
                } else {
                    console.log(err)
                }
            }
        )
    })
}
