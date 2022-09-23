setTime = (str) => {
    const getDigit = new RegExp(/\d+/g);
    const getletter = new RegExp(/\D+/g);
    const d = new Date();
    const currentTime = d.getTime();

    if(str === undefined) {
        return new Date(currentTime);
    }

    let num = str.match(getDigit)[0];
    let letter = str.match(getletter)[0];

    const timeTypes = {
        seconds: 1000,
        s: 1000,
        minutes: 1000 * 60,
        min: 1000 * 60,
        hours: (1000 * 60) * 60,
        h: (1000 * 60) * 60,
        days: ((1000 * 60) * 60) * 24,
        d: ((1000 * 60) * 60) * 24,
        months: (((1000 * 60) * 60) * 24) * 31,
        mon: (((1000 * 60) * 60) * 24) * 31
    }

    const timeToAdd = timeTypes[letter] * parseFloat(num);
    const incTime = new Date(timeToAdd + currentTime);
    return incTime;
}

module.exports = {
    setTime
}