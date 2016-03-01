import React from 'react';

const normalizeTime = num => {
  return (num > 9 ? '' : '0') + num;
}

export default ({ time }) => (
  <div>
    <p className="display-2 text-xs-center">
      {normalizeTime(Math.floor(time / 60))}:{normalizeTime(time % 60)}
    </p>
  </div>
);
