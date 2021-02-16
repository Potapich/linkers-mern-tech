const express = require('express')
const config = require('config')
// const config_mongo = require('./config/config_mongo')
const path = require('path')
const mongoose = require('mongoose')

const app = express()

app.use(express.json({extended: true}))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'my-app', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'my-app', 'build', 'index.html'))
    })
}

const PORT = config.get('port') || 5000

let urlDB = config.get('mongoURL')//'mongodb://' + config_mongo.user + ':' + config_mongo.password + '@' + config_mongo.rootlink + ',' + config_mongo.secondarylink
const dbName = 'mern';//config_mongo.database

async function start() {
    try {
        await mongoose.connect(urlDB + "/" + dbName, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        })
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()
app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
