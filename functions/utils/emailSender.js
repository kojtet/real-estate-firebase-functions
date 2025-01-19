// utils/emailSender.js
const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Ensure that SENDGRID_API_KEY and SENDER_EMAIL are set
if (!process.env.SENDGRID_API_KEY || !process.env.SENDER_EMAIL) {
    console.error('SendGrid API key or sender email is not set in environment variables.');
    process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Converts HTML content to plain text.
 * For better conversion, consider using libraries like 'html-to-text'.
 * This implementation strips HTML tags as a basic approach.
 * @param {string} html - The HTML content.
 * @returns {string} - The plain text representation of the HTML.
 */
const convertHtmlToText = (html) => html.replace(/<[^>]*>?/gm, '');

/**
 * Sends an email using SendGrid.
 * @param {Object} options - Email sending options.
 * @param {string} options.to - Recipient email address.
 * @param {string} options.subject - Email subject.
 * @param {string} [options.text] - Plain text content.
 * @param {string} [options.html] - HTML content.
 * @returns {Promise<void>} - Resolves on success, rejects on failure.
 */
const sendEmail = async ({ to, subject, text, html }) => {
    // Validate email sending parameters
    if (!to || !subject || (!text && !html)) {
        throw new Error('Missing required parameters: to, subject, and either text or html content.');
    }

    // If text is not provided, generate it from html
    const plainText = text || (html ? convertHtmlToText(html) : null);

    const msg = {
        to, // Recipient email
        from: process.env.SENDER_EMAIL, // Verified sender email
        subject,
        text: plainText,
        html,
    };

    try {
        await sgMail.send(msg);
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error.response ? error.response.body : error.message);
        throw new Error('Email sending failed.');
    }
};

module.exports = {
    sendEmail,
};