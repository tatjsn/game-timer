import React from 'react';

export default ({ input, onChange, inGame }) => (
  <div>
    <input type="text" value={input} onChange={onChange} disabled={inGame} />
  </div>
)
