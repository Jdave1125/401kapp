// server.cjs
import express from 'express';
import cors from 'cors';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());


// Set SendGrid API key securely
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// console.log(sgMail.setApiKey(process.env.SENDGRID_API_KEY))
app.use(cors({
  origin: ['https://401kapp.vercel.app'],
  methods: ['GET', 'POST'],
  credentials:true
}));

app.get('/', (req,res)=>{
  res.json("Hello")
})

app.post('/send-report', async (req, res) => {
    try {
        console.log('Received POST request to send report');
        console.log('Request body:', req.body);

        const { userEmail, reportData } = req.body;
        console.log('reportData',reportData)
        // Create HTML boilerplate with dynamic content
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Financial Report</title>
          <style>
            body {color:black; border:1px solid black}
            h1 {color:royalblue;}
            h2 {color:royalblue;}
          </style>
        </head>
        <body>
          <h1>Your Financial Report</h1>
          <p>Hi ${userEmail},</p>
          <p>Here is your financial report data:</p>
          <ul>
            <li>Age: ${reportData.userInput.age}</li>
            <li>Retire Age: ${reportData.userInput.retireAt}</li>
            <li>Current 401k Balance: ${reportData.userInput.curBal}</li>
            <li>Contribution%: ${reportData.userInput.cont}</li>
            <li>Salary: ${reportData.userInput.salary} </li>
      </ul\>
      <p\>With a salary of <b\></span>${reportData.userInput.salary}</b> and yearly contribution of <b>${reportData.userInput.cont}%</b>, you will have an estimated balance of <b\>${reportData.totalBalance}</b> at <b>${reportData.userInput.retireAt}</b> years old.</p>
      
          <h2>Estimated Balance Breakdown:</h2>
          ${Object.entries(reportData.chartData).map(([key, value]) => `
            <p><b>AGE: ${value[0]}</b> - <b>TOTAL BALANCE: ${value[1]}</b></p>
          `)}
      
          <p>Sincerely,</p>
          <p>401Kalc</p>
          <p><i>These are estimates only, take these figures with a grain of salt</i></p>
        </body>
        </html>
      `;

        // Configure email message options
        const msg = {
            from: '401kalc@gmail.com',
            to: userEmail,
            subject: 'Your Financial Report',
            html: htmlContent,
        };

        // Send the email with SendGrid
        await sgMail.send(msg);

        res.json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
