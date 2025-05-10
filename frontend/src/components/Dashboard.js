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
    MenuItem,
    TextField,
    useTheme,
    alpha
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate, Link } from 'react-router-dom';
 
const tabs = ['Overview', 'Followers', 'Following'];
 
const UserProfile = () => {
    const theme = useTheme();
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
 
    if (!user) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Typography variant="h5" color="text.secondary">Loading...</Typography>
        </Box>
    );
 
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const isOwnProfile = user._id === storedUser?._id;
 
    return (
        <Container maxWidth="md">
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 4, 
                    mt: 4, 
                    borderRadius: 4,
                    background: `linear-gradient(to bottom right, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.background.paper, 1)})`
                }}
            >
                <Box display="flex" alignItems="center" gap={4} mb={3}>
                    <Avatar
                        alt="Profile"
                        src={user.profilePicture || "https://www.w3schools.com/howto/img_avatar.png"}
                        sx={{ 
                            width: 112, 
                            height: 112,
                            border: `4px solid ${theme.palette.primary.main}`,
                            boxShadow: theme.shadows[3]
                        }}
                    />
                    <Box flex={1}>
                        <Typography variant="h4" fontWeight="bold" color="primary">{user.username}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{user.email}</Typography>
                        <Typography 
                            mt={1} 
                            variant="body1" 
                            sx={{ 
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                p: 1.5,
                                borderRadius: 2,
                                fontStyle: 'italic'
                            }}
                        >
                            {user.bio || 'No bio available.'}
                        </Typography>
                    </Box>
                    {isOwnProfile && (
                        <Box ml="auto" display="flex" alignItems="center" gap={1}>
                            <IconButton 
                                onClick={handleMenuClick}
                                sx={{
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                    }
                                }}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu 
                                anchorEl={anchorEl} 
                                open={open} 
                                onClose={handleMenuClose}
                                PaperProps={{
                                    sx: {
                                        borderRadius: 2,
                                        boxShadow: theme.shadows[3]
                                    }
                                }}
                            >
                                <MenuItem 
                                    onClick={() => { handleMenuClose(); navigate("/update-profile"); }}
                                    sx={{ '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) } }}
                                >
                                    Update Profile
                                </MenuItem>
                                <MenuItem 
                                    onClick={handleDeleteAccount} 
                                    sx={{ 
                                        color: "error.main",
                                        '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.1) }
                                    }}
                                >
                                    Delete Account
                                </MenuItem>
                            </Menu>
                            <Button 
                                variant="outlined" 
                                color="error" 
                                onClick={handleLogout}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    px: 3
                                }}
                            >
                                Logout
                            </Button>
                        </Box>
                    )}
                </Box>
 
                {/* Search Box */}
                <Box mb={3}>
                    <Typography variant="h6" gutterBottom color="primary">Search Users</Typography>
                    <TextField
                        fullWidth
                        placeholder="Search by username"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                                }
                            }
                        }}
                    />
                    {searchResults.length > 0 && (
                        <Paper 
                            elevation={2} 
                            sx={{ 
                                p: 2, 
                                mt: 1,
                                borderRadius: 2,
                                maxHeight: '300px',
                                overflowY: 'auto'
                            }}
                        >
                            {[...new Map(searchResults.map(u => [u._id || u.id, u])).values()].map(searchedUser => (
                                <Box
                                    key={searchedUser._id || searchedUser.id}
                                    onClick={() => navigate(`/user/${searchedUser._id || searchedUser.id}`)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        p: 1.5,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': { 
                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                            transform: 'translateX(5px)'
                                        }
                                    }}
                                >
                                    <Avatar 
                                        src={searchedUser.profilePicture || "https://www.w3schools.com/howto/img_avatar.png"}
                                        sx={{ 
                                            width: 40, 
                                            height: 40,
                                            border: `2px solid ${theme.palette.primary.main}`
                                        }}
                                    />
                                    <Typography fontWeight="medium">{searchedUser.username}</Typography>
                                </Box>
                            ))}
                        </Paper>
                    )}
                </Box>
 
                {/* Tabs */}
                <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange} 
                    variant="scrollable" 
                    scrollButtons="auto"
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 'medium',
                            minWidth: 120,
                            '&.Mui-selected': {
                                color: 'primary.main',
                                fontWeight: 'bold'
                            }
                        },
                        '& .MuiTabs-indicator': {
                            height: 3,
                            borderRadius: '3px 3px 0 0'
                        }
                    }}
                >
                    {tabs.map((tab, index) => <Tab key={index} label={tab} />)}
                </Tabs>
                <Divider sx={{ my: 2 }} />
 
                {/* Tab Content */}
                <Box mt={2}>
                    {activeTab === 0 && (
                        <Box>
                            <Grid container spacing={2} mb={4}>
                                <Grid item xs={12} sm={6}>
                                    <Paper 
                                        elevation={1} 
                                        sx={{ 
                                            p: 2, 
                                            borderRadius: 2,
                                            backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                        }}
                                    >
                                        <Typography variant="subtitle2" color="text.secondary">Followers</Typography>
                                        <Typography variant="h4" fontWeight="bold" color="primary">{followersList.length}</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Paper 
                                        elevation={1} 
                                        sx={{ 
                                            p: 2, 
                                            borderRadius: 2,
                                            backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                        }}
                                    >
                                        <Typography variant="subtitle2" color="text.secondary">Following</Typography>
                                        <Typography variant="h4" fontWeight="bold" color="primary">{followingList.length}</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
 
                            <Box mt={4}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6" color="primary">Suggested Users</Typography>
                                    <Button 
                                        variant="outlined" 
                                        size="small" 
                                        onClick={refreshSuggestions}
                                        startIcon={<RefreshIcon />}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none'
                                        }}
                                    >
                                        Refresh
                                    </Button>
                                </Box>
                                <Grid container spacing={2}>
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
                                                        transition: 'all 0.2s',
                                                        '&:hover': { 
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                            transform: 'translateY(-5px)',
                                                            boxShadow: theme.shadows[4]
                                                        }
                                                    }}
                                                >
                                                    <Tooltip title={u.username}>
                                                        <Avatar 
                                                            src={u.profilePicture || "https://www.w3schools.com/howto/img_avatar.png"} 
                                                            sx={{ 
                                                                width: 64, 
                                                                height: 64, 
                                                                mb: 1,
                                                                border: `2px solid ${theme.palette.primary.main}`
                                                            }} 
                                                        />
                                                    </Tooltip>
                                                    <Typography 
                                                        variant="body2" 
                                                        fontWeight="medium" 
                                                        noWrap
                                                        sx={{ color: 'primary.main' }}
                                                    >
                                                        {u.username}
                                                    </Typography>
                                                </Paper>
                                            </Link>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Box>
                    )}
 
                    {activeTab === 1 && (
                        <Box>
                            <Typography variant="h6" gutterBottom color="primary">Followers</Typography>
                            <Grid container spacing={2}>
                                {followersList.map((follower, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={follower._id || index}>
                                        <Link
                                            to={`/user/${follower._id || follower.id}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <Paper
                                                elevation={1}
                                                sx={{
                                                    p: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    borderRadius: 2,
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                        transform: 'translateX(5px)'
                                                    }
                                                }}
                                            >
                                                <Avatar 
                                                    src={follower.profilePicture || "https://www.w3schools.com/howto/img_avatar.png"} 
                                                    sx={{ 
                                                        width: 40, 
                                                        height: 40, 
                                                        mr: 2,
                                                        border: `2px solid ${theme.palette.primary.main}`
                                                    }} 
                                                />
                                                <Typography fontWeight="medium">{follower.username}</Typography>
                                            </Paper>
                                        </Link>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
 
                    {activeTab === 2 && (
                        <Box>
                            <Typography variant="h6" gutterBottom color="primary">Following</Typography>
                            <Grid container spacing={2}>
                                {followingList.map((followed, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={followed._id || index}>
                                        <Link
                                            to={`/user/${followed._id || followed.id}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <Paper
                                                elevation={1}
                                                sx={{
                                                    p: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    borderRadius: 2,
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                        transform: 'translateX(5px)'
                                                    }
                                                }}
                                            >
                                                <Avatar 
                                                    src={followed.profilePicture || "https://www.w3schools.com/howto/img_avatar.png"} 
                                                    sx={{ 
                                                        width: 40, 
                                                        height: 40, 
                                                        mr: 2,
                                                        border: `2px solid ${theme.palette.primary.main}`
                                                    }} 
                                                />
                                                <Typography fontWeight="medium">{followed.username}</Typography>
                                            </Paper>
                                        </Link>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};
 
export default UserProfile;
