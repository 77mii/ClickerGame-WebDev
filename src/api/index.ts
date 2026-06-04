

import express from 'express';
import shopRoutes from './routes/shopRoutes';
import userRoutes from './routes/userRoutes';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use('/api', shopRoutes);
app.use('/api', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});