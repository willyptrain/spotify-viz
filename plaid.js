const axios = require('axios')


data = {
    "name": "Nick Figgins",
    "email": "nef7xb@virginia.edu",
    "resume": "http://www.nickfiggins.com/resume.pdf",
    "phone": "540-409-8872", // optional
    "github": "github.com/nickfiggins", // optional
    "twitter": "", // optional
    "website": "http://www.nickfiggins.com", // optional
    "location": "New York City", // optional
    "favorite_candy": "heath bar", // optional
    "a_project_im_proud_of": "http://www.spotipie.com"
  }
axios
  .post('https://contact.plaid.com/jobs', data)
  .then(res => {
    console.log(`statusCode: ${res.statusCode}`)
    console.log(res)
  })
  .catch(error => {
    console.error(error)
  })