<img width="1369" height="875" alt="image" src="https://github.com/user-attachments/assets/85b1833b-d7ea-4bc5-9c13-fc0a3b9b3893" />


# 📊 Personal Finance Dashboard (DKK/BRL)

A modern, responsive web application designed for expatriates and travelers to manage their finances across different currencies. This project handles the conversion between **Danish Krone (DKK)** and **Brazilian Real (BRL)**, providing real-time insights into spending and balance management.

## 🚀 Features

*   **Real-time Currency Conversion**: Integration with Exchange Rate APIs (AwesomeAPI) for accurate DKK to BRL conversions.
*   **Dynamic Dashboard**: Visual representation of expenses using interactive charts (PieChart).
*   **Authentication**: Secure login system powered by **Firebase Auth**.
*   **Cloud Persistence**: Financial data is stored and synchronized in real-time using **Cloud Firestore**.
*   **Monthly Breakdown**: Filter and view your financial history on a month-to-month basis.
*   **Responsive UI**: Built with **Tailwind CSS** for a seamless experience on mobile and desktop.

## 🛠️ Tech Stack

*   **Frontend**: React.js with Vite
*   **Styling**: Tailwind CSS
*   **Backend/Database**: Firebase (Firestore & Auth)
*   **Language**: TypeScript
*   **Icons**: Lucide React

## 📦 Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd financial-dashboard
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root directory and add your credentials based on the `.env.example` file:
    ```env
    VITE_AWESOME_API_URL=https://economia.awesomeapi.com.br/last/DKK-BRL
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## 🔐 Security & Best Practices (AppSec)

This project follows professional security standards learned during my systems development degree:
*   **Environment Variables**: Sensitive API keys and Firebase credentials are excluded from version control via `.gitignore`.
*   **Firebase Security Rules**: Firestore is configured to ensure data isolation, allowing users to access only their own data.
*   **Zero-Footprint Strategy**: Local development logs, OS-specific files (like .DS_Store), and tool caches are strictly ignored.

## 📧 Contact

If you have any questions, suggestions, or feedback about the project, you can find me here:

* **GitHub:** [VitorTFraga](https://github.com/VitorTFraga) 
* **LinkedIn:** [LinkedIn](https://www.linkedin.com/in/vitor-táboas-fraga-002651212/)
