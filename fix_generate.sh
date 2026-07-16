sed -i 's/const generateRouter = express.Router();/const generateRouter = express.Router();\n\nconst jobMap = new Map<string, any>();\n/' src/server/routes/generate.ts
