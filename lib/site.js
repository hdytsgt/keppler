// Dependencies
const express = require('express')
const helmet = require('helmet')
const http = require('http')
const colors = require('colors')
const path = require('path')

/**
 * Site class
 */
class Site
{
    /**
     * Constructor
     */
    constructor(_config, _success, _alreadyRunning, _error)
    {
        this.config = _config
        this.success = _success
        this.alreadyRunning = _alreadyRunning
        this.error = _error

        this.setExpress()
        this.setServer()
    }

    /**
     * Set express
     * Start express and set controllers
     */
    setExpress()
    {
        // Set up
        this.express = express()
        this.express.use(helmet())
        this.express.set('view engine', 'pug')
        this.express.set('views', path.join(__dirname, 'views'))
    }

    /**
     * Set server
     */
    setServer()
    {
        // Set up
        this.server = http.createServer(this.express)

        // Error event
        this.server.on('error', (error) =>
        {
            // Server already running
            if(error.code === 'EADDRINUSE')
            {
                if(this.config.debug >= 1)
                {
                    console.log('site'.green.bold + ' - ' + 'already running'.cyan)
                }

                // Callback
                if(typeof this.alreadyRunning === 'function')
                {
                    this.alreadyRunning()
                }

                return
            }
            else
            {
                if(this.config.debug >= 1)
                {
                    console.log('site'.green.bold + ' - ' + 'unknow error'.cyan)
                    console.log(error)
                }

                // Callback
                if(typeof this.error === 'function')
                {
                    this.alreadyRunning()
                }
            }
        })

        // Start
        this.server.listen(this.config.port, () =>
        {
            // URL
            if(this.config.debug >= 1)
            {
                console.log('site'.green.bold + ' - ' + 'started'.cyan)
            }

            if(typeof this.success === 'function')
            {
                this.success()
            }
        })
    }

    /**
     * Create project
     */
    createProjectRoute(_project)
    {
        this.express.use('/', express.static(path.join(__dirname, '../site/dist')))

        // Project download route
        this.express.get('/' + _project.slug + '/download', (request, response) =>
        {
            // Get zip buffer
            const zipBuffer = _project.getZipBuffer()

            // Send
            response.writeHead(200, {
                'Content-Type': 'application/zip',
                'Content-Length': zipBuffer.length
            })
            response.write(zipBuffer, 'binary')
            response.end(null, 'binary')
        })

        this.express.use('/' + _project.slug + '/files', express.static(_project.path))

        this.express.get('/*', (request, response) =>
        {
            response.sendFile(path.join(__dirname, '../site/dist/index.html'))
        })
    }
}

module.exports = Site
