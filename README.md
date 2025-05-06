# 💼 MoneyMap – Personal Finance Wellness App

MoneyMap is a personal finance tracker built with React Native and Node.js that helps users monitor daily expenses, visualize spending patterns, and reach savings goals — all with a sleek dark UI and mobile-first design.

---

## 🚀 Features

- ✅ **Secure Login & Register** (JWT auth)
- 💸 **Add, Edit, Delete Expenses**
- 📊 **Dashboard Summary**
  - Total spending
  - Daily and category-wise charts
- 🧾 **All Expenses View**
- ⚙️ **Settings Screen**  
  - GPay Auto-Capture toggle (Android only)
- 📱 **Mobile-first** (React Native + Expo)

---

## 🧱 Tech Stack

| Layer     | Tech                                                                 |
|-----------|----------------------------------------------------------------------|
| Frontend  | React Native, Expo, TypeScript, React Navigation, Axios              |
| Backend   | Node.js, Express, TypeScript, MongoDB                                |
| Auth      | JWT + protected routes                                               |
| Charts    | `react-native-chart-kit`, `react-native-svg`                         |
| Storage   | AsyncStorage (client), MongoDB Atlas (server)                        |

---

## 🛠️ Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/balapate123/MoneyMap.git
cd MoneyMap
```

### 2. Install Frontend

```bash
cd frontend
npm install
npx expo start
```

### 3. Install Backend

```bash
cd ../backend
npm install
npm run dev
```

---

## 📱 Screenshots

> _(Add screenshots of Home, Dashboard, All Expenses, and Settings here)_

---

## 🔒 Auth Flow

- JWT issued on login
- Protected routes via `protect.ts` middleware
- Token stored via `AsyncStorage`

---

## 📌 Upcoming Features

- 🤖 GPay notification listener (Android only)
- 📈 Savings goals with progress bars
- 🧠 AI-based budget recommendations

---

## 🤝 Contributing

Pull requests are welcome! Feel free to fork, suggest improvements, or report issues.

---

## 🧑‍💻 Author

Made with 💙 by [@balapate123](https://github.com/balapate123)

---

## 📄 License

MIT License © 2025