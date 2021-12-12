import { tgAPIToken } from './config.js'
import TelegramBot from 'node-telegram-bot-api'
import options from './options.js'

const bot = new TelegramBot(tgAPIToken, {polling: true})
const chats = {}

bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/descr', description: 'Описание бота'},
    {command: '/info', description: 'Узнать подробнее о боте'},
    {command: '/game', description: 'Игра "Угадай число"'},
])

const startGame = async(chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 1 до 9, а ты должен будешь ее угадать)))`)
    const randomNum = Math.floor(Math.random() * 10)
    chats[chatId] = randomNum
    console.log(randomNum)
    await bot.sendMessage(chatId, `Отгадывай`, options.game)
}

start()
function start() {
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
    
        if (text === '/start' || text === '/descr') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/5.webp')
            await bot.sendMessage(chatId, `Привет! Это новый телеграм бот, ты можешь здесь многое`)
        }
        else if (text === '/info') {
            await bot.sendMessage(chatId, `Что ты хочешь узнать, ${msg.from.first_name}?`)
        }
        else if (text === '/game') {
            startGame(chatId)
        }
        else {
            await bot.sendMessage(chatId, 'Я не понимаю о чем ты говоришь(((')
        }
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if (data == chats[chatId]) {
            await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${data}!`, options.again)
        }
        else if (data === '/again') {
            startGame(chatId)
        }
        else {
            await bot.sendMessage(chatId, `Ты не отгадал цифру  ${data}. Попробуй еще раз!)`, options.again)
        }
    })
}