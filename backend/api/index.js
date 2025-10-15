import serverless from 'serverless-http';
import app from '../src/index.js';

export const config = {
  api: { bodyParser: false }
};

export default serverless(app);
