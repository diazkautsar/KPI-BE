import app from './app';

(async () => {
    try {
        const PORT = 3000
        const instance = await app()

        await instance.listen(PORT, () => {
            console.log("server running on port ", PORT)
        })
    } catch (error) {
        process.exit(1)
    }
})()
