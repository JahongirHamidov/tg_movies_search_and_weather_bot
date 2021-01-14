const TelegramBot = require('node-telegram-bot-api')
const request = require('request')
const dotenv = require('dotenv')
dotenv.config({path:'.env'})

const token = process.env.TOKEN

const bot = new TelegramBot(token, {polling:true})

bot.onText(/\/start/, function(msg,match){
    const chatId = msg.chat.id
    bot.sendMessage(chatId,'Iltimos film qidirmoqchi bolsangiz [/movie va film nomi] agar ob havoni bilmoqchi bolsangiz [/weather va shahar nomi] kiriting. Botdan foydalanganingiz uchun raxmat!' )
})

bot.onText(/\/movie (.+)/, function(msg,match){
    var movie = match[1]
    var chatId = msg.chat.id
    request(`http://omdbapi.com/?apikey=${process.env.KEY}&t=${movie}`, function(error, response, body){
        if(!error && response.statusCode == 200){
            bot.sendMessage(chatId, '__Looking for __'+ movie + '...', {parse_mode: 'Markdown'})
            .then(function(msg){
                var res = JSON.parse(body)
                bot.sendPhoto(
                    chatId, 
                    res.Poster, 
                    {caption: 'Result :\n \nTitle: '+ res.Title + '\nYear: '+ res.Year + '\nGenre: '+res.Genre+'\nReleased: '+res.Released+'\nDirector: '+res.Director+'\nActors: '+res.Actors+'\nCountry: '+res.Country+'\nProduction: '+res.Production })
            })
        }
    })    
})

bot.onText(/\/weather (.+)/, function(msg, match){
    const chatId = msg.chat.id
    const city = match[1]
    request(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_KEY}`, function(error, response, body){
        if(!error && response.statusCode == 200){
            const res = JSON.parse(body)
            const country = res.sys.country
            const weatherType = res.weather[0].main
            const temp = (res.main.temp-271.15).toFixed(1)
            const feelsLike = (res.main.feels_like-271.15).toFixed(1)
            const tempMin = (res.main.temp_min-271.15).toFixed(1)
            const tempMax = (res.main.temp_max-271.15).toFixed(1)
            const pressure = res.main.pressure
            const humidity = res.main.humidity
            const windSpeed = res.wind.speed
            const windDegree = res.wind.deg

            bot.sendMessage(chatId, `\t${city} city, ${country} weather : \n  \nWeather Type : ${weatherType} \nTemp. : ${temp} C\nTemp. feels like : ${feelsLike} C\nMinimal temp. : ${tempMin} C\nMaximal temp. : ${tempMax} C\nPressure : ${pressure} KPa\nHumidity : ${humidity}%\nWind speed : ${windSpeed} km/h\nWind degree : ${windDegree}  `)
            
        }
    })
})


