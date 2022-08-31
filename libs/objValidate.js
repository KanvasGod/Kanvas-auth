
const objValidate = (inspect, obj) => {
    const indexs = Object.keys(inspect);
    let i = 0;
    const objFeilds = Object.keys(obj);

    if(objFeilds.length !== indexs.length) {
        return false
    }

    while(i < indexs.length) {
        
        if(!objFeilds.includes(indexs[i])) {
            return false
        }

        const refs = inspect[indexs[i]].toLowerCase();
        let type = typeof(obj[indexs[i]]);

        if(type === 'object') {
            const array = Array.isArray(obj[indexs[i]]);
            if(array) {
                type = 'array'
            }
        }

        if(type !== refs) {
            return false
        }
        i++;
    }

    return true
}





module.exports = {
    objValidate
}