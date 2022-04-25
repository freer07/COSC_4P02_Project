const { Client } = require('pg')
/**
 * Gets exam
 * @title Get exam
 * @category EXAM
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

    const text = 'SELECT * FROM EXAMS WHERE CODE LIKE $1 LIMIT 1 '
    var cCode = '%' + courseCode + '%'
    const values = [cCode]

    await client
      .query(text, values)
      .then(res => {
        if (Object.keys(res.rows).length === 0) {
          fullString = 'We could not find details regarding this course.'
        } else {
          fullString =
            fullString +
            res.rows[0].code +
            ' The exam is on ' +
            res.rows[0].startday +
            ' from ' +
            res.rows[0].starttime +
            ' - ' +
            res.rows[0].endtime +
            ' Location: ' +
            res.rows[0].loc
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