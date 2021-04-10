// Import required AWS SDK clients and commands for Node.js
const {
    S3Client,
    CreateBucketCommand,
    PutBucketWebsiteCommand,
    ListBucketsCommand,
    GetBucketWebsiteCommand,
    GetBucketCorsCommand,
    PutBucketCorsCommand,
    DeletePublicAccessBlockCommand,
    PutObjectCommand,
    PutBucketPolicyCommand
} = require("@aws-sdk/client-s3");


const fs = require("fs")
const path = require("path")
const _Display = require('../display/bars');

const boxen = require('boxen');
const chalk = require('chalk');

exports.getBuckets = (req, res) => {

    

    // Cria um cliente do S3
    const s3 = new S3Client({
        region: req.body.region
    });

    const run = async () => {

        try {
            _Display.line()
            console.log('Request - All buckets in your account')
            _Display.line()

            const data = await s3.send(new ListBucketsCommand({}))
            console.log(chalk.green('- Response'),'/ success')
            console.table(data.Buckets)
            res.send(data.Buckets)

        } catch (err) {
            console.log(chalk.red('- Response'),'/ error')
            console.log(err)
        }
        _Display.strongLine()
    }
    run()
}

exports.createBucket = (req, res) => {

    //Define os parametros do bucket
    bucketParams = {
        Bucket: req.body.bucket
    };

    // Cria um cliente do S3
    const s3 = new S3Client({
        region: req.body.region
    });

    //Cria o bucket com base nos parametros
    const run = async () => {

        try {

            _Display.line()
            console.log('Request - Create a new bucket')
            _Display.line()

            const data = await s3.send(new CreateBucketCommand(bucketParams));
            console.log(''),
                console.log("New bucket created."),
                console.log(''),
                console.log('  Bucket name: ', bucketParams.Bucket),
                console.log('  Region : ', req.body.region),
                _Display.strongLine()

            res.send({
                Bucket: bucketParams.Bucket,
                Region: req.body.region
            })

        } catch (err) {
            console.log(" - Bucket creation failed")
            console.log('')
            console.log(' - Error details: ')
            console.log('')
            console.log(err)
            _Display.strongLine()
            res.send(err)
        }
    };
    run();
}

exports.putbucektPolicy = (req, res) => {
    // Cria um cliente do S3
    const s3 = new S3Client({
        region: req.body.region
    });

    const params = {
        Bucket: req.body.bucket,
        Policy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [{
                Sid: "PublicReadGetObject",
                Effect: "Allow",
                Principal: "*",
                Action: "s3:GetObject",
                Resource: `arn:aws:s3:::${req.body.bucket}/*`
            }]
        })
    }

    console.log(JSON.stringify(params.Policy))
    const run = async () => {

        try {
            console.log("")
            console.log(`Definindo politica`)
            _Display.line()
            const data = await s3.send(new PutBucketPolicyCommand(params))

            console.log('Sucesso', data)
            res.send(data)

        } catch (err) {
            console.log('Erro', err)
        }
        _Display.strongLine()
    }
    run()
}

exports.hasWebSiteConfiguration = (req, res) => {

    const bucketParams = {
        Bucket: req.body.bucket
    };

    // Create S3 service object
    const s3 = new S3Client({
        region: req.body.region
    });

    const run = async () => {
        try {
            console.log('')
            console.log(`Checking ${req.body.bucket} bucket site settings`)
            _Display.line()

            const data = await s3.send(new GetBucketWebsiteCommand(bucketParams));
            console.log("")
            console.log("The bucket is enabled for websites");
            console.log(data)
            _Display.spaceLine()
            res.send(data)

        } catch (err) {
            console.log("The bucket is not enabled for websites");
            console.log(data)
            res.send(err)
        }
        _Display.strongLine()
    };


    run();
}

exports.getCors = (req, res) => {

    // Create the parameters for calling
    const bucketParams = {
        Bucket: req.body.bucket
    };

    // Create S3 service object
    const s3 = new S3Client({
        region: req.body.region
    });

    const run = async () => {
        try {
            console.log('')
            const message = await console.log(`Obtaining CORS settings from the ${req.body.bucket} bucket`)
            _Display.line()
            const data = await s3.send(new GetBucketCorsCommand(bucketParams));
            console.log("CORS", data.CORSRules);

            res.send(data)
        } catch (err) {
            console.log("Error getting CORS configuration", err);
            res.send(err)
        }
        _Display.strongLine()
    };
    run();
}

