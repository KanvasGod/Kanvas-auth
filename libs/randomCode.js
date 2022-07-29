randomCode = (digits) => {
    const abc = 'abcdefghijklmnopqrstuvwxyz'
    const sets = {
        0: '0123456789',
        1: abc,
        2: abc.toUpperCase()
    }
    let str = `${sets[0]}${sets[1]}${sets[2]}`.split('')

    let pool = ''
    for(let i = 0; i < digits; i++) {
        const x = Math.floor(Math.random() * str.length)
        pool += str[x]
    }
    return pool
}

module.exports = {
    randomCode
}