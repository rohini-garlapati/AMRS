const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const mongoose = require('mongoose')
const { exec } = require('child_process')
const path = require('path')

const port = process.env.PORT || 3000

const app = express()

const Register = require('./models/registers')
const MedicalReport = require('./models/medicalreports')

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

mongoose
  .connect('mongodb://localhost:27017/login_AMRS')
  .then(() => {
    console.log('Connection successful')
  })
  .catch((e) => {
    console.log('Connection unsuccessful')
  })

var db = mongoose.connection
db.on('error', () => console.log('Error in connecting to database'))
db.once('open', () => console.log('Connected to database'))

app.post('/sign_up', async (req, res) => {
  try {
    const password = req.body.password
    const cpassword = req.body.cpassword
    if (password === cpassword) {
      const registeruser = new Register({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cpassword: req.body.cpassword,
      })
      const registered = await registeruser.save()
      res.status(201).redirect('dashboard.html')
    } else {
      res.status(400).send({ message: 'Passwords do not match' })
    }
  } catch (error) {
    res.status(400).send('Registration Failed')
  }
})

app.post('/login', async (req, res) => {
  try {
    const lemail = req.body.lemail
    const lpassword = req.body.lpassword

    const useremail = await Register.findOne({ email: lemail })
    if (useremail.password === lpassword) {
      res.status(201).redirect('home.html')
    } else {
      res.send('Invalid email or password')
    }
  } catch (error) {
    res.status(400).send('Invalid Email')
  }
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

app.post('/upload', upload.single('fileInput'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.')
  }

  const filePath = path.join(__dirname, 'uploads', req.file.filename)

  // Escape the file path
  const escapedFilePath = `"${filePath.replace(/\\/g, '\\\\')}"`
  console.log(`Executing Python script with path: ${escapedFilePath}`)
  // Call the Python script
  const pythonExecutable = process.platform === 'win32' ? 'python' : 'python3'
  exec(
    `${pythonExecutable} python.py ${escapedFilePath}`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(`exec error: ${err}`)
        console.error(`stderr: ${stderr}`)
        return res.status(500).send('Error processing file.')
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`)
        return res.status(500).send('Error processing file.')
      }
      res.send(stdout)
    }
  )
})
app.post('/save-report', async (req, res) => {
  const filePath = req.body.filePath
  const summary = req.body.summary
  try {
    const newReport = new MedicalReport({ report: filePath, summary: summary })
    await newReport.save()
    res.send('Report and summary saved successfully.')
  } catch (error) {
    console.error(error)
    res.status(500).send('Error saving report and summary.')
  }
})

app.get('/past-summaries', async (req, res) => {
  try {
    const pastSummaries = await MedicalReport.find({})
    res.json(pastSummaries)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching past summaries.')
  }
})

app.get('/', (req, res) => {
  res.set({
    'Allow-access-Allow-Origin': '*',
  })
  return res.redirect('index.html')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
