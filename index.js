// Sukurkite dainų ištrynimo funkcionalumą. Šalie kiekvienos dainos sąraše pridėkite mygtuką, kuris kreiptųsi į kelią "/delete/:id".
// Pasinaudodami mysql2 moduliu įvykdykite sql komandą ištrinti pasirinktą eilutę iš lentelės "songs".

// Sukurkite naujos dainos pridėjimą. Aprašykite HTML formą kuri perduotų duomenis POST metodu į naują kelią "/new".
// Formoje reikalingi šie laukeliai:
// Dainos pavadinimas,
// Albumas

// Sukurkite dainos redagavimo funkcionalumą. Jums prireiks naujos HTML formos, kurioje būtų atvaizduojami anksčiau išsaugotą dainos informacija.
// Patekimui į puslapį, prie kiekvienos dainos sąraše sukurkite mygtuką "Redaguoti" ant kurio paspaudus būtumėte nukreipiami į redagavimo puslapį.
// Informacijos išsaugojimui sukurkite naują kelią "/edit/:id", kuriame priimkite redaguotą laukelių informaciją ir išsaugokite duomenis duomenų bazėje.

// Po kiekvienos atliktos operacijos vartotojui grąžinkite atitinkamas žinutes.
// Stilizavimui pasitelkite norimus CSS karkasus (Bootstrap, Material etc.)


import express from 'express'
import { engine } from 'express-handlebars'
import mysql from 'mysql2/promise'

const app = express()

const port = process.env.PORT || 3000

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("views"));


const database = await mysql.createConnection({

  host:'pauliuspetrunin.lt',
  user:'bit',
  password: 'kulokas',
  database: 'GabijaZ'
})


// const database = await mysql.createConnection({

//     host:'localhost',
//     user:'root',
//     password: '',
//     database: 'spotify'
// })

app.get('/', async (req, res) => {
    const songs = await database.query(
        'SELECT id, song_Name, song_Album FROM songs')

    res.render('index', { songs: songs[0] })
})

// ištrynimas

app.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
    await database.query(`DELETE FROM songs WHERE id = ${id}`);
    res.redirect('/');
  });

// pridejimas

  app.post('/', async (req, res) => {
    const { song_Name, song_Album } = req.body;
    await database.query(
        
        'INSERT INTO songs (song_Name, song_Album) VALUES (?, ?)',
        [song_Name, song_Album]
      );
      res.redirect("/");

  })

// redagavimas

  app.get("/edit/:id", async (req, res) => {

      const id = req.params.id;
      console.log(id)
    const song = await database.query(
      `SELECT id, song_Name, song_Album FROM songs WHERE id = ${id}`
    );
    const dainos = song[0][0];
    
  
    res.render('edit', dainos);
  });

  app.post("/edit/:id", async (req, res) => {
    const id = req.params.id;
    const { song_Name, song_Album } = req.body;
    await database.query(
      "UPDATE songs SET song_Name = ?, song_Album = ? WHERE id = ?",
      [song_Name, song_Album, id]
    );
    res.redirect('/');
  });


//   palylistas

app.get("/playlists ", async (req, res) => {
    const playlists = await database.query(
      "SELECT id, name FROM playlists"
    );
    res.render("playlists", { playlists: playlists[0] });
  });

  app.post("/playlists", async (req, res) => {
    await database.query("INSERT INTO playlists (name, image) VALUES (?, ?)", [
      req.body.name,
      req.file.filename,
    ])

    console.log(req.file.filename);
    res.redirect('playlists', req.body.name, req.file.filename);
  });
  
  
  
  
app.listen(port)