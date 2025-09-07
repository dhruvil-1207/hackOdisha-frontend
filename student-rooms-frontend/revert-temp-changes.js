// TEMPORARY CHANGES REVERT SCRIPT
// Run this script to revert all temporary changes made for review

const fs = require('fs');
const path = require('path');

console.log('🔄 Reverting temporary changes for review...');

// Revert AuthContext.js
const authContextPath = path.join(__dirname, 'src', 'contexts', 'AuthContext.js');
let authContextContent = fs.readFileSync(authContextPath, 'utf8');

// Replace the temporary initialState with original
authContextContent = authContextContent.replace(
  /\/\/ TEMPORARY: Mock user for review purposes\nconst initialState = \{[\s\S]*?\};/,
  `const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};`
);

fs.writeFileSync(authContextPath, authContextContent);
console.log('✅ Reverted AuthContext.js');

// Revert Dashboard.js
const dashboardPath = path.join(__dirname, 'src', 'pages', 'dashboard.js');
let dashboardContent = fs.readFileSync(dashboardPath, 'utf8');

// Replace mock rooms with original API call
dashboardContent = dashboardContent.replace(
  /\/\/ TEMPORARY: Mock rooms for review[\s\S]*?setLoading\(false\);\n  \}, \[\]\);/,
  `// Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const roomsData = await roomsService.getRooms();
        setRooms(roomsData);
      } catch (error) {
        toast.error(error.message || 'Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchRooms();
    }
  }, [isAuthenticated]);`
);

fs.writeFileSync(dashboardPath, dashboardContent);
console.log('✅ Reverted Dashboard.js');

// Revert RoomDetails.js
const roomDetailsPath = path.join(__dirname, 'src', 'pages', 'roomDetails.js');
let roomDetailsContent = fs.readFileSync(roomDetailsPath, 'utf8');

// Replace mock data with original API calls
roomDetailsContent = roomDetailsContent.replace(
  /\/\/ TEMPORARY: Mock room data for review[\s\S]*?setLoading\(false\);\n  \}, \[roomId\]\);/,
  `// Fetch room data
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        const [roomData, postsData, doubtsData] = await Promise.all([
          roomsService.getRoom(roomId),
          postsService.getPosts(roomId),
          doubtsService.getDoubts(roomId)
        ]);
        
        setRoom(roomData);
        setPosts(postsData);
        setDoubts(doubtsData);
      } catch (error) {
        toast.error(error.message || 'Failed to load room data');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && roomId) {
      fetchRoomData();
    }
  }, [roomId, isAuthenticated, navigate]);`
);

fs.writeFileSync(roomDetailsPath, roomDetailsContent);
console.log('✅ Reverted RoomDetails.js');

// Revert Profile.js
const profilePath = path.join(__dirname, 'src', 'pages', 'profile.js');
let profileContent = fs.readFileSync(profilePath, 'utf8');

profileContent = profileContent.replace(
  /\/\/ TEMPORARY: Comment out auth check for review[\s\S]*?\/\/ \}\);/,
  `if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
          <p className="text-gray-600">You need to be logged in to access your profile.</p>
        </div>
      </div>
    );
  }`
);

fs.writeFileSync(profilePath, profileContent);
console.log('✅ Reverted Profile.js');

// Revert Reports.js
const reportsPath = path.join(__dirname, 'src', 'pages', 'reports.js');
let reportsContent = fs.readFileSync(reportsPath, 'utf8');

reportsContent = reportsContent.replace(
  /\/\/ TEMPORARY: Comment out auth check for review[\s\S]*?\/\/ \}\);/,
  `if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view reports</h2>
          <p className="text-gray-600">You need to be logged in to access the reports section.</p>
        </div>
      </div>
    );
  }`
);

fs.writeFileSync(reportsPath, reportsContent);
console.log('✅ Reverted Reports.js');

console.log('🎉 All temporary changes have been reverted!');
console.log('📝 The application is now back to requiring authentication.');
