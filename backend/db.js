// backend/db.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('todo_db', 'postgres', 'admin', {
  host: 'localhost',
  dialect: 'postgres',
});

export default sequelize;
