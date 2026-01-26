const bcrypt = require("bcryptjs"); // Ensure you are using 'bcryptjs' based on your previous install
const userRepo = require("../repositories/userRepository");

class AuthService {
    async register({ email, fullName, password }) {
        const existing = await userRepo.findByEmail(email);
        if (existing) {
            throw new Error("⚠️ This email is already registered.");
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await userRepo.create({ email, fullName, passwordHash });
        return user;
    }

    async login({ email, password }) {
        const user = await userRepo.findByEmail(email);
        
        // ALERT 1: User Not Found
        if (!user) {
            throw new Error("🚫 User not found. Please register first.");
        }

        // ALERT 2: Wrong Password
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            throw new Error("🔑 Incorrect password. Please try again.");
        }

        return user;
    }
}

module.exports = new AuthService();