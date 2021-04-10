// const mongoose = require('mongoose')

// mongoose.Promise = global.Promise

// // Connect MongoDB at default port 27017.
// mongoose.connect('mongodb://s2.anpaitm.com:27017/film', {
//   user: 'film',
//   pass: 'ba7c9bcec7a',
//   useNewUrlParser: true,
//   useCreateIndex: true
// }, (err) => {
//   if (!err) {
//     console.log('MongoDB Connection Succeeded.')
//   } else {
//     console.log('Error in DB connection: ' + err)
//   }
// })

// const filmModel = mongoose.model('films', {
//   film_name: String,
//   pic: String
// })

// filmModel.create({ film_name: 'asdf', pic: 'dfsdfasdf' }, (err) => {
//   console.log(err)
// })

const mysql = require('mysql')
const pool = mysql.createPool({
  host: 's2.anpaitm.com',
  port: 13306,
  user: 'film',
  password: 'YP4FPPxAHKWmefwa',
  database: 'film'
})

const query = function(sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

async function doTest() {
  let res = await query('select * from film_list limit 1')
  res = JSON.parse(JSON.stringify(res))
  for (let film of res) {
    let info = await query(`select * from film_info where film_id=${film.id}`)
    const video = await query(`select * from video where film_id=${film.id}`)
    info = info[0]
    delete info.id
    delete info.uuid
    film = Object.assign(film, info)
    film = Object.assign(film, video[0])
    film.douban_genre = JSON.parse(film.douban_genre)
    film.actor = JSON.parse(film.actor)
    film.douban_initial_date = new Date((film.douban_initial_date).replace(/-/g, '/'))

    console.log(film)
  }

  await pool.end()
}

doTest()
// connection.query('select * from film_list limit 1', (err, result) => {
//   result.forEach(v => {
//     // const doc = {
//     //   id:v.id,
//     //   douban_genre:v.douban_genre
//     // }
//     console.log(v)
//   })
// })

// // connection.destroy()
// connection.end()
