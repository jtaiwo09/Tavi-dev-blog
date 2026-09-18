export default () => {
  return {
    jwt: {
      accessSecret: process.env.JWT_ACCESS_SECRET,
      accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    },
    nodemailer: {
      host: process.env.MAIL_HOST ?? 'smtp.resend.com',
      port: process.env.MAIL_PORT ?? 587,
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
      from: process.env.MAIL_FROM,
    },
    resend: {
      from: process.env.RESEND_FROM_EMAIL,
      apiKey: process.env.RESEND_API_KEY,
    },
    app: {
      baseUrl: process.env.APP_BASE_URL,
      mailDriver: process.env.MAIL_DRIVER,
      env: process.env.APP_ENV,
    },
  };
};
