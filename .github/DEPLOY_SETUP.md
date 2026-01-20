# Деплой через GitHub

## Самый простой способ (2 минуты)

### 1. Railway (рекомендуется)

1. Зайди на [railway.app](https://railway.app) → зарегистрируйся через GitHub
2. **New Project** → **Deploy from GitHub repo**
3. Выбери свой репозиторий
4. Railway автоматически определит Meteor и начнет деплой
5. Пока деплоится, добавь **MongoDB**:
   - В том же проекте → **+ New** → **Database** → **Add MongoDB**
6. После деплоя, установи переменные окружения:
   - **Variables** → **+ New Variable**
   - `MONGO_URL` = скопируй из MongoDB сервиса (Connection String)
   - `ROOT_URL` = твой домен (Railway даст его автоматически, например `https://your-app.up.railway.app`)

**Готово!** При каждом пуше в `main`/`master` Railway автоматически задеплоит.

### 2. Render (альтернатива)

1. [render.com](https://render.com) → зарегистрируйся через GitHub
2. **New +** → **Web Service** → **Connect GitHub**
3. Выбери репозиторий
4. Render использует настройки из `render.yaml`
5. Добавь MongoDB (можно MongoDB Atlas)
6. Установи переменные:
   - `MONGO_URL`
   - `ROOT_URL`
   - `PORT=10000`

## MongoDB

**Вариант А: Встроенный на платформе** (Railway/Render)
- Просто добавь MongoDB сервис в проект

**Вариант Б: MongoDB Atlas** (бесплатно)
1. [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → создай аккаунт
2. **Build a Database** → выбери бесплатный M0
3. **Database Access** → создай пользователя (запомни пароль)
4. **Network Access** → **Add IP Address** → `0.0.0.0/0` (разрешить все)
5. **Connect** → **Connect your application**
6. Скопируй connection string, замени `<password>` на свой пароль
7. Используй как `MONGO_URL` в Railway/Render
