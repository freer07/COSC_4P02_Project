  const { Client } = require('pg')
  /**
   * Gets professors name
   * @title Gets professors name
   * @category Professor Name
   * @author Mike Tchoupiak
   */
  const myAction = async () => {
    
    const courseCode = event.nlu.slots.courseName.value.toUpperCase()
    var fullString = courseCode + ', '

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
        'SELECT * FROM COURSES WHERE CODE LIKE $1 AND (TYPE LIKE $2 OR TYPE LIKE $3 OR TYPE LIKE $4 OR TYPE LIKE $5 OR TYPE LIKE $6 OR TYPE LIKE $7 OR TYPE LIKE $8) '
      const values = [courseCode, 'LEC', 'ONM', 'FLD', 'LEC2', 'ASY', 'SYN', 'BLD']

      await client
        .query(text, values)
        .then(res => {
          var professorList = []
          fullString = fullString + res.rows[0].title + ', is run by '

          res.rows.forEach(course => {
            bp.logger.info(course.instructor)
            const name = course.instructor.replace('Instructor: ', '')

            if (!professorList.includes(name)) {
              professorList.push(name)
              bp.logger.info(name)
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
        })
        .catch(e => console.error(e.stack))
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Request failed with status code 401. Have you set up your OpenWeather API Key properly?')
      }
      throw error
    }
  }
  

  return myAction()