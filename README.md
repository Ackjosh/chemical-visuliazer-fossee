# Chemical Equipment Parameter Visualizer

A hybrid Web and Desktop application for visualizing and analyzing chemical equipment data. This project was built as part of the **FOSSEE Internship Screening Task**.

## 🚀 Features
- **Hybrid Architecture:** Unified Django backend serving both a React.js Web Dashboard and a PyQt5 Desktop Application.
- **Secure Authentication:** JWT (JSON Web Token) authentication required for uploading and viewing data across both platforms.
- **Data Analytics:** Automatically calculates metrics (Average Temperature, Pressure, Flowrate) and equipment distribution upon upload.
- **Interactive Visualization:**
  - **Web:** Interactive Chart.js graphs.
  - **Desktop:** Native Matplotlib integration.
- **History Management:** Tracks the last 5 uploaded datasets with instant switching.
- **Reporting:** Generates and downloads PDF analysis reports on demand.

## 🛠 Tech Stack

### Backend
- **Framework:** Django & Django REST Framework (DRF)
- **Database:** SQLite
- **Data Processing:** Pandas
- **Security:** SimpleJWT (Authentication), CORS Headers
- **Reporting:** ReportLab (PDF Generation)

### Web Frontend
- **Framework:** React.js (Vite)
- **HTTP Client:** Axios
- **Visualization:** Chart.js, React-Chartjs-2

### Desktop Frontend
- **Framework:** Python (PyQt5)
- **Visualization:** Matplotlib
- **HTTP Client:** Requests

---

## 📦 Setup Instructions

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Linux/Mac: source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 2. Web Application Setup

```bash
cd frontend-web
npm install
npm run dev
```

### 3. Desktop Application Setup

```bash
cd frontend-desktop
pip install PyQt5 matplotlib requests
python main.py
```

---

## 🔑 Usage Guide

1.  **Login:** Use the superuser credentials created in the Backend Setup to log in to both the Web and Desktop apps.
2.  **Upload Data:** Select a CSV file (format below) and upload.
3.  **Analyze:**
    * **Web:** View interactive Pie Charts and Bar Graphs.
    * **Desktop:** View static Matplotlib charts.
4.  **History:** Switch between the 5 most recently uploaded datasets.
5.  **Reporting:** Generate and download PDF analysis reports.

### Sample Data Format (`sample.csv`)

```csv
Equipment Name,Type,Flowrate,Pressure,Temperature
R-101,Reactor,150.5,25.0,450.0
HX-201,Heat Exchanger,300.0,15.5,120.0
P-301,Pump,500.2,40.0,45.5
DC-401,Distillation Column,200.0,10.0,90.0
T-501,Storage Tank,0.0,1.2,25.0
```

---

## 📂 Project Structure

```
chemical-visualizer/
├── backend/                # Django REST API
│   ├── api/                # Endpoints (Upload, Stats, History, PDF)
│   ├── core/               # Settings (JWT, CORS, Apps)
│   ├── media/              # Storage for uploaded CSVs
│   └── manage.py
├── frontend-web/           # React.js Application
│   ├── src/
│   │   ├── components/     # Dashboard, HistoryList, FileUpload
│   │   └── App.jsx         # Main Layout & Auth Logic
│   └── package.json
└── frontend-desktop/       # PyQt5 Application
    └── main.py             # Main entry point for Desktop GUI
```

## 📝 Configuration
- **Server:** The backend server must be running on `http://127.0.0.1:8000/`.
- **Security:** The `CORE_SECRET_KEY` is configured to use environment variables (`.env`).
- **Database:** SQLite is used for local development.