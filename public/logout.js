document.addEventListener('DOMContentLoaded', function () {
  const logoutLink = document.getElementById('logoutLink')
  const logoutPopup = document.getElementById('logoutPopup')
  const logoutYes = document.getElementById('logoutYes')
  const logoutCancel = document.getElementById('logoutCancel')

  logoutLink.addEventListener('click', function (event) {
    event.preventDefault()
    logoutPopup.style.display = 'block'
  })

  logoutCancel.addEventListener('click', function () {
    logoutPopup.style.display = 'none'
  })

  logoutYes.addEventListener('click', function () {
    window.location.href = 'index.html'
  })

  window.addEventListener('click', function (event) {
    if (event.target === logoutPopup) {
      logoutPopup.style.display = 'none'
    }
  })
})
