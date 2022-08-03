const fs = require('fs');
const path = require('path');

const checkForFile = (fileName, data, timer) => {
    const str = fileName.split('\\');
    const dir = str.slice(0, (str.length - 1)).join('\\');
    const isThere = fs.existsSync(dir);
    const toAppend = fs.existsSync(fileName);
    if(isThere === false) {
        fs.mkdirSync(dir);
    }
    let newForm = new Object();
    if(toAppend) {
        newForm = fs.readFileSync(fileName, {encoding:'utf8', flag:'r'})
        newForm = JSON.parse(newForm)
    }
    const createData = new Object();
    let keys = Object.keys(data);
    let i = 0;
    while (i < keys.length) {
        createData[keys[i]] = {
            value: data[keys[i]],
            destroy: timer || 'no-decay'
        }
        i++;
    }
    
    i = 0
    keys = Object.keys(newForm);
    while (i < keys.length) {
        if(!createData[keys[i]]) {
            createData[keys[i]] = newForm[keys[i]]
        }
        i++
    }
    const form = JSON.stringify(createData);

    fs.writeFileSync(fileName, form);
}

const getFile = (path, date) => {
    try {
        let form = fs.readFileSync(path, { encoding:'utf8', flag:'r' });
        let d1 = new Date(date);
        const formData = JSON.parse(form);
        const keys = Object.keys(formData);
        const newForm = new Object();
        let i = 0;
        while (i < keys.length) {
            let d2 = new Date(formData[keys[i]].destroy)
            const compare = d2 > d1
            if(compare || formData[keys[i]].destroy === 'no-decay') {
                newForm[keys[i]] = formData[keys[i]]
            }
            i++;
        }
        return newForm
    } catch {
        return null
    }
}

const sortObject = (find, newForm) => {
    try {
        const str = find.split('/');
        const pick = newForm[str[0]].value;
        let tallyObj = pick;
        if(str.length > 1) {
            let arrayCheck = str.slice(1, str.length);
            arrayCheck.forEach((el, index) => {
                if(index === 0) {
                    tallyObj = pick[el]
                } else {
                    tallyObj = tallyObj[el]
                }
            });
        }
        return tallyObj
    } catch {
        return null
    }
}

createPath = (letter, path) => {
    const paths = path.split('\\');
    const maxlen = paths.length - 1;
    paths[maxlen] = `${letter}${paths[maxlen]}`
    const newPath = paths.join('\\');
    return newPath
}

class Store {
    constructor(dirPath, addTimer='no-decay') {
        this.path = path.join(__dirname, `../store/${dirPath}`);
        this.addTimer = addTimer
        this.date = new Date().getTime();
    }

    add(data) {
        // create path
        const key = Object.keys(data)[0][0].toUpperCase();
        // action
        let date = null;
        if(this.addTimer !== 'no-decay') {
            date = new Date(this.date + this.addTimer)
        }
        checkForFile(createPath(key, this.path), data, date);
    }

    remove(find) {
        // create path
        const key = find[0].toUpperCase();
        const newPath = createPath(key, this.path);
        const obj = getFile(newPath, this.date);

        if(find) {
            delete obj[find];
        }
        fs.writeFileSync(newPath, JSON.stringify(obj));
    }

    fetch(find) {
        const key = find[0].toUpperCase();
        const newPath = createPath(key, this.path);
        const obj = getFile(newPath, this.date);

        if(obj) {
            const result = sortObject(find, obj, newPath);
            return result
        }
        return obj
    }
}

module.exports = {
    Store
}