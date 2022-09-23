const admin = require("firebase-admin");


const defaultFooter = `
Kryptic Canvas is an e-commerce platform for online applications. 
Built for small business or just the idea on your mind, so 
all you have to do focus on what matter.
`

styleConverter = (cssObject) => {
    let CssData = ''
    rObject = (obj) => {
        return Object.keys(obj)
    }

    rObject(cssObject).forEach(id => {
        let pool = [];
        rObject(cssObject[id]).forEach(line => {
            let refLine = line.split('');
            let newLine = '';
            refLine.forEach((letter, i) => {
                // console.log(letter, letter === letter.toUpperCase());
                if(letter === letter.toUpperCase()) {
                    const setTo = letter.toLowerCase()
                    newLine += `-${setTo}`;
                } else {
                    newLine += letter;
                }
            })
            let str = `${newLine}:${cssObject[id][line]};`;
            pool.push(str);
        })
        CssData += `${id} {${pool.join('')}}`;
    })
    return `<style type="text/css">${CssData}</style>`
}

const style = {
    "body": {
        display: 'flex',
        justifyContent: 'center'
    },
    "table": { 
        height: '100%',
        background: 'rgb(25,25,25)',
        maxWidth: '500px',
        borderRadius: '5px',
        padding: '15px'
    },
    "P-title": {
        height: "100px",
    },
    "P-company-logo": {
        margin: '10px',
        height: '100px'
    },
    "P-pin": {
        color: 'rgba(229, 299, 299, 0.8)',
        fontSize: '2.5em',
        height: '100px'
    },
    "P-paragraph": {
        color: 'rgba(229, 299, 299, 0.8)',
        textAlign: 'left',
        fontWeight: 200,
        letterSpacing: '1px',
        fontSize: '1.1em',
        height: '100%'
    },
    "P-footer": {
        color: 'rgba(229, 299, 299, 0.8)',
        textAlign: 'center',
        fontWeight: 200,
        letterSpacing: '1px',
        fontSize: '0.9em'
    }
}

inLine = (index) => {
    const pool = [];
    Object.keys(style[index]).forEach(ref => {
        let refLine = ref.split('');
        let newLine = '';
        refLine.forEach(letter => {
            if(letter === letter.toUpperCase()) {
                const setTo = letter.toLowerCase()
                newLine += `-${setTo}`;
            } else {
                newLine += letter;
            }
        })

        pool.push(`${newLine}:${style[index][ref]};`);
    })

    return `style="${pool.join('')}"`
}

template = (obj) => {

    const tags = Object.keys(obj);
    const pool = [];

    tags.forEach(section => {
        if(section.includes('section_')) {
            let paragraph = `
                <tr>
                    <th ${inLine('P-paragraph')}>
                        ${obj[section]}
                    </th>
                </tr>
            `
            pool.push(paragraph)
        }
        if (section.includes('pin_')) {
            let paragraph = `
                <tr>
                    <th ${inLine('P-pin')}>
                        ${obj[section]}
                    </th>
                </tr>
            `
            pool.push(paragraph)
        }
        if(section === 'footer') {
            let paragraph = `
                <tr>
                    <th ${inLine('P-footer')}>
                    <hr>
                        ${obj[section] ? obj[section] : defaultFooter}
                    </th>
                </tr>
            `
            pool.push(paragraph)
        }
    })

    const template = `
        <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    ${styleConverter(style)}
                </head>
                <body>
                    <table>
                        <tr>
                            <th ${inLine('P-title')}>
                                <img ${inLine('P-company-logo')} alt="Kanvas logo" src="https://firebasestorage.googleapis.com/v0/b/kanvas-accounts.appspot.com/o/kanvas_logo_light.png?alt=media&token=97319563-4022-42c6-8c70-fd8641d79b60">
                            </th>
                        </tr>
                        ${pool.join('')}
                    </table>
                </body>
            </html>
    `

    return template
}

module.exports = {
    template
}