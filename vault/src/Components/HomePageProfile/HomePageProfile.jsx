import React, { useState, useEffect } from 'react';
import './HomePageProfile.css';
import { FaUserCircle } from 'react-icons/fa';


const HomePageProfile = () => {
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch username and profile picture from Flask session
    useEffect(() => {
        const fetchSessionUser = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/session-user', {
                    credentials: 'include', // Include session cookies
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.username); // Set the username from session data

                    // Fetch profile data for additional details (profile picture, etc.)
                    const profileResponse = await fetch(`http://127.0.0.1:5000/users/${data.username}`, {
                        credentials: 'include',
                    });
                    if (profileResponse.ok) {
                        const profileData = await profileResponse.json();
                        setProfilePicture(profileData.profile_pic
                            ? `http://127.0.0.1:5000${profileData.profile_pic}`
                            : null
                        );
                    } else {
                        console.error('Failed to load profile data');
                    }
                } else {
                    setErrorMessage('Failed to load user info');
                }
            } catch (error) {
                console.error("Failed to fetch session user:", error);
                setErrorMessage('An error occurred while fetching user data.');
            }
        };
        fetchSessionUser();
    }, []);

    return (
        <div className='profile-card'>
            <div className='profile-info'>
                <div className="profile-avatar">
                    {profilePicture ? (
                        <img
                            src={profilePicture}
                            alt="Profile"
                            className="profile-avatar-image"
                        />
                    ) : (
                        <FaUserCircle className="profile-avatar-placeholder" />
                    )}
                </div>
                <div className='profile-username'>
                    {username || <span className="error-text">{errorMessage}</span>}
                </div>
                <div className="profile-stats">
                    <span>0 posts</span>
                    <span>0 followers</span>
                    <span>0 following</span>
                </div>
            </div>
        </div>
    );
};

export default HomePageProfile;
