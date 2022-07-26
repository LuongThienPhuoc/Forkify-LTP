import { TIMEOUT_SEC } from './config'

const timeout = (s) => {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Request took to long! Timeout after ${s} sencond`))
        }, s * 1000)
    })
}


export const getJSON = async (url) => {
    try {
        const fetchPro = fetch(url)
        const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)])
        //const response = await fetch(url)
        const data = await response.json()

        if (!response.ok) throw new Error(`${data.message} ${response.status}`)
        return data
    } catch (err) {
        console.log(err)
    }
}

export const sendJSON = async (url, uploadData) => {
    try {
        const fetchPro = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadData)
        })

        const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)])
        const data = await response.json()

        if (!response.ok) throw new Error(`${data.message} ${response.status}`)
        return data
    } catch (err) {
        console.log(err)
    }
}