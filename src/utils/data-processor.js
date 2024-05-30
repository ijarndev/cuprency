import { getCurrencyValue, updateCurrencyValue } from "../database.js"
import { logAction } from "./logger.js"

const MCF = process.env.MAX_CHANGE_FACTOR

export function processData(source) {
  return new Promise((resolve, reject) => {
    const data = {
      amount:   source.match(/\d+/g)[0],
      currency: source.match(/usd|mlc|eur/gi)[0],
      value:    source.match(/\d+/g)[1]
    }

    getCurrencyValue(data.currency)
    .then(currency => {
      const changeFactor = (data.value - currency.value) / 2
      const newValue = (changeFactor + currency.value).toFixed(2)

      if(changeFactor > (MCF * -1) && changeFactor <= MCF) {
        const tendency = (currency.value < newValue) 
          ? 'increase'
          : 'decrease'

        updateCurrencyValue(data.currency, newValue, tendency)
          .then(result => {
            if(result != null) {
              resolve(newValue)
            } else {
              reject()
            }
          })
      }
    })
  })
}