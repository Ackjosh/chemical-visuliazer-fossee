import sys
import requests
from PyQt5.QtWidgets import (QApplication, QWidget, QVBoxLayout, QPushButton, 
                             QLabel, QFileDialog, QMessageBox, QHBoxLayout)
from PyQt5.QtCore import Qt
import matplotlib.pyplot as plt
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
import webbrowser
from PyQt5.QtWidgets import QLineEdit

API_BASE_URL = "http://127.0.0.1:8000/api"

class LoginWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.token = None
        self.initUI()

    def initUI(self):
        self.setWindowTitle('Login')
        self.setGeometry(100, 100, 300, 150)
        layout = QVBoxLayout()

        self.user_input = QLineEdit(self)
        self.user_input.setPlaceholderText("Username")
        layout.addWidget(self.user_input)

        self.pass_input = QLineEdit(self)
        self.pass_input.setPlaceholderText("Password")
        self.pass_input.setEchoMode(QLineEdit.Password)
        layout.addWidget(self.pass_input)

        btn = QPushButton('Login', self)
        btn.clicked.connect(self.do_login)
        layout.addWidget(btn)
        self.setLayout(layout)

    def do_login(self):
        username = self.user_input.text()
        password = self.pass_input.text()
        try:
            res = requests.post("http://127.0.0.1:8000/api/token/", json={'username': username, 'password': password})
            if res.status_code == 200:
                print("Login Success!")
                self.token = res.json()['access']
                self.close()
            else:
                print(f"Login Failed: {res.status_code} - {res.text}")
                QMessageBox.warning(self, "Error", "Invalid Credentials")
        except:
             QMessageBox.warning(self, "Error", "Server not running")

class MplCanvas(FigureCanvas):
    def __init__(self, parent=None, width=5, height=4, dpi=100):
        self.fig = plt.Figure(figsize=(width, height), dpi=dpi)
        self.axes = self.fig.add_subplot(111)
        super(MplCanvas, self).__init__(self.fig)

class EquipmentApp(QWidget):
    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle('Chemical Equipment Visualizer (Desktop)')
        self.setGeometry(100, 100, 1000, 600)

        layout = QVBoxLayout()

        self.label_title = QLabel("Chemical Equipment Dashboard")
        self.label_title.setAlignment(Qt.AlignCenter)
        self.label_title.setStyleSheet("font-size: 20px; font-weight: bold; margin-bottom: 10px;")
        layout.addWidget(self.label_title)

        self.btn_upload = QPushButton("Upload CSV File")
        self.btn_upload.setStyleSheet("padding: 10px; background-color: #007BFF; color: white; font-weight: bold;")
        self.btn_upload.clicked.connect(self.upload_file)
        layout.addWidget(self.btn_upload)

        self.label_status = QLabel("Ready to upload...")
        self.label_status.setAlignment(Qt.AlignCenter)
        self.label_status.setStyleSheet("color: gray; margin: 10px;")
        layout.addWidget(self.label_status)

        self.btn_pdf = QPushButton("Download PDF Report")
        self.btn_pdf.setStyleSheet("padding: 10px; background-color: #28a745; color: white; font-weight: bold;")
        self.btn_pdf.clicked.connect(self.download_pdf)
        self.btn_pdf.setEnabled(False)
        layout.addWidget(self.btn_pdf)

        self.canvas = MplCanvas(self, width=5, height=4, dpi=100)
        self.canvas.axes.axis('off')
        self.canvas.axes.text(0.5, 0.5, "Upload data to visualize", ha='center')
        layout.addWidget(self.canvas)

        self.setLayout(layout)

    def upload_file(self):
        options = QFileDialog.Options()
        file_path, _ = QFileDialog.getOpenFileName(self, "Open CSV File", "", "CSV Files (*.csv)", options=options)

        if file_path:
            self.label_status.setText(f"Uploading {file_path}...")
            
            files = {'file': open(file_path, 'rb')}
            
            try:
                response = requests.post(f"{API_BASE_URL}/upload/", files=files)
                
                if response.status_code == 201:
                    data = response.json()
                    file_id = data['id']
                    self.current_file_id = file_id
                    self.btn_pdf.setEnabled(True)
                    self.label_status.setText("Upload Successful! Fetching Stats...")
                    self.fetch_and_plot_stats(file_id)
                else:
                    self.label_status.setText(f"Upload Failed: {response.status_code}")
                    QMessageBox.warning(self, "Error", f"Server responded with {response.status_code}")
            
            except requests.exceptions.ConnectionError:
                self.label_status.setText("Connection Error: Is Django running?")
                QMessageBox.critical(self, "Connection Error", "Could not connect to Django. Is the server running?")

    def fetch_and_plot_stats(self, file_id):
        try:
            response = requests.get(f"{API_BASE_URL}/stats/{file_id}/")
            if response.status_code == 200:
                stats = response.json()
                self.update_charts(stats)
                self.label_status.setText(f"Visualizing: {stats['filename']}")
            else:
                self.label_status.setText("Failed to fetch stats.")
        except Exception as e:
            self.label_status.setText(f"Error: {e}")

    def update_charts(self, stats):
        self.canvas.fig.clf()

        ax1 = self.canvas.fig.add_subplot(121)
        
        type_dist = stats['type_distribution']
        labels = list(type_dist.keys())
        sizes = list(type_dist.values())
        
        ax1.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90)
        ax1.set_title("Equipment Type Distribution")

        ax2 = self.canvas.fig.add_subplot(122)
        
        metrics = stats['average_metrics']
        params = list(metrics.keys())
        values = list(metrics.values())
        
        ax2.bar(params, values, color=['#ff9999', '#66b3ff', '#99ff99'])
        ax2.set_title("Average Metrics")
        ax2.set_ylabel("Value")

        self.canvas.draw()

    def download_pdf(self):
        if hasattr(self, 'current_file_id'):
            options = QFileDialog.Options()
            file_path, _ = QFileDialog.getSaveFileName(self, "Save Report", f"report_{self.current_file_id}.pdf", "PDF Files (*.pdf)", options=options)

            if file_path:
                try:
                    url = f"{API_BASE_URL}/report/{self.current_file_id}/"
                    response = requests.get(url)

                    if response.status_code == 200:
                        with open(file_path, 'wb') as f:
                            f.write(response.content)
                        QMessageBox.information(self, "Success", "Report saved successfully!")
                    else:
                        QMessageBox.warning(self, "Error", "Failed to download report (401 Unauthorized).")
                except Exception as e:
                    QMessageBox.warning(self, "Error", f"Download failed: {str(e)}")

if __name__ == '__main__':
    app = QApplication(sys.argv)
    
    login = LoginWindow()
    login.show()
    app.exec_()

    if login.token:
        ex = EquipmentApp()
        def auth_request(method, url, **kwargs):
            headers = kwargs.get('headers', {})
            headers['Authorization'] = f'Bearer {login.token}'
            kwargs['headers'] = headers
            return requests.request(method, url, **kwargs)
        
        requests.post = lambda url, **kwargs: auth_request('POST', url, **kwargs)
        requests.get = lambda url, **kwargs: auth_request('GET', url, **kwargs)

        ex.show()
        sys.exit(app.exec_())