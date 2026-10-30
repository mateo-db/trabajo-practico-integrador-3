import bcrypt from "bcryptjs";

// Hashear contraseña
export const hashPassword = async (password) => {
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
};

// Verificar contraseña
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};