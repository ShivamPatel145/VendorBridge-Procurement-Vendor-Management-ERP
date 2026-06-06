import { Resend } from 'resend';
import { env } from '../../config/env';
import prisma from '../../config/database';

const hasResendEnv = !!env.RESEND_API_KEY;
const resend = hasResendEnv ? new Resend(env.RESEND_API_KEY) : null;

if (!hasResendEnv) {
  console.warn('⚠️ Resend API Key is missing. Using mock email service (logs to DB and console).');
}

export class EmailService {
  public static async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    template: string;
  }): Promise<{ success: boolean; resendId?: string }> {
    const { to, subject, html, template } = params;

    if (!hasResendEnv || !resend) {
      console.log(`[MOCK EMAIL] To: ${to}\nSubject: ${subject}\nTemplate: ${template}\n----------------------------------`);
      
      try {
        await prisma.emailLog.create({
          data: {
            to,
            subject,
            template,
            status: 'MOCKED',
            resendId: 'mock_resend_id_' + Date.now(),
          },
        });
      } catch (err) {
        console.error('Failed to log mock email to DB:', err);
      }
      return { success: true, resendId: 'mock_resend_id_' + Date.now() };
    }

    try {
      const result = await resend.emails.send({
        from: env.EMAIL_FROM,
        to,
        subject,
        html,
      });

      const resendId = result.data?.id || undefined;
      const status = result.error ? 'FAILED' : 'SENT';

      await prisma.emailLog.create({
        data: {
          to,
          subject,
          template,
          status,
          resendId,
        },
      });

      if (result.error) {
        console.error('Resend email failed:', result.error);
        return { success: false };
      }

      return { success: true, resendId };
    } catch (err) {
      console.error('Email sending exception:', err);
      try {
        await prisma.emailLog.create({
          data: {
            to,
            subject,
            template,
            status: 'ERROR',
          },
        });
      } catch (dbErr) {
        console.error('Failed to log email error to DB:', dbErr);
      }
      return { success: false };
    }
  }
}

export default EmailService;
