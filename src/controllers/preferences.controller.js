// controllers/preferencesController.js

const userService = require('../services/user.service');
const investorService = require('../services/investor.service');

// Controlador para actualizar las preferencias
async function updatePreferences(req, res) {
  try {
    const { role, responses } = req.body;

    
    const userId = req.user._id;
    console.log('role :>> ', role, userId, responses);

    // return res.status(200).json({ message: 'Preferencias actualizadas correctamente' });

    if (!userId || !role || !responses) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    // Llamar al servicio correspondiente según el rol
    if (role === 'user') {
      await userService.updateUserPreferences(userId, responses);
    } else if (role === 'investor') {
      await investorService.updateInvestorPreferences(userId, responses);
    } else {
      return res.status(400).json({ message: 'Rol no válido' });
    }

    return res.status(200).json({ message: 'Preferencias actualizadas correctamente' });
  } catch (error) {
    console.error('Error al actualizar las preferencias:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
}

module.exports = {
  updatePreferences
};
