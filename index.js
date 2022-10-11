const express = require('express')
const app = express()
const port = 5000
const fs = require("fs")

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

var cors = require('cors')
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// 取得全部影片標記列表
app.get('/api/Notes', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./json/video.json', 'utf8'))
    res.json(data)
})

// 新增影片
app.post('/api/Note', (req, res) => {
    const { v, title } = req.body
    let data = JSON.parse(fs.readFileSync('./json/video.json', 'utf8'))
    if (!(data.find(d => d.v === v))) {
        data[data.length] = { v, title }
    }
    fs.writeFile('./json/video.json', JSON.stringify(data), function (err) {
        if (err)
            console.log(err);
        else
            console.log('Write operation complete.');
    });
    res.json(data)
})

// 取得影片內的標記
app.get('/api/Note/:v', (req, res) => {
    const { v } = req.params

    const data = JSON.parse(fs.readFileSync('./json/mark.json', 'utf8'))
    res.json(data[v])
})

// 新增影片內的標記
app.post('/api/Note/:v', (req, res) => {
    const { v } = req.params
    const { sec, content } = req.body

    let data = JSON.parse(fs.readFileSync('./json/mark.json', 'utf8'))
    if (data[v]) {
        data[v][data[v].length] = { sec, content, bDel: false }
    }
    fs.writeFile('./json/mark.json', JSON.stringify(data), function (err) {
        if (err)
            console.log(err);
        else
            console.log('Write operation complete.');
    });
    res.json(data)
})

// 修改影片內的標記
app.put('/api/Note/:v', (req, res) => {
    const { v } = req.params
    const { id, sec, content } = req.body

    let data = JSON.parse(fs.readFileSync('./json/mark.json', 'utf8'))
    if (data[v]) {
        data[v][id] = { sec, content, bDel: false }
    }
    fs.writeFile('./json/mark.json', JSON.stringify(data), function (err) {
        if (err)
            console.log(err);
        else
            console.log('Write operation complete.');
    });
    res.json(data)
})

// 刪除影片內的標記
app.delete('/api/Note/:v', (req, res) => {
    const { v } = req.params
    const { id, sec, content } = req.body

    let data = JSON.parse(fs.readFileSync('./json/mark.json', 'utf8'))
    if (data[v]) {
        data[v][id] = { ...data[v][id], bDel: true }
    }
    fs.writeFile('./json/mark.json', JSON.stringify(data), function (err) {
        if (err)
            console.log(err);
        else
            console.log('Write operation complete.');
    });
    res.json(data)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
