pragma solidity ^0.8.0;

contract Voting {
    
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    struct Poll {
        uint256 id;
        string ipfsHash; 
        Candidate[] candidates;
        bool exists;
    }

    mapping(uint256 => Poll) public polls;
    // pollId => (userHash => hasVoted)
    mapping(uint256 => mapping(bytes32 => bool)) public hasVoted;
    
    uint256 public pollCount;

    event PollCreated(uint256 pollId, string ipfsHash);
    event VoteCast(uint256 pollId, uint256 candidateId, bytes32 userHash);

    function createPoll(string memory _ipfsHash, string[] memory _candidateNames) public {
        pollCount++;
        Poll storage newPoll = polls[pollCount];
        newPoll.id = pollCount;
        newPoll.ipfsHash = _ipfsHash;
        newPoll.exists = true;

        for (uint i = 0; i < _candidateNames.length; i++) {
            newPoll.candidates.push(Candidate({
                name: _candidateNames[i],
                voteCount: 0
            }));
        }

        emit PollCreated(pollCount, _ipfsHash);
    }

    // Cast a vote (Gas paid by Admin)
    function vote(uint256 _pollId, uint256 _candidateIndex, bytes32 _userHash) public {
        require(polls[_pollId].exists, "Poll does not exist");
        require(!hasVoted[_pollId][_userHash], "User has already voted in this poll");
        require(_candidateIndex < polls[_pollId].candidates.length, "Invalid candidate");

        hasVoted[_pollId][_userHash] = true;
        polls[_pollId].candidates[_candidateIndex].voteCount++;

        emit VoteCast(_pollId, _candidateIndex, _userHash);
    }

    function getPollResults(uint256 _pollId) public view returns (Candidate[] memory) {
        require(polls[_pollId].exists, "Poll does not exist");
        return polls[_pollId].candidates;
    }

    function checkHasVoted(uint256 _pollId, bytes32 _userHash) public view returns (bool) {
        return hasVoted[_pollId][_userHash];
    }
}