
const { Client } = require('pg')
/**
 * Gets the term of the course.
 * @title Get term of course.
 * @category Term Course
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
      'SELECT title, full_duration FROM COURSES top WHERE CODE LIKE $1 AND (TYPE LIKE $2 OR TYPE LIKE $3 OR TYPE LIKE $4 OR TYPE LIKE $5 OR TYPE LIKE $6 OR TYPE LIKE $7 OR TYPE LIKE $8) GROUP BY title, full_duration'
    const values = [courseCode, 'LEC', 'ONM', 'FLD', 'LEC2', 'ASY', 'SYN', 'BLD']

    await client
      .query(text, values)
      .then(res => {
        if (Object.keys(res.rows).length === 0) {
          fullString = 'We could not find details regarding this course.'
        } else {
          fullString = courseCode + ', ' + res.rows[0].title + ', ' + 'run the following terms: \n'

          res.rows.forEach(item => {
            fullString = fullString + item.full_duration.replace('Duration: ', '') + '\n'
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