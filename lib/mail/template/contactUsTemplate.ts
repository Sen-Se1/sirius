export const contactUsTemplate = (
  name: string,
  email: string,
  message: string
) => {
  return `
      <html>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 20px auto; padding: 20px; background: #ffffff; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
        
          <!-- Header -->
          <div style="text-align: center; padding: 20px 0;">
            <img src="https://www.obeosoft.com/images/logos/logo_Sirius.png" alt="Company Logo" width="120" height="40" />
          </div>
  
          <!-- Main Content -->
          <div style="background: #1a1f36; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
            <h2 style="margin: 0; font-size: 22px;">New Contact Request</h2>
          </div>
  
          <!-- Body -->
          <div style="padding: 20px;">
            <p style="color: #666666; font-size: 16px;">Hello,</p>
            <p style="color: #666666; font-size: 16px;">
              You have received a new contact request via the online form. Here are the details:
            </p>
  
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 15px;">
              <p style="color: #333333; font-size: 16px;"><strong>Name:</strong> ${name}</p>
              <p style="color: #333333; font-size: 16px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #1a1f36; text-decoration: none;">${email}</a></p>
              <p style="color: #333333; font-size: 16px;"><strong>Message:</strong></p>
              <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-top: 10px;">"${message}"</p>
            </div>
  
            <p style="color: #999999; font-size: 14px; font-style: italic; text-align: center; margin-top: 20px;">
              Please respond to this request as soon as possible.
            </p>
          </div>
  
          <!-- Footer -->
          <div style="background: #1a1f36; color: #ffffff; padding: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
            <div style="margin-bottom: 15px;">
              <a href="#" style="margin: 0 10px; color: #ffffff; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" width="24" height="24" alt="Facebook" />
              </a>
              <a href="#" style="margin: 0 10px; color: #ffffff; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/124/124021.png" width="24" height="24" alt="Twitter" />
              </a>
              <a href="#" style="margin: 0 10px; color: #ffffff; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="24" height="24" alt="Instagram" />
              </a>
              <a href="#" style="margin: 0 10px; color: #ffffff; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/124/124011.png" width="24" height="24" alt="LinkedIn" />
              </a>
            </div>
            <p style="font-size: 14px; margin: 5px 0;">1912 Mcwhorter Road, FL 11223</p>
            <p style="font-size: 14px; margin: 5px 0;">
              +111.222.333 | <a href="mailto:info@company.com" style="color: #ffffff; text-decoration: underline;">info@company.com</a>
            </p>
            <p style="font-size: 14px; margin-top: 10px;">Company © All rights reserved</p>
          </div>
  
        </div>
      </body>
      </html>
    `;
};