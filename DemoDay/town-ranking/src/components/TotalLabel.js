// TotalLabel.js
import React from 'react';

function TotalLabel({ total }) {
    return (
        <div className="total-label">
            Total: {total.toFixed(2)}
        </div>
    );
}

export default TotalLabel;
