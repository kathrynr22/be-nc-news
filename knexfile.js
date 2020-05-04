const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  development: {
    client: 'pg',
    seeds: {
      directory: './db/seeds',
    },
    connection: {
      database: 'nc_news'
      // user,
      // password
    },
    migrations: {
      directory: './db/migrations',
    },
  },
  test: {
    client: 'pg',
    seeds: {
      directory: './db/seeds',
    },
    connection: {
      database: 'nc_news_test'
      // user,
      // password
    },
    migrations: {
      directory: './db/migrations',
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
