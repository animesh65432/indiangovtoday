import { Request, Response } from "express"
import { asyncerrorhandler } from "../middleware/ayncerrorhandler"
import { connectDB } from "../db/aleart"
import nodemailer from "nodemailer"
import config from "../config"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
    },
});

export const AddSubscribe = asyncerrorhandler(async (req: Request, res: Response) => {
    const { Email } = req.body


    if (!Email) {
        res.status(400).json({
            message: "Email is required"
        })
        return
    }

    const SubscribeDb = await connectDB();


    const checkalreadysubscribe = await SubscribeDb.collection("Subscribe").findOne({ Email })

    if (checkalreadysubscribe) {
        res.status(409).json({
            message: "Email is already subscribed"
        })
        return
    }


    await SubscribeDb.collection("Subscribe").insertOne({ Email });

    const mailOptions = {
        from: config.EMAIL_USER,
        to: Email,
        subject: "Thank you for subscribing to indiangovtoday.app!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 20px 0;">
              <img src="https://indiangovtoday.app/Logo.png" alt="Indian Gov Today Logo" style="max-width: 200px; height: auto;" />
            </div>
            <h1 style="color: #333;">Hello!</h1>
            <p>Thank you for subscribing to our updates on <strong>theseindiangovtoday.app</strong>.</p>
            <p>We'll keep you informed about important Indian government announcements.</p>
            <p>Best regards,<br>The team at indiangovtoday.app</p>
          </div>
        `,
    };

    await transporter.sendMail(mailOptions)

    res.status(201).json({
        message: "Successfully subscribed"
    })
    return
})