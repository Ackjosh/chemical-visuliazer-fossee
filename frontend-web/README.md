# Chemical Equipment Parameter Visualizer

A hybrid Web and Desktop application for visualizing and analyzing chemical equipment data. This project was built as part of the **FOSSEE Internship Screening Task**.

## 🚀 Features
- **Hybrid Architecture:** Unified Django backend serving both a React.js Web Dashboard and a PyQt5 Desktop Application.
- **Secure Authentication:** JWT (JSON Web Token) authentication required for uploading and viewing data across both platforms.
- **Data Analytics:** Automatically calculates metrics (Average Temperature, Pressure, Flowrate) and equipment distribution upon upload.
- **Interactive Visualization:**
  - **Web:** Interactive Chart.js graphs.
  - **Desktop:** Native Matplotlib integration.
- **History Management:** Tracks the last 5 uploaded datasets with instant switching between them.
- **Reporting:** Generates and downloads PDF analysis reports on demand.

## 🛠 Tech Stack

### Backend
- **Framework:** Django & Django REST Framework (DRF)
- **Database:** SQLite (Development)
- **Data Processing:** Pandas
- **Security:** SimpleJWT (Authentication), CORS Headers
- **Reporting:** ReportLab (PDF Generation)

### Web Frontend
- **Framework:** React.js (Vite)
- **HTTP Client:** Axios
- **Visualization:** Chart.js, React-Chartjs-2
- **Styling:** CSS Modules / Flexbox

### Desktop Frontend
- **Framework:** Python (PyQt5)
- **Visualization:** Matplotlib
- **HTTP Client:** Requests

---

## 📦 Setup Instructions

Follow these steps to run the full stack locally.

### 1. Backend Setup
The backend must be running for the frontends to work.

```bash
# Navigate to backend folder
cd backend

# Create virtual environment (Optional but recommended)
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations and create superuser
python manage.py migrate
python manage.py createsuperuser
# (Follow prompts to set username/password, e.g., admin/password123)

# Start the server
python manage.py runserver