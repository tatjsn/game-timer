import React from 'react';

const callTimeSet = onTimeSet => event => {
  onTimeSet(event.target.value);
}

export default ({ onTimeSet }) => (
  <div>
    <input type="number" pattern="\d*" className="form-control form-control-lg text-xs-center p-y-3" placeholder="じかん" onBlur={callTimeSet(onTimeSet)}  />
  </div>
)
