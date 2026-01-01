const User = require("./userModel");
const Appointment = require("./appointmentModel");

// Patient → Appointment
User.hasMany(Appointment, { foreignKey: "createdBy" });
Appointment.belongsTo(User, { foreignKey: "createdBy", as: "patient" });

// Doctor → Appointment
User.hasMany(Appointment, { foreignKey: "doctorId" });
Appointment.belongsTo(User, { foreignKey: "doctorId", as: "doctor" });

// Updated By → User
Appointment.belongsTo(User, { foreignKey: "updatedBy", as: "updatedByUser" });

module.exports = {User,Appointment,};