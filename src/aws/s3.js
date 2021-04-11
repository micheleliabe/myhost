// Import modules
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
const _Display = require('../display/_Display');


const chalk = require('chalk');


exports.getBuckets = (req, res) => {

    return new Promise((resolve, reject) => {
        const s3 = new S3Client({
            region: req.body.region
        });

        const run = async () => {

            try {
                _Display.line()
                console.log(chalk.blueBright('Request - All buckets in your account'))
                _Display.line()

                const data = await s3.send(new ListBucketsCommand({}))
                console.log('- Response - ', chalk.green('success')),
                    console.table(data.Buckets)
                resolve(data)

            } catch (err) {
                console.log('-Response - ', chalk.red('error')),
                    console.log(err)
                reject(err)
            }

        }
        run()
    })


}

exports.createBucket = (req, res) => {
    return new Promise((resolve, reject) => {
        const s3 = new S3Client({
            region: req.body.region
        });

        bucketParams = {
            Bucket: req.body.bucket,
            Region: req.body.region
        };

        const run = async () => {

            try {

                _Display.line()
                console.log(chalk.blueBright('Request - Create a new bucket'))
                _Display.line()

                const data = await s3.send(new CreateBucketCommand(bucketParams));
                console.log('-Response - ', chalk.green('success'))
                console.log('')
                console.log("-New bucket created.")
                console.table(bucketParams)
                resolve(data)

            } catch (err) {
                console.log('-Response - ', chalk.red('error')),
                    console.log('')
                console.log(' Error details: ')
                console.log('')
                console.log('', chalk.yellow(err.Code))
                reject(err)
            }
        };
        run();
    })



}

exports.putbucektPolicy = (req, res) => {
    return new Promise((resolve, reject) => {

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

        const run = async () => {

            try {
                _Display.line()
                console.log(chalk.blueBright('Request - Define new bucket policy'))
                _Display.line()
                const data = await s3.send(new PutBucketPolicyCommand(params))
                console.log('-Response - ', chalk.green('success'))
                console.log('')
                console.log('Policy')
                console.log('')
                console.log(JSON.parse(params.Policy))
                resolve(data)

            } catch (err) {
                console.log('-Response - ', chalk.red('error')),
                    console.log('')
                console.log(' Error details: ')
                console.log('')
                console.log('', chalk.yellow(err))
                reject(err)
            }

        }
        run()
    })

}

exports.enablePublicAccess = (req, res) => {
    return new Promise((resolve, reject) => {
        const s3 = new S3Client({
            region: req.body.region
        })

        const bucketParams = {
            Bucket: req.body.bucket
        }

        async function run() {

            try {
                _Display.line()
                console.log(chalk.blueBright('Request - Enable public access in bucket', req.body.bucket))
                _Display.line()
                const data = await s3.send(new DeletePublicAccessBlockCommand(bucketParams))
                console.log('-Response - ', chalk.green('success'))
                console.log('')
                console.log(data)
                resolve(data)
            } catch (err) {
                console.log('-Response - ', chalk.red('error'))
                console.log('')
                console.log(' Error details: ')
                console.log('')
                console.log('', chalk.yellow(err))
                reject(err)
            }

        }
        run()
    })
}

exports.hasWebSiteConfiguration = (req, res) => {

    return new Promise((resolve, reject) => {
        const bucketParams = {
            Bucket: req.body.bucket
        };

        // Create S3 service object
        const s3 = new S3Client({
            region: req.body.region
        });

        const run = async () => {
            try {

                _Display.line()
                console.log(chalk.blueBright('Request -', `Checking ${req.body.bucket} bucket site settings`))
                _Display.line()
                const data = await s3.send(new GetBucketWebsiteCommand(bucketParams));
                console.log('-Response - ', chalk.green('success'))
                console.log('')
                console.log("")
                console.log(data)
                resolve(data)

            } catch (err) {

                console.log('-Response - ', chalk.red('error'))
                if (err.Code == "NoSuchBucket") {
                    console.log(' Bucket not found')
                    console.log(' Error details: ')
                    console.log('', chalk.yellow(err))
                    console.log('')
                } else {
                    console.log('')
                    console.log(" The bucket is not enabled for websites");
                    console.log('')
                    reject(err)
                }

            }

        };


    })
    run();
}

