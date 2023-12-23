export const emailTemplate = ({ username, code }: { username: string; code: string }) => {
  const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BookGod - Author Verification</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
    }

    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #3498db;
    }

    .content {
      line-height: 1.6;
    }

    .verification-code {
      font-size: 28px;
      font-weight: bold;
      color: #2ecc71;
    }

    .footer {
      text-align: center;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">BookGod</div>
      <h2>Email Verification</h2>
    </div>
    
    <div class="content">
      <p>Hello BookGod ${username},</p>
      <p>Thank you for signing up! To complete your registration, please use the following verification code:</p>
      
      <p class="verification-code">${code}</p>
      
      <p>This code will expire in 15 minutes. If you did not sign up for BookGod, you can ignore this email.</p>
    </div>

    <div class="footer">
      <p>Thank you for choosing BookGod!</p>
    </div>
  </div>
</body>
</html>
`;

  return template;
};
