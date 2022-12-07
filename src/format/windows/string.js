export function readString8(buffer, offset, maxChar) {
    //初始化结果数组
    let result = []

    //循环读取缓冲区
    let array = new Uint8Array(buffer, offset, maxChar)
    for (let code of array) {
        if (code > 0) {
            result.push(code)
        } else {
            break
        }
    }

    //创建字符串
    return String.fromCharCode(...result)
}

export function readString16(buffer, offset, maxChar) {
    //初始化结果数组
    let result = []

    //循环读取缓冲区
    let array = new Uint16Array(buffer, offset, maxChar * 2)
    for (let code of array) {
        if (code > 0) {
            result.push(code)
        } else {
            break
        }
    }

    //创建字符串
    return String.fromCharCode(...result)
}
