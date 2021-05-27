const NODE_ENV = process.env.NODE_ENV

const config = {
    development: {
        API_CONFIG: 'development'
    },
    production: {
        API_CONFIG: 'production'
    }
}

module.exports = config[NODE_ENV];