exports.enableWebSiteHosting = (req, res) => {
    // set the new website configuration on the selected bucket
    return new Promise((resolve, reject) => {
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
            try {
                _Display.line()
                console.log(chalk.blueBright(`Request - Enabling site configuration for the ${req.body.bucket} bucket`))
                _Display.line()
                let data = await s3.send(new PutBucketWebsiteCommand(staticHostParams));
                console.log('-Response - ', chalk.green('success'))
                console.log('')
                console.log(chalk.gray('  The setting for static sites has been enabled'))
                console.log('')
                console.log(' ', data)
                resolve(data)
            } catch (err) {
                console.log('-Response - ', chalk.red('error'))
                console.log('')
                console.log(' Error details: ')
                console.log('')
                console.log('', chalk.yellow(err))
                reject(err)
            }

        };
        run();
    })
}

exports.getCors = (req, res) => {
    return new Promise((resolve, reject) => {
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
                _Display.line()
                console.log(chalk.blueBright(`Request - Obtaining CORS settings from the ${req.body.bucket} bucket`))
                _Display.line()
                const data = await s3.send(new GetBucketCorsCommand(bucketParams));
                console.log('-Response - ', chalk.green('success'))
                console.log('')
                console.log(chalk.gray(' CORS rules found '))
                console.log('')
                console.log('   Allowed methods: ', data.CORSRules[0].AllowedMethods)
                console.log('   Allowed origins: ', data.CORSRules[0].AllowedOrigins)
                resolve(data)
            } catch (err) {
                console.log('-Response - ', chalk.red('error'))
                console.log('')
                console.log(chalk.gray('   Error getting CORS configuration'));
                console.log('')
                console.log(' Error details: ')
                console.log('')
                console.log('', chalk.yellow(err))
                reject(err)
            }

        };
        run();
    })

}

exports.setCors = (req, res) => {
    return new Promise((resolve, reject) => {

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
                _Display.line()
                console.log(chalk.blueBright(`Request - Defining new CORS configuration for the ${req.body.bucket} bucket`))
                console.log(chalk.gray('- Methods:', req.body.methods))
                _Display.line()
                const data = await s3.send(new PutBucketCorsCommand(corsParams));
                console.log('-Response - ', chalk.green('success'))
                console.log('')
                console.log(chalk.gray('  CORS rules defined'))
                console.log('')
                console.log(' ', data)
                resolve(data)

            } catch (err) {
                console.log('-Response - ', chalk.red('error'))
                console.log('')
                console.log(' Error details: ')
                console.log('')
                console.log('', chalk.yellow(err))
                reject(err)
            }

        }
        run();
    })
}

exports.createObject = (req, res) => {
    return new Promise((resolve, reject) => {
        const s3 = new S3Client({
            region: req.body.region
        })

        async function run() {

            try {

                const indexHTML = path.resolve('exPages', 'index.html')
                let fileContent = fs.readFileSync(indexHTML)

                let params = {
                    Bucket: req.body.bucket,
                    Key: path.basename(indexHTML),
                    Body: fileContent,
                }

                _Display.line()
                console.log(chalk.blueBright('Request - Upload files'))
                _Display.line()
                let data = await s3.send(new PutObjectCommand(params))
                console.log(chalk.gray('Upload complete'))
                console.log('')
                console.log('', data)
                resolve(data)

            } catch (error) {
                console.log('Erro', error)
                reject(error)
            }
        }
        run()
    })
}



//Lista os Endpoints de site estatico da Amazon
exports.AmazonS3WebsiteEndpoints = (req, res) => {

    const regions = require('../../regions')
    _Display.line()
    console.log(chalk.blueBright("S3 endpoints available:"))
    _Display.line()
    console.table(regions.listS3WebSiteEndpoints(), ['name', 'endpoint'])
    res.send(regions.returnEndpointsInJSON())

}


exports.createSite = async (req, res) => {
    try {
        let data = await this.createBucket(req, res)
        data = await this.enablePublicAccess(req, res)
        data = await this.putbucektPolicy(req, res)
        data = await this.enableWebSiteHosting(req, res)
        data = await this.createObject(req, res)
        res.send({
            siteOnline: true
        })
    } catch (error) {
        console.log('err')
    }
}