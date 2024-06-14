const { Configuration } = require('testcollab-sdk');

const getDate = () => {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let dateTime = date + '-' + month + '-' + year + ' ' + hours + ':' + minutes;
    return dateTime;
}

const getTCConfig = () => {
    let config = new Configuration({

        fetchApi: (url, options) => {
            // append the token to the url if no query string is present
            if (!url.includes('?')) {
                url = url + '?token=' + process.env.TESTCOLLAB_API_KEY;
            }
            else {
                url = url + '&token=' + process.env.TESTCOLLAB_API_KEY;
            }
            return fetch(url, options)
        },
    
    })
    return config;
}

module.exports = {getDate, getTCConfig}