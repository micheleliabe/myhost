//Configurando o arquivo de rotas
const express = require('express')
const route = express.Router()

//Importa o SDK da AWS
const S3 = require('./aws/s3')


route.use(express.json({extended : true}))

//Definindo as rotas

route.get('/',(req, res) => {
    console.log('Rota OK')
    res.send('<h1>My Host is OK</h1>')
})

//Cria um novo bucket na conta da AWS
route.post('/createS3bucket',S3.createBucket)

route.get('/AmazonS3WebsiteEndpoints',S3.AmazonS3WebsiteEndpoints)

//Altera as configuraçao de sites estaticos em um bucket 
route.put('/enableWebSiteHosting',S3.enableWebSiteHosting)

//Verifica se um bucket esta habilitado para sites estaticos
route.get('/hasWebSiteConfiguration',S3.hasWebSiteConfiguration)

//Verifica a configuraçao de CORS atual em um determinado bucket
route.get('/getCors',S3.getCors)

//Define as configuraçao de CORS para um determinado bucket
route.put('/setCors',S3.setCors)

route.get('/getBuckets',S3.getBuckets)

route.put('/enablePublicAccess',S3.enablePublicAccess)

route.post('/createObject',S3.createObject)

route.put('/putbucektPolicy',S3.putbucektPolicy)



route.post('/createSite',S3.createSite)



//exporta as rotas
module.exports = route

