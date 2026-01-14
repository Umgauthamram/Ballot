# Ballot - Immutable Campus Voting System

Ballot is a secure, blockchain-enabled electronic voting system designed for university elections. It ensures election integrity using Ethereum-based smart contracts while providing a modern, user-friendly interface for students and administrators.

## 🚀 Features

### for Students
- **Secure Dashboard**: View active, upcoming, and past elections.
- **Immutable Voting**: Votes are recorded on the Ethereum blockchain, ensuring they cannot be tampered with.
- **Live Results**: Watch real-time vote counts with dynamic progress bars.
- **Vote History**: Track your voting record (anonymized hash) on the blockchain.

### for Administrators
- **Poll Management**: Create and manage elections (Title, Description, Candidates, Eligibility).
- **User Management**: 
    - **Bulk User Generation**: Generate student accounts via CSV or single entry.
    - **Email Credentials**: Automatically send login credentials to student emails.
    - **College Identity**: Manage student details including Department and College Name.
- **Audit Logs**: View live blockchain transaction hashes for every vote cast.

## 🛠 Tech Stack

### Frontend
- **React 19**: Modern UI library for building interactive interfaces.
- **TailwindCSS**: Utility-first CSS framework for cybersecurity/cyberpunk aesthetic.
- **Vite**: Next-generation frontend tooling.
- **Lucide React**: Beautiful, consistent icons.
- **Axios**: HTTP client for API requests.

### Backend
- **Node.js & Express**: Robust server-side framework.
- **MongoDB**: NoSQL database for flexible user and poll data storage.
- **Mongoose**: ODM for MongoDB.
- **Ethers.js**: Library for interacting with the Ethereum Blockchain.
- **Nodemailer**: Email service for sending credentials.
- **JWT**: Secure authentication with JSON Web Tokens.

### Blockchain
- **Solidity**: Smart contract language.
- **Hardhat**: Development environment for Ethereum software.
- **Sepolia/Localhost**: Deployed on testnets for verification.

## 📂 Project Structure

```
ballot/
├── backend/            # Express Server & API
│   ├── config/         # Database & ABI Config
│   ├── controllers/    # Logic for Auth, Admin, Voting
│   ├── models/         # MongoDB Schemas (User, Poll)
│   ├── utils/          # Helpers (Email Service)
│   └── server.js       # Entry point
│
├── frontend/           # React User Interface
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # AdminPanel, StudentDashboard
│   │   ├── Layout/     # Main Layout wrappers
│   │   └── services/   # API connectors
│
└── blockchain/         # Smart Contracts
    └── contracts/
        └── Voting.sol  # Core Voting Logic
```

## 🔧 Setup & Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/ballot.git
    cd ballot
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create .env file with:
    # PORT=5000
    # MONGO_URI=your_mongodb_uri
    # JWT_SECRET=your_jwt_secret
    # EMAIL_USER=your_email
    # EMAIL_PASS=your_app_password
    # RPC_URL=your_blockchain_rpc
    # PRIVATE_KEY=your_wallet_private_key
    # CONTRACT_ADDRESS=deployed_contract_address
    npm start
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Blockchain Deployment**
    ```bash
    cd blockchain
    npx hardhat run scripts/deploy.js --network localhost
    # Copy the address to backend .env
    ```

## 🔐 Security

- **Password Hashing**: User passwords are hashed using `bcryptjs`.
- **Force Change Password**: New users must change their auto-generated password on first login.
- **Role-Based Access**: Middleware protects Admin vs. Student routes.
- **Smart Contracts**: Voting logic is decentralized; once a vote is cast, it cannot be altered by admins.

## 📜 Smart Contract (Voting.sol)

The core integrity relies on `Voting.sol`. (See `blockchain/contracts/Voting.sol` for full code).
- `createPoll()`: Initializes a new election.
- `vote()`: Casts a vote linked to a unique but anonymized user hash.
- `getPollResults()`: Returns live tally from the chain.

---
**Developed for Advanced Secure Campus Voting**
