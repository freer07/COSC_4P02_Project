  const { Client } = require('pg')
  /**
   * Gets course description
   * @title Get course description
   * @category Course Description
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
        port: 5432
      })

      client.connect()

      const text =
        'SELECT * FROM COURSES WHERE CODE LIKE $1 AND (TYPE LIKE $2 OR TYPE LIKE $3 OR TYPE LIKE $4 OR TYPE LIKE $5 OR TYPE LIKE $6 OR TYPE LIKE $7 OR TYPE LIKE $8) LIMIT 1 '
      const values = [courseCode, 'LEC', 'ONM', 'FLD', 'LEC2', 'ASY', 'SYN', 'BLD']

      await client
        .query(text, values)
        .then(res => {
          if (Object.keys(res.rows).length === 0) {
            fullString = 'We could not find details regarding this course.'
          } else {
            fullString = fullString + res.rows[0].title

            if (res.rows[0].description == '') {
              fullString = fullString + '\nNo description found.'
            } else {
              fullString = fullString + '\n' + res.rows[0].description
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