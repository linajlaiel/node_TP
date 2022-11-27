const express = require('express')
const app = express()
const port = 3000
const unzip = require('unzip-stream')


app.get('/tp', (req, res) => {
    const telechargement = require('download');
    const fs = require('fs')
    const csv = require('csv-parser')
    const results = [];

    telechargement('https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip', 'data').then(() => {
        fs.createReadStream('data/StockEtablissementLiensSuccession_utf8.zip')
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
            const file = entry.path;
            const type = entry.type;
            const size = entry.size;
            if (file === "StockEtablissementLiensSuccession_utf8.csv") {
                entry.pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    const transfert = results.filter(result => result.transfertSiege == 'true')
                    const percent = transfert.length / results.length * 100
                    let resultat = percent.toFixed(1)
                    res.send(`Depuis le 1er Novembre 2022 il y a environ ${resultat}% d'entreprises qui ont transféré leur siège social`)
                } )
            } else {
                entry.autodrain();
            }
        });
})
})

app.listen(port, () => console.log(`Mon rendu du TP est sur localhost:${port}/tp`))
