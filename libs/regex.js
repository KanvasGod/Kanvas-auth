
const passwordV = (check) => {
    const len = 8
    const chars = {
        upper: 0,
        lower: 0,
        num: 0,
        sym: 0
    }

    const str = check.split('');

    if(str.length >= len) {
        let i = 0;

        let regLower = RegExp(/[a-z]/g);
        let regUpper = RegExp(/[A-Z]/g);
        let regNum = RegExp(/[0-9]/g);
        let regSym = RegExp(/[!@#$%^&*]/g);
        while (i < str.length) {
            i++;
        }
    }

    return false
} 





module.exports = {
    passwordV
}