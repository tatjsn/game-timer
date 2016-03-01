import React from 'react';

export default ({ input, onChange, inGame }) => (
  <div>
    <input type="number" pattern="\d*" className="form-control" placeholder="じかん" value={input} onChange={onChange} disabled={inGame} />
  </div>
)
