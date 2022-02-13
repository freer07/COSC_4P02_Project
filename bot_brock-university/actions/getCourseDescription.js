  const { Client } = require('pg')
  const description = ''

  /**
   * Gets course description
   * @title Get course description
   * @category Course Description
   * @author Mike Tchoupiak
   */
  const myAction = async () => {
    const courseName = event.nlu.slots.courseName.value.toUpperCase();


    try {
      const client = new Client({
        user: 'masterbotaccess',
        host: 'botpressdb.ctor5sx6le6s.ca-central-1.rds.amazonaws.com',
        database: 'brockcollection',
        password: 'Ilikechicken',
        port: 5432
      })

      client.connect()
      bp.logger.info(courseName)

      const text = 'SELECT * FROM COURSES WHERE CODE LIKE $1 LIMIT 1'
      const values = [courseName]

      await client
        .query(text, values)
        .then(res => {
          this.description = res.rows[0].description
          temp.details = this.description
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