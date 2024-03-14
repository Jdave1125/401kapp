import React,{useState} from 'react';
import Chart from 'react-google-charts';
import './report.css';

function ViewReport({ userInput, totalBalance, chartData, options }) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  //POST req for backend endpoint to email report
  const handleEmailReport = () => {


  fetch('https://verc-test-six.vercel.app/send-report',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
    },
    body: JSON.stringify({
      userEmail:email,
      reportData:{userInput, totalBalance, chartData, options},
    }),
  })
    .then((response) =>{
      if(response.ok){
        setEmailSent(true);
      }else{
        throw new Error('Failed to send email')
      }
    })
    .catch((error) =>{
      console.error("Error:",error)
    })
  }

  const chunkArray = (arr, chunkSize) => {
    const chunkedArray = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunkedArray.push(arr.slice(i, i + chunkSize));
    }
    return chunkedArray;
  };

  const chunkedData = chunkArray(chartData, 10); // Chunk the data into arrays of 10 rows each

  return (
    <div className='report-container'>
      <h1 className='header'>Report</h1>
      <div className='xcard'>
        {/* <h2>Input Categories and User Inputs:</h2> */}
        <p>Age: {userInput.age}</p>
        <p>Retire at: {userInput.retireAt}</p>
        <p>Current Balance: {userInput.curBal}</p>
        <p>Yearly Contribution: {userInput.cont}</p>
        <p>Salary: {userInput.salary}</p>
        <p>Rate: {userInput.rate}</p>
      </div>

      <div className='chart-card'>
        <Chart
          chartType='ColumnChart'
          data={chartData}
          options={options}
          width="100%"
          height="100%"
          legendToggle={true}
        />
      </div>

      <div className='rcard'>
        {chunkedData.map((chunk, index) => (
          <table key={index}>
            <thead>
              <tr>
                <th>Age</th>
                <th>Total Balance</th>
              </tr>
            </thead>
            <tbody>
              {chunk.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>



      <button className="email" onClick={() => setShowModal(true)}>Email Report</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>Enter your email</h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={handleEmailReport} disabled={emailSent}>
              {emailSent ? 'Report Sent' : 'Send Report'}
            </button>
            {emailSent && <p>Email successfully sent, you can now close this prompt.</p>}
          </div>
        </div>
      )}

      
    </div>
  );
}

export default ViewReport;
