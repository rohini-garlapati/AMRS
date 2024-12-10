const mongoose = require('mongoose')
const reportschema = new mongoose.Schema(
  {
    report: String,
    summary: String,
  },
  { collection: 'MedicalReport' }
)

const MedicalReport = new mongoose.model('MedicalReport', reportschema)
module.exports = MedicalReport
