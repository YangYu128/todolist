// backend/server.js
import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todo.js';
import { sequelize } from './models/index.js';
import './models/Todo.js'; // make sure model is loaded

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Mount the route
app.use('/api/todos', todoRoutes);

const PORT = 5000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    await sequelize.sync(); // create table if not exists
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (err) {
    console.error('❌ Unable to connect to DB:', err);
  }
});
