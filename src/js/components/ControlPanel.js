import React from 'react';

export default ({ onPause, onResume, isRunning, isReady }) => (
  <div className="m-t-3">
    { isRunning ?
    <button type="button" className="btn btn-danger btn-lg btn-block p-y-3" onClick={onPause} disabled={!isReady}>まった！</button> :
    <button type="button" className="btn btn-primary btn-lg btn-block p-y-3" onClick={onResume} disabled={!isReady}>さいかい</button>
    }
  </div>
)
