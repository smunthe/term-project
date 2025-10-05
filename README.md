# Term Project — Eepy time

A pastel-themed web application built with **Express**, **Pug**, and **SQLite3** — featuring a smooth and stylish user experience for checkout, user registration, login, and FAQ browsing. We sell dreams, pick your favorite dream, purchase on our site, then close your eyes and enjoy! 

---

## ✨ Features

- 🛍️ Responsive **Checkout Page** with table layout and summary
- 👤 **Login** and **User Registration** forms with validation
- ℹ️ **About Page** featuring styled FAQ accordion and mission values
- 💾 Local data persistence using **SQLite3**
- 🎨 Soft, playful design using custom CSS (Poppins, pastel palette)

---

## 📦 Tech Stack

- **Backend:** Node.js, Express.js
- **Templating Engine:** Pug
- **Database:** SQLite3
- **File Uploads:** Multer
- **Sessions:** express-session with SQLite3 store

---
##  📁 Folder Structure
```bash
├── app.js              # Main server file
├── users.db            # SQLite database file
├── views/              # Pug templates
├── public/             # Static assets (CSS, JS, images)
├── node_modules/       # Dependencies
├── package.json
└── .gitignore
```
---

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/smunthe/term-project.git
cd term-project
```
### 2. Install dependencies 
After cloning the repo, run: 
```bash
npm install
 ```
This command installs the following core dependenices: 
- **`express`** - web framework for handling routes and middleware
- **`express-session`** -  handles session management
- **`connect-sqlite3`** - stores session in the SQLite database
- **`multer`** - middleware for handling file uploads (e.g profile pictures)
- **`pug`** - view engine for rendering dynamic HTML
- **`sqlite3`** - embedded SQL database

### 3. Start the server 
```bash
node app.js
```
View it on http://localhost:3000
--- 

## 👤 Authors 
- Samantha Chombo-Rodriguez
- Thinzar Htun
- Luis Cavinal
--- 

## 🌐 Links 
- Live site : https://term-project-i7xb.onrender.com/
---
Enjoy shopping your dreams ✨
