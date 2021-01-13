const TelegramBot = require('node-telegram-bot-api')
const request = require('request')
const dotenv = require('dotenv')
dotenv.config({path:'.env'})

const token = process.env.TOKEN

const bot = new TelegramBot(token, {polling:true})
bot.onText(/\/movie (.+)/, function(msg,match){
    var movie = match[1]
    var chatId = msg.chat.id
    request(`http://omdbapi.com/?apikey=${process.env.KEY}&t=${movie}`, function(error, response, body){
        if(!error && response.statusCode == 200){
            bot.sendMessage(chatId, '__Looking for __'+ movie + '...', {parse_mode: 'Markdown'})
            .then(function(msg){
                var res = JSON.parse(body)
                bot.sendPhoto(chatId, res.Poster, {caption: 'Result = \nTitle: '+ res.Title + '\nYear: '+ res.Year + '\nGenre: '+res.Genre+'\nReleased: '+res.Released+'\nDirector: '+res.Director+'\nActors: '+res.Actors+'\nCountry: '+res.Country+'\nProduction: '+res.Production })
            })
        }
    })    
})


