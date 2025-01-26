import nodemailer from 'nodemailer';
import { GMAIL_USER, GMAIL_PASS } from '../config.js';


console.log(GMAIL_USER, GMAIL_PASS);
 // Crea un objeto de transporte para enviar correos electrónicos
export const transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS,
    },
});
