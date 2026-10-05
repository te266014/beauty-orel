require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Разрешаем серверу принимать JSON
app.use(express.json());

// Показываем файлы сайта
app.use(express.static(__dirname));

// Получение заявки с сайта
app.post("/api/booking", async (req, res) => {
    try {
        const { name, phone, service, date } = req.body;

        // Проверяем, что все поля заполнены
        if (!name || !phone || !service || !date) {
            return res.status(400).json({
                ok: false,
                error: "Заполните все поля"
            });
        }

        // Сообщение для Telegram
        const message =
`🔔 НОВАЯ ЗАЯВКА — BEAUTY OREL

👤 Имя: ${name}
📞 Телефон: ${phone}
💅 Услуга: ${service}
📅 Дата: ${date}`;

        // Отправляем сообщение в Telegram
        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chat_id: process.env.CHAT_ID,
                    text: message
                })
            }
        );

        const telegramResult = await telegramResponse.json();

        if (!telegramResult.ok) {
            console.error("Ошибка Telegram:", telegramResult);
            
            return res.status(500).json({
                ok: false,
                error: "Не удалось отправить заявку в Telegram"
            });
        }

        res.json({
            ok: true
        });

    } catch (error) {
        console.error("Ошибка сервера:", error);

        res.status(500).json({
            ok: false,
            error: "Ошибка сервера"
        });
    }
});

// Запускаем сервер
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Сайт запущен: http://localhost:${PORT}`);
});