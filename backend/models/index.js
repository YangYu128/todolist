// backend/models/index.js
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('todo_db', 'postgres', 'admin', {
  host: 'localhost',
  dialect: 'postgres',
});
