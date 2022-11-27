const express = require('express')
const app = express()
const port = 3000


app.get('/tp', (req, res) => {

    const fs = require('fs')
    const csv = require('csv-parser')
    const results = [];
    fs.createReadStream('data.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const transferts = results.filter(result => result.transfertSiege == 'true')
            const percent = transferts.length / results.length * 100
            let resultat = percent.toFixed(1)
            res.send(`Il y a environ ${resultat} % des compagnies qui ont transféré leur siège social depuis le 1er Novembre 2022`)
        }
    );
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))