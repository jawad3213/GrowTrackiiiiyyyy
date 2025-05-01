const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS 
    }
});

exports.contactus = async (req, res) => {
    const { Email, FirstName, LastName, Phone, Message } = req.body;
  
    const mailOptions = {
      from: `"${FirstName} ${LastName}" <${Email}>`,
      to: process.env.EMAIL_USER, 
      subject: "Nouveau message via Contact Us",
      html: `
        <h2>Nouvelle demande de contact</h2>
        <p><strong>Nom :</strong> ${FirstName} ${LastName}</p>
        <p><strong>Email :</strong> ${Email}</p>
        <p><strong>Téléphone :</strong> ${Phone}</p>
        <p><strong>Message :</strong><br/>${Message}</p>
      `,
    };
  
    try {
      const sent = await transporter.sendMail(mailOptions);
      if (sent) {
        return res.status(200).json({ message: "Message envoyé avec succès !" });
      } else {
        return res.status(500).json({ message: "Échec de l'envoi du message." });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur lors de l'envoi de l'email." });
    }
  };
  