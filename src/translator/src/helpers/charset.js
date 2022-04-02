class Charset {
    constructor() {
        this.dictionary = {
            "ą": ["¹"],
            "Ą": ["¥"],
            "ć": ["æ"],
            "Ć": ["Æ"],
            "ę": ["ê"],
            "Ę": ["Ê"],
            "ł": ["³"],
            "Ł": ["£"],
            "ń": ["ñ"],
            "Ń": ["Ñ"],
            "ó": ["*"],
            "ś": ["œ"],
            "Ś": ["Œ"],
            "ż": ["¿"],
            "Ż": ["¯"],
            "ź": ["Ÿ"],
            "Ź": [""]
        }
    }

    translateIn = (obj) => {
        // for(let key in obj) {
        //     if(obj.hasOwnProperty(key) && typeof obj[key] == 'string' && obj[key].length > 0) {
        //         obj[key] = obj[key].replace(/¹|¥|æ|Æ|ê|Ê|³|£|ñ|Ñ|œ|Œ|¿|¯|Ÿ|/g, (letter) => {
        //             for(let dictLetter in this.dictionary) {
        //                 let fittingLetters = this.dictionary[dictLetter].filter((foreignLetter) => {
        //                     return foreignLetter == letter;
        //                 });
        //                 if(fittingLetters.length > 0) {
        //                     return dictLetter;
        //                 }
        //             }
        //         });
        //     }
        // }

        return obj;
    }

    translateOut = (obj) => {
        // for(let key in obj) {
        //     if(obj.hasOwnProperty(key) && typeof obj[key] == 'string' && obj[key].length > 0) {
        //         obj[key] = obj[key].replace(/ą|Ą|ć|Ć|ę|Ę|ł|Ł|ń|Ń|ś|Ś|ż|Ż|ź|Ź/g, (letter) => {
        //             return this.dictionary[letter][0];
        //         });
        //     }
        // }

        return obj;
    }
}

module.exports = new Charset();