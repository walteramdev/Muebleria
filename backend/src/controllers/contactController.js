const nodemailer = require('nodemailer');

const sendContactEmail = async (req, res) => {
  try {
    const { name, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "El mensaje es obligatorio." });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Faltan las credenciales EMAIL_USER o EMAIL_PASS en el .env");
      return res.status(500).json({ error: "El servidor no está configurado para enviar correos." });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Te envías el correo a ti misma
      subject: `Consulta Web de: ${name || "Anónimo"}`,
      text: `Nombre: ${name || "No especificado"}\n\nMensaje:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ success: true, message: "Consulta enviada correctamente." });
  } catch (error) {
    console.error("Error detallado al enviar correo:", error);
    res.status(500).json({ error: "Hubo un problema al intentar enviar el mensaje." });
  }
};

module.exports = {
  sendContactEmail,
};
