const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: 'https://c896594b93d8493c8cd3c4f471029b91.us-central1.gcp.cloud.es.io:443',
  auth: {
    apiKey: 'OFlrYmY1TUJLMWNhYlNwR3QyU3M6S0tQcXVoOFVSenVDMHBQRkNXb0dJQQ=='
  },
});

client.ping({}, (error) => {
    if (error) {
        console.error('Elasticsearch cluster is down!', error);
    } else {
        console.log('Connected to Elasticsearch.');
    }
});

module.exports = {client};
