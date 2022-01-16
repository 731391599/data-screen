export function dataType(val) {
    return Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
}

export function isObject(target) {
    return dataType(target) === 'object'
}

export function merge(source, other) {
    if (!isObject(source) || !isObject(other)) {
        return other === undefined ? source : other
    }
    return Object.keys({
        ...source,
        ...other
    }).reduce(
        (acc, key) => {
            acc[key] = merge(source[key], other[key])
            return acc
        },
        Array.isArray(source) ? [] : {}
    )
}

export function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'deepClone')
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys])
        } else {
            targetObj[keys] = source[keys]
        }
    })
    return targetObj
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if (typeof time === 'string') {
            if (/^[0-9]+$/.test(time)) {
                time = parseInt(time)
            } else {
                time = time.replace(new RegExp(/-/gm), '/')
            }
        }

        if (typeof time === 'number' && time.toString().length === 10) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        return value.toString().padStart(2, '0')
    })
    return time_str
}
