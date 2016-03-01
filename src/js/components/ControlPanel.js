import React from 'react';

export default ({ onBegin, onEnd, onPause, onResume, inGame, inTimeout, isReady }) => (
  <div>
    <button type="button" className="btn btn-primary btn-lg btn-block" onClick={onBegin} disabled={inGame || !isReady}>はじめ</button>
    <button type="button" className="btn btn-secondary btn-lg btn-block" onClick={onEnd} disabled={!inGame}>おわり</button>
    <button type="button" className="btn btn-warning btn-lg btn-block" onClick={onPause} disabled={!inGame || inTimeout}>まった！</button>
    <button type="button" className="btn btn-secondary btn-lg btn-block" onClick={onResume} disabled={!inGame || !inTimeout}>さいかい</button>
  </div>
)
