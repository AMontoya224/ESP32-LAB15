import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [device, setDevice] = useState(false);
  const [potValue, setPotValue] = useState(0);
  const [led1, setLed1] = useState(false);
  const [led2, setLed2] = useState(false);
  const SERVER_IP = 'http://192.168.1.43:8000';

  useEffect(() => {
    const fetchPotentiometer = async () => {
      const response = await axios.get(`${SERVER_IP}/pot`);
      setPotValue(response.data.potentiometerValue);
      setDevice(true);
    };
    const fetchLedsStatus = async () => {
      const response = await axios.get(`${SERVER_IP}/leds`);
      setLed1(response.data.led1);
      setLed2(response.data.led2);
    };
    fetchPotentiometer();
    fetchLedsStatus();
  }, []);

  const handleRoot = () => {
    axios.post(`${SERVER_IP}/`)
      .then(() => {
        setLed1(false);
        setLed2(false);
      })
      .catch(error => {
        setDevice(false);
        console.error('Error:', error);
      });
  };
  
  const handleLed = (led1, led2) => {
    axios.post(`${SERVER_IP}/leds`, {led1, led2})
      .then(() => {
        setLed1(led1);
        setLed2(led2);
      })
      .catch(error => {
        setDevice(false);
        console.error('Error:', error);
      });

  };

  const handlePot = () => {
    axios.get(`${SERVER_IP}/pot`)
      .then(response => {
        setPotValue(response.data.potentiometerValue);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    const interval = setInterval(handlePot, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='App'>
      <header>
        <div>
          <b>Device</b>
          <div>
            <div className={device ? 'success' : 'danger'}></div>
            <p>{device ? 'online' : 'offline'}</p>
          </div>
        </div>
        <button onClick={handleRoot}>ROOT</button>
        <div></div>
      </header>
      <main>
        <div className='widget'>
          <p>El LED VERDE está: {led1}</p>
          <div className='toggle'>
            <input type='checkbox' id='led1' onClick={(e) => handleLed(e.target.checked, led2)} checked={led1}/>
            <label for='led1'></label>
          </div>
        </div>
        <div className='widget'>
          <p>El LED ROJO está: {led2}</p>
          <div className='toggle'>
            <input type='checkbox' id='led2' onClick={(e) => handleLed(led1, e.target.checked)} checked={led2}/>
            <label for='led2'></label>
          </div>
        </div>
        <div className='widget'>
          <p>Valor del Potenciómetro:</p>
          <h1>{potValue}</h1>
        </div>
      </main>
    </div>
  );
};

export default App;