const speakeasy = require('speakeasy');
const qr = require('qr-image');

class TwoFactorAuth {
  // Generar secreto para 2FA
  static generateSecret(email) {
    return speakeasy.generateSecret({
      name: `Lab App (${email})`,
      issuer: 'Lab Application',
      length: 20
    });
  }

  // Generar código QR en base64
  static generateQRCode(secret) {
    try {
      const qrSvg = qr.imageSync(secret.otpauth_url, { type: 'svg' });
      return qrSvg.toString('base64');
    } catch (error) {
      throw new Error('Error generando código QR: ' + error.message);
    }
  }

  // Verificar token 2FA
  static verifyToken(secret, token) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 1 // Permite 30 segundos de margen
    });
  }

  // Generar token temporal (para testing)
  static generateToken(secret) {
    return speakeasy.totp({
      secret: secret,
      encoding: 'base32'
    });
  }
}

module.exports = TwoFactorAuth;