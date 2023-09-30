import React, { useState, useEffect } from 'react';
import '../../components/Header.css';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import liff from '@line/liff';
import { getProfileData } from '../../components/localStorageUtils';
import Header from '../../components/Header.jsx';
import { fetchChillerData } from '../../components/googleSheetsApi';

function Home() {
  const [click, setClick] = useState(false);
  const navigate = useNavigate();
  const { profilePicture, displayName } = getProfileData();
  const [chillerOptions, setChillerOptions] = useState([]);
  const [selectedChiller, setSelectedChiller] = useState(''); // State to track selected chiller

  useEffect(() => {
    async function fetchData() {
      const { userId } = getProfileData();

      const chillerData = await fetchChillerData();
      console.log(chillerData);

      // Filter chillers for the current user
      const filteredChillers = chillerData.filter((chiller) => chiller.userId === userId);

      // Set all user's chillers in chillerOptions
      setChillerOptions(filteredChillers);

      // If there are any chillers, select the first one by default
      if (filteredChillers.length > 0) {
        setSelectedChiller(filteredChillers[0].chillerName);
      }
    }

    fetchData();
  }, []);

  const handleClick = () => {
    setClick(!click);
  };

  const handleLogout = () => {
    liff.logout();
    navigate('/', { replace: true });
    console.log('clicked logout');
  };

  // Function to handle chiller selection from the dropdown
  const handleChillerChange = (e) => {
    setSelectedChiller(e.target.value);
  };

  return (
    <div className="header">
      <Header
        click={click}
        handleClick={handleClick}
        profilePicture={profilePicture}
        displayName={displayName}
        handleLogout={handleLogout}
      />
      <div className="bodyHome">
        <div className="body-con">
          <div className="homepage-title">
            Homepage
          </div>
          <div className="chiller-dropdown">
            <label className="chiller-select">Select your chiller</label>
            <div className="selection-area">
              <select id="chiller-select" value={selectedChiller} onChange={handleChillerChange}>
                {chillerOptions.map((chiller) => (
                  <option key={chiller.id} value={chiller.chillerName}>
                    {chiller.chillerName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="chiller-details">
            {chillerOptions.map((chiller) => (
              <div key={chiller.id} style={{ display: chiller.chillerName === selectedChiller ? 'block' : 'none' }}>
                <div className="chiller-name">
                {chiller.chillerName}
                </div>
                <p><strong>Chiller Mode:</strong> {chiller.chillerMode}</p>
                <p><strong>Current Temperature:</strong> {chiller.currentTemp}</p>
                <p><strong>High Temperature:</strong> {chiller.highTemp}</p>
                <p><strong>Low Temperature:</strong> {chiller.lowTemp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
