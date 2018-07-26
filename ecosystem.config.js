module.exports = {
  apps : [{
    name      : 'FRONTEND1',
    script    : 'server',
    env_production : {
      NODE_ENV: 'production'
    }
  },{
    name      : 'BACKEND1',
    script    : 'index.js',
    env_production : {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : 'localhost',
      ref  : 'origin/master',
      repo : 'git@github.com:nguoiran2000/dethithpt.git',
      path : '/var/www/production',
      "post-setup": './resources/pre-deployment.sh',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};