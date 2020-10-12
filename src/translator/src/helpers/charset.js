class Charset {
    constructor() {
        this.dictionary = {
            "ą": ["¹"],
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
            "Ż": ["¯"]
        }
    }

    translateIn = (obj) => {
        for(let key in obj) {
            if(obj.hasOwnProperty(key) && typeof obj[key] == 'string' && obj[key].length > 0) {
                obj[key] = obj[key].replace(/¹|æ|ê|³|£|ñ|œ|Œ|¿|¯/g, (letter) => {
                    for(let dictLetter in this.dictionary) {
                        let fittingLetters = this.dictionary[dictLetter].filter((foreignLetter) => {
                            return foreignLetter == letter;
                        });
                        if(fittingLetters.length > 0) {
                            return dictLetter;
                        }
                    }
                });
            }
        }

        return obj;
    }

    translateOut = (obj) => {
        for(let key in obj) {
            if(obj.hasOwnProperty(key) && typeof obj[key] == 'string' && obj[key].length > 0) {
                obj[key] = obj[key].replace(/ą|ć|ę|ł|Ł|ń|ś|Ś|ż|Ż/g, (letter) => {
                    return this.dictionary[letter][0];
                });
            }
        }

        return obj;
    }
}

module.exports = new Charset();