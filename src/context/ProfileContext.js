import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    joinDate: new Date().toISOString().split('T')[0],
  });

  const updateProfileImage = (imageUri) => {
    setProfileImage(imageUri);
  };

  const updateProfileData = (newData) => {
    setProfileData(newData);
  };

  const clearProfileData = () => {
    console.log('🧹 Clearing profile data for user logout');
    setProfileImage(null);
    setProfileData({
      name: '',
      email: '',
      phone: '',
      bio: '',
      location: '',
      joinDate: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <ProfileContext.Provider 
      value={{
        profileImage,
        profileData,
        updateProfileImage,
        updateProfileData,
        clearProfileData,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
