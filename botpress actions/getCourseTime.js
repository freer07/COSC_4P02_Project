const { Client } = require('pg')
/**
 * Gets the time and day for a course
 * @title Get time and day for course.
 * @category Course time
 * @author Aamir Dhanani
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

    const text = 'SELECT time,days FROM COURSES WHERE CODE LIKE $1 LIMIT 1'
    const values = [courseCode]

    await client
      .query(text, values)
      .then(res => {
        if (Object.keys(res.rows).length === 0) {
          fullString = 'We could not find details regarding this course.'
        } else {
          if (res.rows[0].time == '') {
            fullString = fullString + 'There is no time data available'
          } else {
            fullString =
              fullString +
              'Time: ' +
              res.rows[0].time.replace('Time: ', '') +
              '\n' +
              'On : ' +
              res.rows[0].days.replace('On : ', '')
          }
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