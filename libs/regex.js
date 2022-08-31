const phoneV = (payload, max=15) => {
    // phone check
    const reg = RegExp(/(^([+]{1}[0-9]{1})?([(]{1})?([0-9]{3})?([) .-]?\d+))([. -\d])?([0-9]{4})/gm);

    const str = payload.split('');

    if(str.length > max)
        return {pass: false, message: `Phone number to long maximum: ${max}`}

    if(reg.test(payload) === false)
        return {pass: false, message: 'phone number not valid'}

    return {pass: true, message: ''}
}

const minMaxV = (payload, min=0, max=256, charout='') => {
    const str = payload.split('');
    if(str.length > max) {
        return {pass: false, message: `String to long maximum: ${max}`}
    }

    if(str.length < min) {
        return {pass: false, message: `String to short minimum: ${min}`}
    }

    for(let i in str) {
        if(charout.split('').includes(str[i]))
            return {pass: false, message: `Charactor "${str[i]}" no aloud in text box`}
    }

    return {pass: true, message: ''}
} 

const emailV = (email) => {
    // check email types
    const reg = RegExp(/((^[a-z1-9_.%+-]+)\b)(@{1})(\w+)([-.](\S+))/gm);

    if(reg.test(email) === false)
        return false;

    // check for grouped "."
    const str = email.split('');
    let i = 0;
    let last = null;
    while (i < str.length) {
        if(last === '.' && str[i] === '.')  {
            return false
        }
        last = str[i];
        i++;
    }
    return true
}

const passwordV = (check, caps=0, nonCaps=0, numbers=0, symbols=0, limit=6) => {
    const chars = {
        upper: 0,
        lower: 0,
        num: 0,
        sym: 0
    }

    const str = check.split('');

    if(str.length >= limit) {
        let i = 0;

        let regLower = RegExp(/[a-z]/g);
        let regUpper = RegExp(/[A-Z]/g);
        let regNum = RegExp(/[0-9]/g);
        let regSym = RegExp(/[!@#$%^&*]/g);

        const addS = (num) => {
            if(num > 1) {
                return "'s";
            }
            return '';
        }

        while (i < str.length) {
            if(regLower.test(str[i]))
                chars.lower++;

            if(regUpper.test(str[i]))
                chars.upper++;

            if(regNum.test(str[i]))
                chars.num++;

            if(regSym.test(str[i]))
                chars.sym++;
            i++;
        }

        if(chars.lower < nonCaps)
            return {pass: false, message: `password needs at least ${nonCaps} lowercase letter${addS(nonCaps)}`}

        if(chars.upper < caps)
            return {pass: false, message: `password needs at least ${caps} uppercase letter${addS(caps)}`}

        if(chars.num < numbers)
            return {pass: false, message: `password needs at least ${numbers} number${addS(numbers)}`}

        if(chars.sym < symbols)
            return {pass: false, message: `password have at least ${symbols} symbol${addS(symbols)}`}
        
        return {pass: true, message: ''}
    }

    return {pass: false, message: `password must be at least ${limit} charactors long`}
} 





module.exports = {
    phoneV,
    minMaxV,
    emailV,
    passwordV
}