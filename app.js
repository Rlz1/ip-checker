// Подключение необходимых модулей
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Создание экземпляра приложения Express
const app = express();

// Подключение к базе данных MongoDB
mongoose.connect('mongodb://localhost:27017/ip_addresses', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Ошибка подключения к базе данных:'));
db.once('open', function() {
  console.log('Успешное подключение к базе данных');
});

// Определение схемы и модели для IP-адресов
const ipAddressSchema = new mongoose.Schema({
  ipAddress: String
});
const IPAddress = mongoose.model('IPAddress', ipAddressSchema);

// Использование bodyParser для анализа JSON и URL-кодированных данных
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Обработчик POST-запроса для сохранения IP-адреса
app.post('/save-ip', async (req, res) => {
  try {
    const { ipAddress } = req.body;

    // Создание новой записи IP-адреса и сохранение в базе данных
    const newIPAddress = new IPAddress({ ipAddress });
    await newIPAddress.save();

    res.status(200).json({ message: 'IP-адрес успешно сохранён' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Настройка порта и запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
