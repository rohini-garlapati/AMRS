document.querySelector('form').addEventListener('submit', async (event) => {
  event.preventDefault()

  const formData = new FormData(event.target)
  const response = await fetch('/upload', {
    method: 'POST',
    body: formData,
  })

  const summary = await response.text()
  document.getElementById('summaryOutput').value = summary

  // Send the summary and file path to the server for saving
  const filePath = formData.get('fileInput').name // Assuming you want to save the file name
  await saveReportToServer(filePath, summary)
})

async function saveReportToServer(filePath, summary) {
  const data = { filePath, summary }
  const response = await fetch('/save-report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (response.ok) {
    console.log('Report and summary saved successfully')
  } else {
    console.error('Error saving report and summary')
  }
}
