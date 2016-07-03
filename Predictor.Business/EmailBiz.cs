using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using System.Net.Mail;
using System.Configuration;

using SendGrid;
using Exceptions;

namespace Predictor.Business
{
    public class EmailBiz
    {
        public static void SendGmail(string subject, string body, string sendTo) {
            string sendFrom = "zolachel@gmail.com";

            SmtpClient smtp = new SmtpClient {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(sendFrom, ConfigurationManager.AppSettings["gmail"])
            };

            using (MailMessage message = new MailMessage(sendFrom, sendTo) {
                Subject = subject,
                Body = body
            }) {
                smtp.Send(message);
            }
        }

        public static async Task SendGrid(string subject, string body, string sendTo) {
            SendGridMessage mailMessage = new SendGridMessage();

            mailMessage.AddTo(sendTo);
            mailMessage.From = new MailAddress("zolachel@gmail.com", "Beer");
            mailMessage.Subject = subject;
            mailMessage.Html = body;

            NetworkCredential credentials = new NetworkCredential(ConfigurationManager.AppSettings["SendGridUser"], ConfigurationManager.AppSettings["SendGridPassword"]);
            Web transportWeb = new Web(credentials);

            try {
                await transportWeb.DeliverAsync(mailMessage);
            } catch (InvalidApiRequestException ex) {
                var detail = new StringBuilder();

                detail.Append("ResponseStatusCode: " + ex.ResponseStatusCode + ".   ");
                for (int i = 0; i < ex.Errors.Count(); i++) {
                    detail.Append(" -- Error #" + i.ToString() + " : " + ex.Errors[i]);
                }

                throw new ApplicationException(detail.ToString(), ex);
            }
        }
    }
}
