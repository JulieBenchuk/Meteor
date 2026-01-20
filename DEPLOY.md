# Деплой приложения

## Варианты деплоя

### 1. Railway (рекомендуется)

1. Зарегистрируйся на [railway.app](https://railway.app)
2. Создай новый проект из GitHub репозитория
3. Добавь MongoDB сервис
4. Установи переменные окружения:
   - `MONGO_URL` - из MongoDB сервиса
   - `ROOT_URL` - твой домен (например, `https://your-app.railway.app`)
   - `PORT` - Railway установит автоматически
5. Деплой запустится автоматически

### 2. Render

1. Зарегистрируйся на [render.com](https://render.com)
2. Создай новый Web Service из GitHub репозитория
3. Используй `render.yaml` конфигурацию
4. Добавь MongoDB (можно использовать MongoDB Atlas)
5. Установи переменные окружения:
   - `MONGO_URL`
   - `ROOT_URL`
   - `PORT=10000`

### 3. Docker (любой хостинг)

```bash
docker build -t tic-tac-toe .
docker run -p 3000:3000 \
  -e MONGO_URL=your_mongo_url \
  -e ROOT_URL=http://localhost:3000 \
  tic-tac-toe
```

### 4. Meteor Galaxy (официальный хостинг)

```bash
meteor deploy your-app-name.meteorapp.com
```

Или через веб-интерфейс на [galaxy.meteor.com](https://galaxy.meteor.com)

## Переменные окружения

- `MONGO_URL` - строка подключения к MongoDB (обязательно)
- `ROOT_URL` - полный URL приложения (обязательно)
- `PORT` - порт (обычно устанавливается автоматически)

## MongoDB

Для продакшена используй:
- MongoDB Atlas (бесплатный tier доступен)
- Или встроенный MongoDB на платформе (Railway, Render)
