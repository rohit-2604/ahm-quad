import React, { useState } from 'react';
import ChooseSensor from './ChooseSensor';
import Range from './Range';
import DiagnosisMain from './DiagnosisMain';

function Diagnosis({ setDiagnosisOpen }) {
    const [RangeForDE, setRangeForDE] = useState(false);
    const [RangeForNDE, setRangeForNDE] = useState(false);
    const [showDiagnosisMain, setShowDiagnosis] = useState(false)
    const [RangeData, setRangeData] = useState();




    return (
        <div className='w-full'>

            {!RangeData && (
                <Range setRangeData={setRangeData} RangeData={RangeData} />
            )}

            {RangeData && <DiagnosisMain RangeData={RangeData} />}
        </div>
    );
}


export default Diagnosis;
