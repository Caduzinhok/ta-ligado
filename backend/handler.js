import serverless from 'serverless-http';
import app from './index.js';

export const handler = serverless(app, {
  request: (req, event, context) => {
    if (typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (e) {
        console.error('Erro ao fazer parse do body:', e);
      }
    } else if (Buffer.isBuffer(req.body)) {
      try {
        const bodyString = req.body.toString('utf8'); 
        req.body = JSON.parse(bodyString); 
      } catch (e) {
        console.error('Erro ao decodificar buffer do body:', e);
      }
    }
  }
});
