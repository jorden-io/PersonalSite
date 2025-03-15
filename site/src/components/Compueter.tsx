import React, { FC } from 'react';
import FlyPhongSphere from './WebGLWorld';

const Computer: FC = () => {
  // Container styling for overall layout and dark retro vibe
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: '30px',
    borderRadius: '15px',
    width: '700px',
    margin: '50px auto',
    //boxShadow: '0 0 40px rgba(0, 0, 0, 0.9)',
    boxShadow: '0 0 10px 2px red, 0 0 20px 4px orange, 0 0 30px 6px yellow, 0 0 40px 8px green, 0 0 50px 10px blue, 0 0 60px 12px indigo, 0 0 70px 14px violet'
  };

  // Detailed monitor container (CRT frame)
  const monitorContainerStyle: React.CSSProperties = {
    width: '600px',
    height: '400px',
    backgroundColor: '#333',
    border: '12px solid #555',
    borderRadius: '8px',
    //boxShadow: '0 0 25px rgba(0,255,0,0.5)',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: '20px',

  };

  // Screen style with a radial gradient and inner glow for that CRT feel
  const screenStyle: React.CSSProperties = {
    // width: 'calc(100% - 24px)',
    // height: 'calc(100% - 24px)',
    //margin: '12px',
    height: "400px",
    background: 'radial-gradient(ellipse at center, #003300, #000000)',
    color: '#00ff00',
    fontFamily: '"Courier New", monospace',
    fontSize: '1.2em',
    padding: '0px',
    overflow: 'auto',
  };

  // CPU unit with indicator lights and status labels
  const cpuStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#444',
    width: '600px',
    padding: '10px 20px',
    borderRadius: '5px',
    marginBottom: '20px',
  };

  // Style for each indicator light (e.g. power, active, standby)
  const indicatorStyle: React.CSSProperties = {
    width: '15px',
    height: '15px',
    borderRadius: '50%',
    backgroundColor: '#ff0000',
    boxShadow: '0 0 8px #ff0000',
    marginRight: '8px',
  };

  const labelStyle: React.CSSProperties = {
    color: '#fff',
    fontFamily: '"Courier New", monospace',
    fontSize: '0.9em',
  };

  // Keyboard rendered as a grid with detailed keys
  const keyboardStyle: React.CSSProperties = {
    width: '600px',
    display: 'grid',
    gridTemplateColumns: 'repeat(15, 1fr)',
    gap: '5px',
    marginBottom: '20px',
  };

  const keyStyle: React.CSSProperties = {
    backgroundColor: '#666',
    border: '2px solid #444',
    borderRadius: '4px',
    height: '35px',
    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.5)',
  };

  // Extra details section (floppy drive, speaker, etc.)
  const extraDetailStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-around',
    width: '600px',
  };

  const detailBoxStyle: React.CSSProperties = {
    backgroundColor: '#555',
    padding: '10px',
    borderRadius: '5px',
    color: '#fff',
    fontFamily: '"Courier New", monospace',
    textAlign: 'center',
    boxShadow: '0 0 10px rgba(0,0,0,0.7)',
    width: '45%',
  };

  // Generate an array of keys for the keyboard (75 keys)
  const keys = Array(75).fill(0);

  return (
    <div style={containerStyle}>
      {/* Detailed Monitor */}
      <div style={monitorContainerStyle}>
        <div style={screenStyle}>
            <FlyPhongSphere />
    </div>
      </div>

      {/* CPU Unit with indicator lights */}
      <div style={cpuStyle}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={indicatorStyle} />
          <span style={labelStyle}>Power</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              ...indicatorStyle,
              backgroundColor: '#00ff00',
              boxShadow: '0 0 8px #00ff00',
            }}
          />
          <span style={labelStyle}>Active</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              ...indicatorStyle,
              backgroundColor: '#ffff00',
              boxShadow: '0 0 8px #ffff00',
            }}
          />
          <span style={labelStyle}>Standby</span>
        </div>
      </div>

      {/* Retro-styled Keyboard */}
      <div style={keyboardStyle}>
        {keys.map((_, index) => (
          <div key={index} style={keyStyle} />
        ))}
      </div>

      {/* Extra Details (e.g., Floppy Drive and Speaker) */}
      {/* <div style={extraDetailStyle}>
        <div style={detailBoxStyle}>
          <p>Floppy Drive</p>
          <p>Status: Ready</p>
        </div>
        <div style={detailBoxStyle}>
          <p>Speaker</p>
          <p>Volume: 75%</p>
        </div>
      </div> */}
    </div>
  );
};

export default Computer;
