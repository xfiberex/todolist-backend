export const requirePublicRegistrationEnabled = (req, res, next) => {
  if (process.env.ENABLE_PUBLIC_REGISTRATION === '1') return next();
  return res.status(403).json({ msg: 'Registro público deshabilitado' });
};

export const requireForgotPasswordEnabled = (req, res, next) => {
  // Bloquear si la funcionalidad global está deshabilitada
  if (process.env.ENABLE_FORGOT_PASSWORD !== '1') {
    return res.status(200).json({ msg: 'Si el correo existe, te hemos enviado un email con las instrucciones' });
  }

  // Opcional: impedir reset para la cuenta demo (si definida)
  const demoEmail = process.env.DEMO_USER_EMAIL;
  if (demoEmail && req.body?.email && String(req.body.email).toLowerCase() === String(demoEmail).toLowerCase()) {
    return res.status(200).json({ msg: 'Si el correo existe, te hemos enviado un email con las instrucciones' });
  }

  // Continuar con el flujo normal
  return next();
};
