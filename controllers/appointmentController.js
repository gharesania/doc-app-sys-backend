const { Appointment, User } = require("../models");

const createAppointment = async (req, res) => {
  try {
    const { dateTime, doctorId } = req.body;

    if (!dateTime || !doctorId) {
      return res
        .status(400)
        .json({ msg: "dateTime and doctorId are required", success: false });
    }

    // if (!req.user || !req.user.id) {
    //   return res.status(401).json({msg: "Unauthorized", success: false,});
    // }

    const createdBy = req.user.id;

    const newAppointment = await Appointment.create({
      dateTime,
      doctorId,
      createdBy,
    });

    if (!newAppointment) {
      return res
        .status(200)
        .send({ msg: "Appointment not booked ⚠️", success: false });
    }

    return res
      .status(201)
      .json({
        msg: "Appointment bookted successfully ✅",
        success: true,
        data: newAppointment,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};

async function statusUpdateByDoctor(req, res) {
  const { ID } = req.params;
  console.log(ID, "________id_______");

  try {
    const updatedAppointment = await Appointment.update(
      {
        status: req.body.status,
        updatedBy: req.user.id,
      },
      {
        where: { id: ID },
      }
    );

    console.log(updatedAppointment, "updatedAppointment");

    if (updatedAppointment.length == 0) {
      return res
        .status(200)
        .send({ msg: "Appointment not updated ⚠️", success: false });
    }
    return res
      .status(200)
      .send({ msg: "Appointment status updated successfully ✅", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
}

async function updateAppointment(req, res) {
  const { ID } = req.params;
  const { dateTime, doctorId } = req.body;

  try {
    if (!dateTime || !doctorId) {
      return res.status(400).json({ msg: "DateTime and doctor are required" });
    }

    const [affectedRows] = await Appointment.update(
      { dateTime },
      {
        where: {
          id: ID,
          createdBy: req.user.id,
        },
      }
    );

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        msg: "Appointment not found or not authorized ❌",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Appointment updated successfully 👍🏻",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

async function deleteAppointment(req, res) {
  const { ID } = req.params;

  try {
    const deletedRows = await Appointment.destroy({
      where: {
        id: ID,
        createdBy: req.user.id,
      },
    });

    if (deletedRows === 0) {
      return res.status(404).json({
        success: false,
        msg: "Appointment not found or not authorized",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Appointment deleted successfully ✅",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

async function getAppointmentsByUser(req, res) {
  try {
    const appointments = await Appointment.findAll({
      where: { createdBy: req.user.id },
    });

    if (appointments.length == 0) {
      res.status(400).send({ msg: "No appointments yet" });
    }
    res.status(200).send({ appointments: appointments, success: true });
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
}

async function showAppointmentsOfDoctor(req, res) {
  try {
    // req.userid (docotr id )

    const appointments = await Appointment.findAll({
      where: { doctorId: req.user.id },
    });

    if (appointments.length == 0) {
      res.status(400).send({ msg: "No appointments yet" });
    }
    
    res.status(200).send({ appointments: appointments, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
}

module.exports = {
  createAppointment,
  statusUpdateByDoctor,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByUser,
  showAppointmentsOfDoctor,
};