exports.setCors = (req, res) => {

    async function run() {

        // Create initial parameters JSON for putBucketCors
        const thisConfig = {
            AllowedHeaders: ["Authorization"],
            AllowedMethods: req.body.methods,
            AllowedOrigins: ["*"],
            ExposeHeaders: [],
            MaxAgeSeconds: 3000,
        };

        // Create array of configs then add the config object to it
        const corsRules = new Array(thisConfig);

        // Create CORS params
        const corsParams = {
            Bucket: req.body.bucket,
            CORSConfiguration: {
                CORSRules: corsRules
            },
        };

        // Create S3 service object
        const s3 = new S3Client({
            region: req.body.region
        });

        try {
            console.log('')
            console.log(`Defining new CORS configuration for the ${req.body.bucket} bucket`)
            console.log('   - Methods:', req.body.methods)
            _Display.line()
            const data = await s3.send(new PutBucketCorsCommand(corsParams));
            console.log('')
            console.log("Success", data);
            res.send(data)
        } catch (err) {
            console.log("Error", err);
            res.send(err)
        }

        _Display.strongLine()
    }
    run();
}

exports.enableWebSiteHosting = (req, res) => {

    const staticHostParams = {
        Bucket: req.body.bucket,
        WebsiteConfiguration: {
            ErrorDocument: {
                Key: 'erro.html'
            },
            IndexDocument: {
                Suffix: 'index.html'
            }
        }
    };

    // Create S3 service object
    const s3 = new S3Client({
        region: req.body.region
    });

    const run = async () => {
        // Insert specified bucket name and index and error documents into params JSON
        // from command line arguments
        // set the new website configuration on the selected bucket
        try {
            console.log("")
            console.log(`Enabling site configuration for the ${req.body.bucket} bucket`)
            _Display.line()
            let data = await s3.send(new PutBucketWebsiteCommand(staticHostParams));
            console.log("Success", data);
            res.send(data)
        } catch (err) {
            console.log("Error", err);
            res.send(data)
        }
        _Display.strongLine()
    };
    run();
}

exports.enablePublicAccess = (req, res) => {

    const s3 = new S3Client({
        region: req.body.region
    })

    const bucketParams = {
        Bucket: req.body.bucket
    }

    async function run() {

        try {
            console.log('')
            console.log('Enabling public access')
            _Display.line()
            const data = await s3.send(new DeletePublicAccessBlockCommand(bucketParams))
            console.log("Success public access", data)
            _Display.strongLine()
            res.send(data)
        } catch (err) {
            console.log("Error", err)
            res.send(err)
        }

    }
    run()
}

//Lista os Endpoints de site estatico da Amazon
exports.AmazonS3WebsiteEndpoints = (req, res) => {
    const regions = require('../../regions')
    console.log('')
    console.log("S3 endpoints available:")
    console.log('')
    console.log(regions.listS3WebSiteEndpoints())
    res.send(regions.returnEndpointsInJSON())
    _Display.strongLine()
}


exports.createObject = (req, res) => {

    const s3 = new S3Client({
        region: req.body.region
    })

    async function run() {

        try {

            const indexHTML = path.resolve('exPages', 'index.html')

            console.log(indexHTML)
            let fileContent = fs.readFileSync(indexHTML)

            let params = {
                Bucket: req.body.bucket,
                Key: path.basename(indexHTML),
                Body: fileContent,
            }

            console.log('Upload do arquivo index')
            let data = await s3.send(new PutObjectCommand(params))
            console.log('Upload concluido', data)
            res.send(data)


        } catch (error) {
            console.log('Erro', error)
            res.send(error)
        }
    }
    run()
}


// exports.objectPublic = (req, res) => {
//     const s3 = new S3Client({
//         region: req.body.region
//     })

//     async function run() {

//         let params = {
//             Bucket: req.body.bucket,
//             Key: path.basename('../erro.html'),
//         }

//         try {

//             console.log('Upload do arquivo base')
//             const data = await s3.send(new PutObjectCommand(params))
//             console.log('Upload concluido', data)
//             res.send(data)

//         } catch (error) {
//             console.log('Erro', error)
//             res.send(error)
//         }


//     }


//     run()
// }