const express = require("express")
const cors = require("cors")
const {
  initializeMetrics,
  metricsRouter,
  metricsMiddleware
} = require("../src/utils/metrics")

require("dotenv").config()

const app = express()
const port = process.env.PORT
const apiRouter = require("./routes")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// 🔧 INITIALISATION DES MÉTRIQUES
initializeMetrics("authentification")

// 📊 MIDDLEWARE MÉTRIQUES
app.use(metricsMiddleware)

// 🛣️ ROUTES MÉTRIQUES
app.use(metricsRouter)

app.get("/", (_, res) => {
  res.send("Welcome to the API")
})
app.use("/api", apiRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
