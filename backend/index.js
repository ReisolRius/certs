const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3001;
const API_KEY = '011ba11bdcad4fa396660c2ec447ef14';

app.use(cors());
app.use(bodyParser.json());

// Проверка апи ключа
const checkApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== API_KEY) {
        return res.status(401).json({ error: 'Неверный API ключ' });
    }
    
    next();
};

// Хранилище сертификатов
let certificates = [
    { id: 1, name: 'Сертификат на курсы по ит', price: 50000, description: 'Description 1' },
    { id: 2, name: 'Сертификат на массаж', price: 23000, description: 'Description 2' },
    { id: 3, name: 'Сертификат на курсы в автошколе', price: 15000, description: 'Description 3' },
    { id: 4, name: 'Сертификат на курсы по кулинарии', price: 12500, description: 'Description 3' }
];

// Хранилище выбранного сертификата и данных пользователя
let selectedCertificate = null;
let userData = null;

// Получение всех сертификатов
app.get('/api/certificates', checkApiKey, (req, res) => {
    res.json(certificates);
});

// Получение выбранного сертификата и данных пользователя
app.get('/api/orders', checkApiKey, (req, res) => {
    try {
        const orderData = selectedCertificate ? {
            ...selectedCertificate,
            userData: userData
        } : null;
        res.json(orderData ? [orderData] : []);
    } catch (error) {
        console.error('Ошибка при получении заказа:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// Сохранение данных о выбранном сертификате
app.post('/api/orders', checkApiKey, (req, res) => {
    try {
        const { certificateId, price, userData: userInfo } = req.body;
        // Проверяем существование сертификата
        const certificate = certificates.find(cert => cert.id === certificateId);
        if (!certificate) {
            return res.status(404).json({ error: 'Сертификат не найден' });
        }
        // Проверяем соответствие цены
        if (certificate.price !== price) {
            return res.status(400).json({ error: 'Некорректная цена сертификата' });
        }
        // Создаем новый заказ
        selectedCertificate = {
            id: 1,
            certificateId,
            price,
            date: new Date().toISOString()
        };
        
        // Сохраняем данные пользователя
        if (userInfo) {
            userData = {
                name: userInfo.name,
                phone: userInfo.phone,
                email: userInfo.email
            };
        }
        
        res.status(201).json({
            ...selectedCertificate,
            userData: userData
        });
    } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
