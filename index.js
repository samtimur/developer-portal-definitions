const fs = require("fs");
const path = require('path');

/**
 * Builds a row into the csv file that will be used to import APIs
 * @param {String} fileString the uri of the swagger file in which we are building a csv row for
 * @returns {[String]} the csv row generated for an api
 */
function buildCsvRow(fileString) {
    // Read swagger doc
    const data = fs.readFileSync(`./swagger/${fileString}`, 'utf8')
    const swaggerJson = JSON.parse(data)

    // Build CSV Row
    const headline = `${swaggerJson['info']['title']} ${swaggerJson['info']['version']}`
    // Build article URL by taking out the .json and any whitespaces
    const url = headline.replace(".json", "").replace(" ", "")
    const subHeadline = ""
    const slug = headline.replace(' ', '')
    const author = ""
    const body = `<h2>https://${swaggerJson['host']}${swaggerJson['basePath']}</h2><redoc spec-url="https://raw.githubusercontent.com/byu-oit/developer-portal-definitions/main/swagger/${fileString}"></redoc><script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>`
    const seoTitle = ""
    const seoDescription = ""
    const seoKeywords = ""
    const tags = ""



    // Get today's date to build last updated property
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var mm = today.toLocaleString('en-us', { month: 'short' });
    var yyyy = today.getFullYear();

    // Build last updated string off date
    const lastUpdated = `${dd}-${mm}-${yyyy}`
    
    // Create the string array which will then be returned
    const csvRow = [headline, subHeadline, slug, author, body, seoTitle, seoDescription, seoKeywords, tags, url, lastUpdated]
    return csvRow
}

/** 
 * Goes through the swagger directory to build api documentation pages that can be imported into brightspot using a csv file
*/
async function main() {
    // Create csv file
    const header = String(["Headline","Sub Headline","Slug","Author Title","Body","SEO Title","SEO Description","SEO Keywords","Tags","URL","Update Date"])
    fs.writeFileSync("apis.csv", header, "utf-8")

    // Look in swagger directory
    const directoryPath = path.join(__dirname, './swagger');
    fs.readdirSync(directoryPath).map(fileName => {
        try {
            console.log(fileName)
            const csvRow = buildCsvRow(fileName)
            fs.appendFileSync("./apis.csv", String(`\n`+csvRow))
        } catch (error) {
            console.error(error)
        }
    })
}

main()