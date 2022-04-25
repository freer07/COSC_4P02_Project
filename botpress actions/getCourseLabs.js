const { Client } = require('pg')
/**
 * Gets the labs for a course.
 * @title Get course labs.
 * @category Course Labs
 * @author Mike Tchoupiak
 */
const myAction = async () => {
  const courseCode = event.nlu.slots.courseName.value.toUpperCase()
  var fullString = ''

  try {
    const client = new Client({
      user: '',
      host: '',
      database: '',
      password: '',
      port: 0000
    })

    client.connect()

    const text =
      'SELECT * FROM COURSES top INNER JOIN ( SELECT duration, section, COUNT(section) AS numlabs FROM COURSES WHERE code LIKE $1 AND type LIKE $2 GROUP BY section, duration ) totalNum ON top.section = totalNum.section AND top.duration = totalNum.duration WHERE code LIKE $1 AND type LIKE $2 ORDER BY top.duration, top.section, top.type'
    const values = [courseCode, 'LAB%']

    await client
      .query(text, values)
      .then(res => {
        if (Object.keys(res.rows).length === 0) {
          fullString = courseCode + ', ' + 'does not appear to have labs.'
        } else {
          var previousSection = ''
          var previousDuration = ''

          res.rows.forEach(item => {
            if (previousDuration !== item.duration || previousSection !== item.section) {
              fullString =
                fullString +
                courseCode +
                ', ' +
                item.title +
                ', running in ' +
                item.duration +
                ', has ' +
                item.numlabs +
                ' labs in ' +
                item.section +
                '. \n ----------------------' +
                '\n'
              previousDuration = item.duration
              previousSection = item.section
            }

            fullString =
              fullString +
              item.type +
              ' runs ' +
              item.days +
              ' from \n' +
              item.time +
              ' @ ' +
              item.location.replace('Location: ', '') +
              '\n \n'
          })
        }
        session.details = fullString
      })

      .catch(e => {
        bp.logger.error(e)
        session.details = 'Looks like we having a network issue. Try again.'
      })
    await client.end()
  } catch (error) {
    bp.logger.error(error)
    session.details = 'Looks like we having a network issue. Try again.'
    throw error
  }
}

return myAction()