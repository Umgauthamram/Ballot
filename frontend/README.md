<!-- phase 1 -->
1. The Architecture: Hybrid Gasless Voting
We are not making students connect MetaMask. Instead, your Backend (Node.js) acts as the bridge.

Step 1: Student clicks "Vote".

Step 2: Backend verifies student identity (Web2 security).

Step 3: Backend creates a unique "User Hash" (anonymized ID).

Step 4: Backend sends the transaction to Polygon/Sepolia using the Admin Wallet.

Step 5: Smart Contract records the vote against that "User Hash" (ensuring 1 person = 1 vote).

2. Data Storage Strategy: Where does data go?
Blockchain storage is expensive. We only store the "Truth" on-chain. Everything else goes to IPFS or MongoDB.

A. On the Blockchain (Polygon/Sepolia)
Strictly for counting and integrity.

Poll ID: Unique identifier (1, 2, 3...).

Candidate ID & Vote Counts: Candidate A: 50 votes, Candidate B: 30 votes.

Voter Registry (Anonymized): A mapping of Hash(Student_ID) -> true/false.

Why? This ensures that even if the backend tries to cheat, the blockchain will reject a second vote from the same student hash.

IPFS CID: A reference string pointing to the full election details.

B. On IPFS (InterPlanetary File System)
For Immutable Data that is too heavy for Blockchain.

Poll Metadata: Title, Description ("Class Rep Election 2025").

Candidate Details: Names, Manifesto text, Image URLs.

Why? If we stored the "Manifesto" on the blockchain, it would cost $50+ per election. On IPFS, it's free/cheap.

C. In MongoDB (Web2)
For User Management & UI Speed.

Student Profiles (Name, Email, Verification Status).

Auth Tokens.

Poll Status (Active/Ended) - We mirror this from blockchain for faster loading.

3. The Smart Contract Logic (Voting.sol)
We will write a contract with these core functions:

createPoll(string _ipfsHash, string[] _candidateNames)

Stores the IPFS CID.

Initializes candidates with 0 votes.

vote(uint256 _pollId, uint256 _candidateId, bytes32 _userHash)

Check: Has _userHash voted in _pollId?

Effect: Increment candidate vote count.

Record: Mark _userHash as voted.

getPoll(uint256 _pollId)

Returns current vote counts for all candidates.



<!-- phase 2 -->
We will use Hardhat to compile and deploy.

Step 1: Setup Hardhat Environment. Step 2: Write Voting.sol. Step 3: Configure hardhat.config.js for Polygon Amoy (Testnet) & Sepolia. Step 4: Deploy Script. Step 5: Integrate into Backend (voteRoutes.js).
