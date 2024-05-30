import TelegramBot from 'node-telegram-bot-api'
import { getAllCurrencies } from '../database.js' 
import { processData } from '../utils/data-processor.js'
import { logAction } from '../utils/logger.js'
import { io } from 'socket.io-client'

const token = process.env.TGC_TOKEN
const bot = new TelegramBot(token, { polling: true })
const mainRegex = /\d*.(usd|mlc|eur).a.\d*/gi
const socketClient = io('ws://localhost:3000', {
  extraHeaders: {
    'client_type': 'DataCrawler'
  }
})

let chatID

bot.on('message', async (msg) => {
  const message = msg.text
  const usefulMatches = message.match(mainRegex)
  chatID = msg.chat.id

  if(usefulMatches) {
    processMessage(message)
  }

  if(msg.text === '/rates') {
    const currencies = await getAllCurrencies()
    let template = ''

    currencies.map(c => {
      template += `${c.tendency === 'increase' ? '⬆️' : '⬇️'} ${c.name.toUpperCase()}: $${c.value}\n`
    })

    bot.sendMessage(
      chatID,
      `
      Realtime-updated rates by Cuprency API:\n\n${template}
      `
    )
  }
})

bot.on('polling_error', (error) => {
  console.log(error)
})

function processMessage(message) {
  const result = message.match(mainRegex)

  result.map(instance => {
    processData(instance)
      .then(data => {
        getAllCurrencies().then(data => {
          socketClient.emit('update', data)
          console.log(data)
        })
      })
      .catch(error => {
        console.log('Unable to proccess last input:', error)
      })
  })
}

logAction('telegram.js', 'running and waiting for input')