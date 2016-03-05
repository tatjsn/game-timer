import React from 'react';

export default ({show, onProceed, onDismiss}) => (
  !show ? <div /> :
    <div className="modal" style={{display: 'block'}}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" aria-label="Close" onClick={onDismiss}>
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 className="modal-title">Modal title</h4>
          </div>
          <div className="modal-body">
            <p>One fine body&hellip;</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onDismiss}>Close</button>
            <button type="button" className="btn btn-primary" onClick={onProceed}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
);
