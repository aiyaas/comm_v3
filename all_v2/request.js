async function __ExectMainFeature__(select, _m) {
    // Select menu feature 
    switch (select) {
        case "GitHub": {
            const [_own, repo_path] = _m.split("/")
            const user_data = await (await fetch(`https://api.github.com/users/${_own}`)).json()
            const repo = await (await fetch(`https://api.github.com/repos/${_own}/${repo_path}/contents`)).json()
            
            return "<img height='200px' width='100%' style='outline:none;border:none;border-radius:10px;object-fit:cover;' src='" + user_data.avatar_url + "'></img><br /><br />" + useMarkUpText("```" + JSON.stringify(repo, null, 2) + "```")
        }
        break;
        case "YouTube": {
            const yt_auth = await (await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + _m + "&key=AIzaSyCRzpbNMkmCOcVy1VCiHjiNzdqYnWvN2ec")).json()
            
            return `<iframe height='250px' width='100%' style='outline:none;border:none;border-radius:10px;object-fit:cover;background:#000000;color:transparent;' src='https://www.youtube.com/embed/${yt_auth.items[0].id.videoId}' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe><br /><span>${yt_auth.items[0].snippet.description}</span>`
        }
        break;
        case "Weather": {
            const data = await  (await fetch("https://api.openweathermap.org/data/2.5/weather?q=" + _m.trim() + "&appid=1fe5f03e8b679377cbc41601289edfdd&units=metric")).json()
            const {
                name,
                main: {
                    temp, 
                    feels_like, 
                    temp_min,
                    temp_max,
                    humidity,
                    pressure
                },
                wind: { speed },
                weather,
                sys: { country, sunrise, sunset },
                coord: { lon, lat },
            } = data
                        
            const sunrise_time = new Date(sunrise * 1000).toLocaleTimeString()
            const sunset_time = new Date(sunset * 1000).toLocaleTimeString()
            
            return useMarkUpText("Current search location `" + _m + "`" + `.\n\n**Weather in ${name}, ${country}** \n\nTemperature: ${temp}°C (Feels like: ${feels_like}°C) \nMin/Max Temperature: ${temp_min}°C / ${temp_max}°C \nWeather: ${weather[0].description} \nHumidity: ${humidity}% \nPressure: ${pressure} hPa \nWind Speed: ${speed} m/s \nCoordinates: [${lat}, ${lon}] \nSunrise: ${sunrise_time} \nSunset: ${sunset_time}`) + "<img width='100px' height='100px' src='http://openweathermap.org/img/wn/" + weather[0].icon + "@2x.png' alt='weather_icon'></img>"
        }
        break;
        case "Gemini_0": {
            const results = await (await fetch(`https://api-mininxd.vercel.app/gemini/?q=${_m}`)).json()
            const res = results.text.replace(/<(.*?)>/gis, "&#60;$1&#62;")
            
            return useMarkUpText(res)
        }
        break;
        case "Gemini_1": {
            const results = await (await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDFoccaoS5gZPAC3TGMg5J9l9i2vtbHZ3k`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "contents": [{
                        "role": "user",
                        "parts": [{
                            "text": _m
                        }]
                    }]
                })
            })).json()
            const res = results?.candidates?.[0]?.content?.parts?.[0]?.text.replace(/<(.*?)>/gis, "&#60;$1&#62;")
            
            return useMarkUpText(res)
        }
        break;
        case "Groq": {
            const results = await (await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer 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"
                },
                body: JSON.stringify({
                    "messages": [{
                        "role": "user",
                        "content": _m
                    }],
                    "model": "llama-3.3-70b-versatile"
                })
            })).json()            
            const res = results.choices[0].message.content.replace(/<(.*?)>/gis, "&#60;$1&#62;")
            
            return useMarkUpText(res)
        }
        break;
        default:
            return useMarkUpText("**UNABLE FEATURE!**<br /><br />The current feature has not been released to the `public`, you can use the existing features for now.")
    }
}

