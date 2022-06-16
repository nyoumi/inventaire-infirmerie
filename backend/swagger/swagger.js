const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger/swagger.json'
const endpointsFiles = ['./app.js']

const doc = {
    info: {
        version: "1.0.0",
        title: "Pharmacy management api",
        description: "Documentation des api utilisés sur le backend du projet inventaire",
        license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
        },
        contact: {
            name: 'Nyoumi paul',
            email: 'nyoumipaul@yahoo.fr',
            url: 'https://github.com/nyoumi'
        }
    },
    security:[
       {
        bearerAuth: []  
       }

    ]
    ,
         
    host: "localhost:8087",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
        servers: [
        {
            url: 'http://localhost:8087/api/v1',
            description: 'Local server'
        }
    ],
    components : {
        securitySchemes : {
            bearerAuth : {
                type: "http",
                sheme: "bearer",
                bearerFormat : "JWT"
            }
        }
    }
}

/* app.use("/api/supplier",supplierRoutes);
app.use("/api/inventory",inventoryRoutes);
app.use("/api/user",userRoutes);
app.use("/api/sales",salesRoutes);
app.use("/api/doctorUser",doctorUserRoutes);
app.use("/api/doctorOder",doctorOderRoutes);
app.use("/api/verifiedDoctorOder",verifiedDoctorOderRoutes);
app.use("/api/pickedUpOders",pickedUpOdersRoutes);
 */
swaggerAutogen(outputFile, endpointsFiles,doc) 