// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract FeedContract {
    struct Post {
        uint256 id;
        address author;
        string title;
        string description;
        string imageUrl;
        uint256 upvotes;
        uint256 tipAmount;
        uint256 commentCount;
    }

    struct Comment {
        uint256 id;
        address author;
        string content;
    }

    struct User {
        address userAddress;
        uint256 postCount;
        uint256 commentCount;
        uint256 eventCount;
    }

    struct Event {
        uint256 id;
        address organizer;
        string title;
        string description;
        uint256 date;
        string venueLink;
        uint256 rsvpCount;
    }

    struct EventRSVP {
        uint256 eventId;
        address[] attendees;
    }

    mapping(uint256 => Post) public posts;
    mapping(uint256 => mapping(uint256 => Comment)) public comments;
    mapping(address => User) public users;
      mapping(uint256 => Event) public events;
    mapping(uint256 => EventRSVP) public eventRSVPs;
    mapping(address => uint256[]) public userEvents;

    uint256 public postCount;
    uint256 public commentCount;
    uint256 public eventCount;
    address[] private userAddresses;

     function createEvent(string memory _title, string memory _description, uint256 _date, string memory _venueLink) public {
        eventCount++;
        events[eventCount] = Event({
            id: eventCount,
            organizer: msg.sender,
            title: _title,
            description: _description,
            date: _date,
            venueLink: _venueLink,
            rsvpCount: 0
        });
        
        userEvents[msg.sender].push(eventCount);

        if (users[msg.sender].userAddress == address(0)) {
            users[msg.sender] = User({
                userAddress: msg.sender,
                postCount: 0,
                commentCount: 0,
                eventCount: 1
            });
            userAddresses.push(msg.sender);
        } else {
            users[msg.sender].eventCount++;
        }
    }

    function getAllEvents() public view returns (Event[] memory) {
        Event[] memory allEvents = new Event[](eventCount);
        for (uint256 i = 1; i <= eventCount; i++) {
            allEvents[i - 1] = events[i];
        }
        return allEvents;
    }

    function getEventsForUser(address _userAddress) public view returns (Event[] memory) {
        uint256[] memory userEventIds = userEvents[_userAddress];
        Event[] memory userEventList = new Event[](userEventIds.length);
        
        for (uint256 i = 0; i < userEventIds.length; i++) {
            userEventList[i] = events[userEventIds[i]];
        }
        
        return userEventList;
    }

    function rsvpForEvent(uint256 _eventId) public {
        require(_eventId > 0 && _eventId <= eventCount, "Invalid event ID");
        require(!isUserRSVPed(_eventId, msg.sender), "User already RSVPed");

        Event storage eventItem = events[_eventId];
        eventItem.rsvpCount++;

        EventRSVP storage rsvp = eventRSVPs[_eventId];
        rsvp.attendees.push(msg.sender);

    }

    function isUserRSVPed(uint256 _eventId, address _user) public view returns (bool) {
        EventRSVP storage rsvp = eventRSVPs[_eventId];
        for (uint256 i = 0; i < rsvp.attendees.length; i++) {
            if (rsvp.attendees[i] == _user) {
                return true;
            }
        }
        return false;
    }

    function getEventRSVPs(uint256 _eventId) public view returns (address[] memory) {
        require(_eventId > 0 && _eventId <= eventCount, "Invalid event ID");
        return eventRSVPs[_eventId].attendees;
    }

    // event PostCreated(uint256 indexed postId, address indexed author, string title);
    // event PostUpvoted(uint256 indexed postId, address indexed voter);
    // event PostTipped(uint256 indexed postId, address indexed tipper, uint256 amount);
    // event CommentAdded(uint256 indexed postId, uint256 indexed commentId, address indexed author);

    function createPost(string memory _title, string memory _description, string memory _imageUrl) public {
        postCount++;
        posts[postCount] = Post({
            id: postCount,
            author: msg.sender,
            title: _title,
            description: _description,
            imageUrl: _imageUrl,
            upvotes: 0,
            tipAmount: 0,
            commentCount: 0
        });
        
        if (users[msg.sender].userAddress == address(0)) {
            users[msg.sender] = User({
                userAddress: msg.sender,
                postCount: 1,
                commentCount: 0,
                eventCount: 0
            });
            userAddresses.push(msg.sender);
        } else {
            users[msg.sender].postCount++;
        }

        // emit PostCreated(postCount, msg.sender, _title);
    }

    function upvotePost(uint256 _postId) public {
        require(_postId > 0 && _postId <= postCount, "Invalid post ID");
        posts[_postId].upvotes++;

        // emit PostUpvoted(_postId, msg.sender);
    }

    function tipPost(uint256 _postId) public payable {
        require(_postId > 0 && _postId <= postCount, "Invalid post ID");
        require(msg.value > 0, "Tip amount must be greater than 0");

        Post storage post = posts[_postId];
        post.tipAmount += msg.value;
        payable(post.author).transfer(msg.value);

        // emit PostTipped(_postId, msg.sender, msg.value);
    }

    function commentOnPost(uint256 _postId, string memory _content) public {
        require(_postId > 0 && _postId <= postCount, "Invalid post ID");

        Post storage post = posts[_postId];
        post.commentCount++;
        commentCount++;

        comments[_postId][post.commentCount] = Comment({
            id: commentCount,
            author: msg.sender,
            content: _content
        });

        if (users[msg.sender].userAddress == address(0)) {
            users[msg.sender] = User({
                userAddress: msg.sender,
                postCount: 0,
                commentCount: 1,
                eventCount: 0
            });
            userAddresses.push(msg.sender);
        } else {
            users[msg.sender].commentCount++;
        }

        // emit CommentAdded(_postId, commentCount, msg.sender);
    }

    function getPostDetails(uint256 _postId) public view returns (Post memory) {
        require(_postId > 0 && _postId <= postCount, "Invalid post ID");
        return posts[_postId];
    }

    function getUserDetails(address _userAddress) public view returns (User memory) {
        return users[_userAddress];
    }

    function getCommentDetails(uint256 _postId, uint256 _commentId) public view returns (Comment memory) {
        require(_postId > 0 && _postId <= postCount, "Invalid post ID");
        require(_commentId > 0 && _commentId <= posts[_postId].commentCount, "Invalid comment ID");
        return comments[_postId][_commentId];
    }

    function getAllPosts() public view returns (Post[] memory) {
        Post[] memory allPosts = new Post[](postCount);
        for (uint256 i = 1; i <= postCount; i++) {
            allPosts[i - 1] = posts[i];
        }
        return allPosts;
    }

    function getCommentsForPost(uint256 _postId) public view returns (Comment[] memory) {
        require(_postId > 0 && _postId <= postCount, "Invalid post ID");
        
        Post storage post = posts[_postId];
        Comment[] memory postComments = new Comment[](post.commentCount);
        
        for (uint256 i = 1; i <= post.commentCount; i++) {
            postComments[i - 1] = comments[_postId][i];
        }
        
        return postComments;
    }

    function getAllUsers() public view returns (User[] memory) {
        User[] memory allUsers = new User[](userAddresses.length);
        for (uint256 i = 0; i < userAddresses.length; i++) {
            allUsers[i] = users[userAddresses[i]];
        }
        return allUsers;
    }
}