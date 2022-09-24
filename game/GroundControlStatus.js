import React, { Component, useState, useEffect } from 'react';
import { getDatabase, ref, query, orderByChild, onValue, orderByValue, set, update } from 'firebase/database';

function GroundControlStatus() {
    const [status, setStatus] = useState();

    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, '/gameplay/groundcontrol');
        onValue(reference, (snapshot) => {
            setStatus(snapshot.val());
        });
    }, [status]);
    return status;
}

export default GroundControlStatus;