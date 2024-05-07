import EmailModel from '../schemas/email.schema'
import sendGridMail from "@sendgrid/mail";

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
    public async sendEmail(data: any) {
        console.log(data);
        const emailModel = new EmailModel(data);
        await emailModel.save();

        const msg = {
            to: data.recipient,
            from: emailModel.sender,
            subject: data.subject,
            text: data.message,
            html: `<strong>${data.message}</strong>`
        }
        try {
            await sendGridMail.send(msg);
            console.log('Test email sent successfully');
        } catch (error) {
            console.error('Error sending email', error);
            throw new Error('Error sending email');
        }

    }
}

export default EmailService;
