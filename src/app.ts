import express from 'express'

const app = async () => {
    const app = express();

    app.get('/', (req, res, next) => {
        res.send("HELLO CAN I HELP YOU ?")
    })

    return app
}

export default app
