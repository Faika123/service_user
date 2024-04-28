const express = require('express');
const cors = require('cors'); // Importez le module CORS
const bodyParser = require('body-parser');
const UserRouter = require('./routes/User');
const UserService = require('./services/User');
const { db } = require('./database');

const client = require('prom-client')



const app = express();

// Enable Prometheus metrics collection
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Create a histogram metric for auth-ms service
const authRequestDurationMicroseconds = new client.Histogram({
  name: 'auth_request_duration_seconds',
  help: 'Duration of auth-ms service HTTP requests in microseconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

// Register the histogram for auth-ms service
register.registerMetric(authRequestDurationMicroseconds);

// Middleware to measure request duration for auth-ms service
app.use((req, res, next) => {
  const end = authRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.url, code: res.statusCode });
  });
  next();
});

// Route to expose Prometheus metrics
app.get('/metrics', async (req, res) => {
  try {
    const metrics = await register.metrics();
    res.set('Content-Type', register.contentType);
    res.end(metrics);
  } catch (error) {
    console.error('Error generating metrics:', error);
    res.status(500).send('Error generating metrics');
  }
});


app.use(cors()); // Utilisez le middleware CORS

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('', UserRouter);


db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

const port = 3005;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
