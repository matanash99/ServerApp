const authService = require("../services/authService");

class AuthController {
    
    // GET /auth/register
    showRegister(req, res) {
        res.render("register", { error: null });
    }

    // POST /auth/register
    async register(req, res) {
        try {
            const { email, fullName, password } = req.body;
            const user = await authService.register({ email, fullName, password });

            // Store user in session
            req.session.user = { id: user.id, email: user.email, fullName: user.fullName };

            // Redirect to Home (Root)
            res.redirect("/");
        } catch (err) {
            res.status(400).render("register", { error: err.message });
        }
    }

    // GET /auth/login
    showLogin(req, res) {
        res.render("login", { error: null });
    }

    // POST /auth/login
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await authService.login({ email, password });

            req.session.user = { id: user.id, email: user.email, fullName: user.fullName };

            res.redirect("/");
        } catch (err) {
            res.status(400).render("login", { error: err.message });
        }
    }

    // POST /auth/logout
    logout(req, res) {
        req.session.destroy((err) => {
            if (err) console.error("Logout error:", err);
            
            // Clear the cookie so the browser knows the session is gone
            res.clearCookie("connect.sid");
            
            // Redirect back to the LOGIN page (now at /auth/login)
            res.redirect("/auth/login");
        });
    }
}

module.exports = new AuthController();