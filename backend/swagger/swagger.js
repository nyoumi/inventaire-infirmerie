const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger/swagger.json'
const endpointsFiles = ['./app.js']

/* app.use("/api/supplier",supplierRoutes);
app.use("/api/inventory",inventoryRoutes);
app.use("/api/user",userRoutes);
app.use("/api/sales",salesRoutes);
app.use("/api/doctorUser",doctorUserRoutes);
app.use("/api/doctorOder",doctorOderRoutes);
app.use("/api/verifiedDoctorOder",verifiedDoctorOderRoutes);
app.use("/api/pickedUpOders",pickedUpOdersRoutes);
 */
swaggerAutogen(outputFile, endpointsFiles) 