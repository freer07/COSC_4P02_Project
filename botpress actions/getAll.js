const { Client } = require('pg')

/**
 * Gets course description
 * @title Get course description
 * @category Course Description
 * @author Mike Tchoupiak
 */
const myAction = async () => {
  const data = event.nlu.entities

  var keyPhrase
  var courseName

  for (var i = 0; i < data.length; i++) {
    if (data[i].type == 'custom.list.keyPhrases') {
      keyPhrase = data[i].data.value
    }
    if (data[i].type == 'custom.pattern.courseName') {
      courseName = data[i].data.value
    }
  }

  if (keyPhrase == 'exam') {
    const courseCode = courseName.toUpperCase()
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

  if (keyPhrase == 'prerequisite') {
    const courseCode = courseName.toUpperCase()
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

  if (keyPhrase == 'term') {
    const courseCode = courseName.toUpperCase()
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

  if (keyPhrase == 'format') {
    const courseCode = courseName.toUpperCase()
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

  if (keyPhrase == 'professor') {
    const courseCode = courseName.toUpperCase()
    var fullString = courseCode + ', '

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
        'SELECT * FROM COURSES WHERE CODE LIKE $1 AND (TYPE LIKE $2 OR TYPE LIKE $3 OR TYPE LIKE $4 OR TYPE LIKE $5 OR TYPE LIKE $6 OR TYPE LIKE $7 OR TYPE LIKE $8) '
      const values = [courseCode, 'LEC', 'ONM', 'FLD', 'LEC2', 'ASY', 'SYN', 'BLD']

      await client
        .query(text, values)
        .then(res => {
          if (Object.keys(res.rows).length === 0) {
            session.details = 'We could not find details regarding this course.'
          } else {
            var professorList = []

            fullString = fullString + res.rows[0].title + ', is run by '

            res.rows.forEach(course => {
              const name = course.instructor.replace('Instructor: ', '')

              if (!professorList.includes(name)) {
                professorList.push(name)
              }
            })

            var tmp = 0
            professorList.forEach(item => {
              if (tmp == 0) {
                fullString = fullString + item
                tmp++
              } else {
                fullString = fullString + ' and ' + item
              }
            })
            session.details = fullString
          }
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

  if (keyPhrase == 'location') {
    const courseCode = courseName.toUpperCase()
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

      const text = 'SELECT location FROM COURSES WHERE CODE LIKE $1 LIMIT 1'
      const values = [courseCode]

      await client
        .query(text, values)
        .then(res => {
          if (Object.keys(res.rows).length === 0) {
            fullString = 'We could not find details regarding this course.'
          } else {
            if (res.rows[0].prereq == '') {
              fullString = fullString + 'Location data is unavailable'
            } else {
              fullString = fullString + res.rows[0].location.replace('Location: ', '') + '\n'
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

  if (keyPhrase == 'time') {
    const courseCode = courseName.toUpperCase()
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

  if (!keyPhrase) {
    const courseCode = courseName.toUpperCase()
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
        'SELECT * FROM COURSES WHERE CODE LIKE $1 AND (TYPE LIKE $2 OR TYPE LIKE $3 OR TYPE LIKE $4 OR TYPE LIKE $5 OR TYPE LIKE $6 OR TYPE LIKE $7 OR TYPE LIKE $8 OR TYPE LIKE $9 OR TYPE LIKE $10 OR TYPE LIKE $11) LIMIT 1 '
      const values = [courseCode, 'LEC', 'ONM', 'FLD', 'LEC2', 'ASY', 'SYN', 'BLD', 'SEM', 'LAB', 'CLI']

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
}

return myAction()