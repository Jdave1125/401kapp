import { useState } from 'react'
import './App.css';
import {BrowserRouter as Router, Route , Routes, Link} from 'react-router-dom';
import Chart from 'react-google-charts';
import Navbar from './navbar';
import Report from './ViewReport';
import ViewReport from './ViewReport';


function App() {
 
  const[userInput,setUserInput] = useState({
    age:'30',
    retireAt:'65',
    curBal:'1500',
    cont:'5.5',
    salary:'48900',
    rate:'7',
  })

  const handleInputChange =(e)=>{
    const {name,value} = e.target;
    setUserInput((prevUserInput) => ({...prevUserInput,[name]:value}))
  }
  
  const totalBalance = () => {
    const yearsUntilRetirement = parseInt(userInput.retireAt) - parseInt(userInput.age);
    const yearlyContribution = (parseFloat(userInput.cont) / 100) * parseFloat(userInput.salary);
    let yearlyBalance = parseFloat(userInput.curBal);
    let currentBalance = yearlyBalance;
  
    for (let i = 0; i < yearsUntilRetirement; i++) {
      const yearlyInterest = (parseFloat(userInput.rate) / 100) * currentBalance;
      yearlyBalance = currentBalance + yearlyContribution + yearlyInterest;
      currentBalance = yearlyBalance;
    }
  
    return yearlyBalance.toFixed(2);
  };

const options = {
  title : "My 401k Balance",
  titleTextStyle:{color:'lightblue',fontSize:25,position:'center'},
  // chartArea: {width:'100%',height:'100%'},
  legend:{position:'right'},
  hAxis:{
    title: "Age"
  },
  vAxis:{
    title:'401k Balance'
  }
}

const chartData = () => {
  const yearsUntilRetirement = parseInt(userInput.retireAt) - parseInt(userInput.age);
  const totalBalances = [];
  let currentBalance = parseFloat(userInput.curBal);

  for (let i = 0; i <= yearsUntilRetirement; i++) {
      const age = parseInt(userInput.age) + i;
      const yearlyContribution = parseFloat(userInput.cont) / 100 * parseFloat(userInput.salary);
      currentBalance += yearlyContribution; // Update balance with yearly contribution
      totalBalances.push([age, currentBalance]);
  }

  return [
      ['Age', 'Total Balance'],
      ...totalBalances,
  ];

};



  return (
    <Router>
      
      <Navbar />
      <Routes>
        <Route 
          path='/'
          element={
      <div className='container'>
      <h1 className='header'>Calculate your balance!</h1>
        <div className='card input-card'>
          <label htmlFor='imageUrl'>Age:</label>
          <input
            type='text'
            id='age'
            name='age'
            value={userInput.age}
            onChange={handleInputChange}
            />

         <label htmlFor='retireAt'>Retire at:</label>
         <input
            type='text'
            id='retireAt'
            name='retireAt'
            value={userInput.retireAt}
            onChange={handleInputChange}
          />

          <label htmlFor='title'>Current Balance:</label>
          <input
            type='text'
            id='curBal'
            name='curBal'
            value={userInput.curBal}
            onChange={handleInputChange}
          />


          <label htmlFor='description'>Percentage of Salary to contribute yearly:</label>
          <input
            type='text'
            id='cont'
            name='cont'
            value={userInput.cont}
            onChange={handleInputChange}
          />

          <label htmlFor='salary'>Salary:</label>
          <input
            type='text'
            id='salary'
            name='salary'
            value={userInput.salary}
            onChange={handleInputChange}
          />


         <label htmlFor='rate'>Rate of Return (%):</label>
          <input
            type='text'
            id='rate'
            name='rate'
            value={userInput.rate}
            onChange={handleInputChange}
            /> 
        
          </div>

        <div className='card blog-card'>

          <h2> Your estimated total balance at retirement is: </h2>
          <h1>{totalBalance()}</h1>
          <hr></hr>
          
          <h5>Kalc</h5>
          <Link to= "/view-report">
            <button>View Report</button>
          </Link>
        </div>
       

  
      <div className='chart'>
      <Chart
            chartType='ColumnChart'
            data={chartData()}
            options={options}
            width="100%"
            height="100%"
            legendToggle = 'true'
            
            />
      </div>
      </div>
          }/>
      
        <Route path='/view-report' element={
           <ViewReport 
           userInput={userInput}
           totalBalance={totalBalance()}
           chartData={chartData()}
           options={options}
           />
        } />
      </Routes>
    </Router>
  )
}

export default App
