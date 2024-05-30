import express from 'express'
import { logAction } from './utils/logger.js'
import { validateToken, getCurrencyValue, getSupportedCurrencies } from './database.js'

const app = express()
const PORT = process.env.API_PORT

app.listen(PORT, () => {
    logAction('index.js', `Server started and listening at port ${PORT}`)
})

app.get('/api/currency/get/:curr', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')

  validateToken(req.headers.ukey)
    .then((isValid) => {
      isValid = true // test only
      const { curr } = req.params

      if(isValid){
        getCurrencyValue(curr)
          .then((data) => {
            res.json(
              {
                responseType: 'success',
                currencyName: data.name,
                currencyValue: data.value,
                tendingTo: data.tendency,
                lastUpdate: data.lastUpdate
              }
            )
          })
          .catch((err) => {
            res.json(res.statusCode, 'Something went wrong on our side, please contact support.')
          })
      } else {
        res.json(
          {
            responseType: 'error',
            currencyName: 'API KEY MISSING OR INCORRECT',
            currencyValue: 'API KEY MISSING OR INCORRECT',
            tendingTo: 'API KEY MISSING OR INCORRECT',
            lastUpdate: 'API KEY MISSING OR INCORRECT'
          }
        )
      }
    })
    .catch(err => console.log(err))
})

app.get('/api/currency/convert/:a/:f/:t', (req, res) => {
  const { f, a, t } = req.params
  const convertion = require('./api/convertion')
  
  convertCurrency(a, f, t)
    .then(result => {
      res.json({
        responseType: 'success',
        amount: a,
        from: f,
        to: t,
        result: result
      })
    })
})

app.get('/api/currency/list', (req, res) => {
  getSupportedCurrencies()
    .then(currencies => {
      res.json({ currencies: currencies })
    })
})

app.get('*', (req, res) => {
    res.json({
      responseType: 'error',
      message: `${req.path} is not a handled endpoint`
    })
})