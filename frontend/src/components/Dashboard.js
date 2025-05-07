import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Avatar,
    Box,
    Container,
    Divider,
    Tab,
    Tabs,
    Typography,
    Paper,
    Grid,
    Tooltip,
    Button,
    IconButton,
    Menu,
    MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate, Link } from 'react-router-dom';

const tabs = ['Overview', 'Posts', 'Learning Progress', 'Learning Plans', 'Followers', 'Following'];

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [followersList, setFollowersList] = useState([]);
    const [followingList, setFollowingList] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const fetchUserAndAllUsers = async () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userId = storedUser?._id || storedUser?.id;

        if (userId) {
            try {
                const [userRes, allUsersRes, followersRes, followingRes] = await Promise.all([
                    axios.get(`http://localhost:5021/api/v1/users/${userId}`),
                    axios.get(`http://localhost:5021/api/v1/users`),
                    axios.get(`http://localhost:5021/api/v1/users/${userId}/followers`),
                    axios.get(`http://localhost:5021/api/v1/users/${userId}/following`)
                ]);

                setUser(userRes.data);
                setAllUsers(allUsersRes.data);
                setFollowersList(followersRes.data);
                setFollowingList(followingRes.data);
                fetchSuggestedUsers(userId);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        }
    };

    const fetchSuggestedUsers = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:5021/api/v1/users/${userId}/suggested`);
            setSuggestedUsers(res.data || []);
        } catch (err) {
            console.error("Failed to fetch suggested users:", err);
        }
    };

    useEffect(() => {
        fetchUserAndAllUsers();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setSearchResults([]);
        } else {
            const filtered = allUsers.filter(u =>
                u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(filtered);
        }
    }, [searchQuery, allUsers]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteAccount = async () => {
        handleMenuClose();
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user"));
                const userId = storedUser?._id || storedUser?.id;
                await axios.delete(`http://localhost:5021/api/v1/users/${userId}`);
                localStorage.clear();
                sessionStorage.clear();
                alert("Account deleted successfully!");
                navigate("/login");
            } catch (err) {
                console.error("Error deleting account:", err);
                alert("Failed to delete account.");
            }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login");
    };

    const refreshSuggestions = () => {
        if (user?._id) {
            fetchSuggestedUsers(user._id);
        }
    };

    if (!user) return <Typography>Loading...</Typography>;

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const isOwnProfile = user._id === storedUser?._id;

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 4 }}>
                <Box display="flex" alignItems="center" gap={4} mb={3}>
                    <Avatar
                        alt="Profile"
                        src={user.profilePicture || "https://www.w3schools.com/howto/img_avatar.png"}
                        sx={{ width: 112, height: 112 }}
                    />
                    <Box flex={1}>
                        <Typography variant="h4" fontWeight="bold">{user.username}</Typography>
                        <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                        <Typography mt={1} variant="body1">{user.bio || 'No bio available.'}</Typography>
                    </Box>
                    {isOwnProfile && (
                        <Box ml="auto" display="flex" alignItems="center" gap={1}>
                            <IconButton onClick={handleMenuClick}>
                                <MoreVertIcon />
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                                <MenuItem onClick={() => { handleMenuClose(); navigate("/update-profile"); }}>
                                    Update Profile
                                </MenuItem>
                                <MenuItem onClick={handleDeleteAccount} sx={{ color: "red" }}>
                                    Delete Account
                                </MenuItem>
                            </Menu>
                            <Button variant="outlined" color="error" onClick={handleLogout}>
                                Logout
                            </Button>
                        </Box>
                    )}
                </Box>

                {/* Search Box */}
                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>Search Users</Typography>
                    <input
                        type="text"
                        placeholder="Search by username"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            width: '100%'
                        }}
                    />
                    {searchResults.length > 0 && (
                        <Paper elevation={2} sx={{ p: 2, mt: 1 }}>
                            {[...new Map(searchResults.map(u => [u._id || u.id, u])).values()].map(searchedUser => (
                                <Box
                                    key={searchedUser._id || searchedUser.id}
                                    onClick={() => navigate(`/user/${searchedUser._id || searchedUser.id}`)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        p: 1,
                                        borderBottom: '1px solid #eee',
                                        cursor: 'pointer',
                                        '&:hover': { backgroundColor: '#f9f9f9' }
                                    }}
                                >
                                    <Avatar src={searchedUser.profilePicture || "https://www.w3schools.com/howto/img_avatar.png"} />
                                    <Typography>{searchedUser.username}</Typography>
                                </Box>
                            ))}
                        </Paper>
                    )}
                </Box>

                {/* Tabs */}
                <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                    {tabs.map((tab, index) => <Tab key={index} label={tab} />)}
                </Tabs>
                <Divider sx={{ my: 2 }} />

                {/* Tab Content */}
                <Box mt={2}>
                    {activeTab === 0 && (
                        <Box>
                            <Typography><strong>UserID:</strong> {user.userID}</Typography>
                            <Typography><strong>Email:</strong> {user.email}</Typography>
                            <Typography><strong>Followers:</strong> {followersList.length}</Typography>
                            <Typography><strong>Following:</strong> {followingList.length}</Typography>

                            <Box mt={4}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6">Suggested Users</Typography>
                                    <Button variant="outlined" size="small" onClick={refreshSuggestions}>Refresh</Button>
                                </Box>
                                <Grid container spacing={2} mt={1}>
                                    {suggestedUsers.map((u, index) => (
                                        <Grid item xs={6} sm={3} key={u._id || index}>
                                            <Link
                                                to={`/user/${u._id || u.id}`}
                                                style={{ textDecoration: 'none', color: 'inherit' }}
                                            >
                                                <Paper
                                                    elevation={1}
                                                    sx={{
                                                        p: 2,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        borderRadius: 2,
                                                        cursor: 'pointer',
                                                        '&:hover': { backgroundColor: '#f5f5f5' }
                                                    }}
                                                >
                                                    <Tooltip title={u.username}>
                                                        <Avatar src={u.profilePicture || "https://www.w3schools.com/howto/img_avatar.png"} sx={{ width: 64, height: 64, mb: 1 }} />
                                                    </Tooltip>
                                                    <Typography variant="body2" fontWeight="medium" noWrap>{u.username}</Typography>
                                                </Paper>
                                            </Link>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Box>
                    )}

                    {activeTab === 1 && <Typography color="text.secondary" fontStyle="italic">User posts will be displayed here.</Typography>}
                    {activeTab === 2 && <Typography color="text.secondary" fontStyle="italic">Learning progress will appear here.</Typography>}
                    {activeTab === 3 && <Typography color="text.secondary" fontStyle="italic">Learning plans will be shown here.</Typography>}

                    {activeTab === 4 && (
                        <Box>
                            <Typography variant="h6" gutterBottom>Followers</Typography>
                            {followersList.map((follower, index) => (
                                <Link
                                    to={`/user/${follower._id || follower.id}`}
                                    key={follower._id || index}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <Box display="flex" alignItems="center" mb={1} sx={{ '&:hover': { backgroundColor: '#f5f5f5' }, p: 1, borderRadius: 2 }}>
                                        <Avatar src={follower.profilePicture || "https://www.w3schools.com/howto/img_avatar.png"} sx={{ width: 40, height: 40, mr: 2 }} />
                                        <Typography>{follower.username}</Typography>
                                    </Box>
                                </Link>
                            ))}
                        </Box>
                    )}

                    {activeTab === 5 && (
                        <Box>
                            <Typography variant="h6" gutterBottom>Following</Typography>
                            {followingList.map((followed, index) => (
                                <Link
                                    to={`/user/${followed._id || followed.id}`}
                                    key={followed._id || index}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <Box display="flex" alignItems="center" mb={1} sx={{ '&:hover': { backgroundColor: '#f5f5f5' }, p: 1, borderRadius: 2 }}>
                                        <Avatar src={followed.profilePicture || "https://www.w3schools.com/howto/img_avatar.png"} sx={{ width: 40, height: 40, mr: 2 }} />
                                        <Typography>{followed.username}</Typography>
                                    </Box>
                                </Link>
                            ))}
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default UserProfile;
