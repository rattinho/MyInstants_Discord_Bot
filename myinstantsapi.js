const rp = require('request-promise');
const cheerio = require('cheerio');
const url = 'https://www.myinstants.com/pt/index/br/';
const tclass = '.small-button'

const arraydelinks = []


exports.getSong = function(){
    return rp(url)
    .then(function (html) {
        var $ = cheerio.load(html)
        var site = $(tclass);
        site.each((index, element) => {
            const onclickValue = $(element).attr('onclick');
            arraydelinks.push('https://www.myinstants.com/' + onclickValue.replace("play('/", '').split(',')[0].replace("'", ''))
        });
        const i = Math.floor(Math.random() * arraydelinks.length);
        const resultado = arraydelinks[i];
        return resultado
    })
    .catch(function (err) {
        console.log("Error")
    });
}
