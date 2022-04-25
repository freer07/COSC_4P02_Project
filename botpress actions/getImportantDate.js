const { Client } = require('pg')
/**
 * Gets important date information
 * @title Get date information
 * @category important date
 * @author Alex Freer
 */
const myAction = async () => {
  var dateSession
  //const year = new Date().getFullYear()
  var year = ''
  if (event.nlu.slots.session === undefined) {
    dateSession = ''
    console.log(dateSession + '<------ date session first')
  } else {
    dateSession = ''.concat(event.nlu.slots.session.value.toUpperCase())
    console.log(dateSession + '<------ date session second')
  }

  const occasion = ''.concat(event.nlu.slots.occasion.value.toUpperCase())

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

    var text
    var values

    if (dateSession == '') {
      text = 'SELECT * FROM IMPORTANT_DATES WHERE upper(OCCASION) LIKE $1'
      values = [occasion]
      console.log('first')
    } else {
      text = 'SELECT * FROM IMPORTANT_DATES WHERE upper(SESSION) LIKE $1 AND upper(OCCASION) LIKE $2 LIMIT 1'
      values = [dateSession, occasion]
      console.log('second')
    }
    console.log(values + 'HERERERERERE')
    await client
      .query(text, values)
      .then(res => {
        if (Object.keys(res.rows).length === 0) {
          fullString = 'We could not find details regarding this.'
        } else if (Object.keys(res.rows).length > 1) {
          for (let i = 0; i < Object.keys(res.rows).length; i++) {
            fullString = fullString + res.rows[i].occasion
            fullString = fullString + '\t' + res.rows[i].date
            fullString = fullString + '\n'
          }
        } else {
          fullString = fullString + res.rows[0].occasion

          if (res.rows[0].date == '') {
            fullString = fullString + '\nNo date found.'
          } else {
            fullString = fullString + '\n' + res.rows[0].date
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