import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Backend API - Coderhouse",
      version: "1.0.0",
      description: "Documentación de API para productos, carritos y sesiones",
    },
  },
  apis: ["./src/docs/**/*.yaml"],
};

export const swaggerSpecs = swaggerJSDoc(swaggerOptions);
export { swaggerUi };
