  const { Client } = require('pg')
  /**
   * Grabs the prereqs for a given course.
   * @title Get the prereqs.
   * @category Course Prerequisites
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
            fullString = courseCode + ', ' + res.rows[0].title + ', '
            if (res.rows[0].prereq == '') {
              fullString = fullString + 'has no prerequisites.'
            } else {
              fullString =
                fullString +
                'has the prerequistie(s) ' +
                res.rows[0].prereq.replace('Prerequisites: Prerequisite(s): ', '')
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