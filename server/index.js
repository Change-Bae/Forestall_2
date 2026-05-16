const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// DB 연결 및 테이블 생성
const db = new sqlite3.Database('./database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    birthdate TEXT
  )
`);

// 데이터 저장 API
app.post('/api/users', (req, res) => {
    const { name, birthdate } = req.body;
    db.run(
        'INSERT INTO users (name, birthdate) VALUES (?, ?)',
        [name, birthdate],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: '저장 완료!' });
        }
    );
});

app.listen(3001, () => console.log('서버 실행 중: http://localhost:3001'));