const { Client } = require('pg')
/**
 * Gets the format of the course.
 * @title Get format for course.
 * @category Course Format
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

    const text = 'SELECT format FROM COURSES WHERE CODE LIKE $1 LIMIT 1'
    const values = [courseCode]

    await client
      .query(text, values)
      .then(res => {
        if (Object.keys(res.rows).length === 0) {
          fullString = 'We could not find details regarding this course.'
        } else {
          fullString = fullString + res.rows[0].format.replace('Format: ', '') + '\n'
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