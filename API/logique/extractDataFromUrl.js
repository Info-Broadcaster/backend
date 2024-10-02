const puppeteer = require('puppeteer');

async function extractDataFromUrl(url, xpath) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1000,
        height: 1000,
    });

    await page.goto(url);

    const body = await page.evaluate((xpath) => {
        if (xpath) {
            const result = document.evaluate(
                xpath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;
            return result ? result.innerText : null;
        }
        return document.body.innerText;
    }, xpath);

    // const body = `Le Premier ministre prononce cette déclaration devant l’Assemblée nationale. Généralement, au même moment, celle-ci est lue à la tribune du Sénat par un autre membre du gouvernement.
    //
    //
    // Veuillez fermer la vidéo flottante pour reprendre la lecture ici.
    //
    //     En janvier dernier, lorsque Gabriel Attal a fait ce fameux discours devant les députés, son texte était lu par Bruno Le Maire, aux sénateurs. Ce dernier avait provoqué des gloussements de son public lorsqu’il avait indiqué « être né en 1989 », lisant mot pour mot, ceux du Premier ministre à l’époque.
    //
    //     Est-ce que le discours de politique général est obligatoire ?
    //     Dans la Constitution de la Ve République, ce discours est simplement mentionné et ne rend pas l’exercice « obligatoire ». Mais cette étape s’est systématisée au fil des années et est devenue une « coutume républicaine ».
    //
    // Le site vie-publique.fr a recensé les déclarations de politique générale prononcées après la formation d’un nouveau gouvernement depuis celle prononcée par Michel Debré en 1959.`;

    await browser.close();

    return body.replace(/\s+/g, ' ');
}

module.exports = extractDataFromUrl;
