# Inclusive Vision

AI-платформа доступности для людей с нарушениями зрения и слуха. Компьютерное зрение + голосовой помощник + аудит зданий.

## Особенности
- B2C: Умный сканер окружения (озвучка и чтение текста)
- B2C: Навигационный помощник
- B2C: Перевод жестового языка
- B2B/B2G: Аудит доступности помещений (генерация PDF-отчетов)
- Двуязычный интерфейс (RU / KZ)

## Технологический стек
- **Frontend**: React + TypeScript + Tailwind CSS v4 + Vite
- **Backend**: Node.js + Express
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514)
- **DB**: SQLite

## Запуск проекта

### 1. Настройка Backend
```bash
cd backend
npm install
npm run seed # Заполнение БД тестовыми данными
```

Создайте файл `.env` в папке `backend` и добавьте свой ключ:
```env
ANTHROPIC_API_KEY=ваш_ключ
PORT=3001
```
*Примечание: Если ключ не указан, система будет работать в демо-режиме с заготовленными ответами.*

Запуск бэкенда:
```bash
npm run dev
```

### 2. Настройка Frontend
```bash
cd frontend
npm install
npm run dev
```

Откройте в браузере: `http://localhost:5173`
