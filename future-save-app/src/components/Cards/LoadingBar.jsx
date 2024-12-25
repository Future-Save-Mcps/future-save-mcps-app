import React from 'react';

const LoadingBar = ({percentage}) => {

  return (
    <div className="flex items-center gap-3">
        <div style={styles.container}>
      <div style={{ ...styles.filled, width: `${percentage}%` }}></div>
      <div style={{ ...styles.remaining, width: `${100 - percentage}%` }}></div>
    </div>
    <div className="text-[14px] font-[600]">{percentage}%</div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    backgroundColor: '#EAEAEA',
    width: '100%',
    height: '10px',
    borderRadius: '30px',
    overflow: 'hidden',
  },
  filled: {
    backgroundColor: '#041F62',
    height: '100%',
    borderRadius: '30px',

  },
  remaining: {
    backgroundColor: '#EAEAEA',
    height: '100%',
  },
};

export default LoadingBar;
