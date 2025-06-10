const express = require("express")
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const { ResetPassEmail, check } = require('./controllers/authController');
const cors = require('cors');
const { ServerLimiter } = require('./middlewares/Limiter');
const { verifyResetToken } = require('./middlewares/VerifyToken')
const path = require('path')
const ejs = require('ejs');
const puppeteer = require('puppeteer');

const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true
}

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection)

const helmet = require('helmet');
app.use(helmet({
    hsts: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.get('/api/csrf-token', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken(), {
        httpOnly: false,
        sameSite: 'Strict',
        secure: false
    });
    res.status(200).json({ message: 'CSRF token sent' });
});

const AuthRoute = require("./routes/AuthRoute");
app.use("/api/auth", AuthRoute)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const studentRoute = require("./routes/adminRoutes/studentRoute");
const professorRoute = require("./routes/adminRoutes/professorRoute");
const supervisorRoute = require("./routes/adminRoutes/supervisorRoute");
const skillRoute = require("./routes/adminRoutes/skillRoute");
const classRoute = require("./routes/adminRoutes/classRoute");
const coachRoute = require("./routes/adminRoutes/coachRoute");
const signalRoute = require("./routes/adminRoutes/signalRoute");
const profileRoute = require("./routes/adminRoutes/profileRoute");

app.use(ServerLimiter);

app.use("/admin/students", studentRoute);
app.use("/admin/professors", professorRoute);
app.use("/admin/supervisors", supervisorRoute);
app.use("/admin/skills", skillRoute);
app.use("/admin/class", classRoute);
app.use("/admin/coachs", coachRoute);
app.use("/admin/signals", signalRoute);
app.use("/admin/profile", profileRoute);

const authRules = require('./validators/authrules');
const { validate } = require('./middlewares/validate');
app.get('/api/validate-reset-token', verifyResetToken, check)
app.post('/api/resetpass', validate(authRules.Password), verifyResetToken, ResetPassEmail);

const contactus = require("./routes/contactusRoute");
app.use("/api/contactus", contactus)

const hashRoute = require("./routes/HashRoute");
app.use("/api/hash", hashRoute)

const DashAdminRoute = require("./routes/adminRoutes/AdminDashboardRoute");
app.use("/api/DashAdmin", DashAdminRoute)

const EvaluationAdminRoute = require("./routes/adminRoutes/GlobalOverView_Route");
app.use("/api/GlobalOverView", EvaluationAdminRoute)

const prof_evaluation_history = require("./routes/professorRoutes/Evaluation_Route_history");
app.use("/api/prof_evaluation_history", prof_evaluation_history)

const prof_evaluation_classes = require("./routes/professorRoutes/Evaluation_Route_classes");
app.use("/api/prof_evaluation_classes", prof_evaluation_classes)

const prof_project_management = require("./routes/professorRoutes/project_management_Route");
app.use("/api/prof_project_management", prof_project_management)

const prof_signal_history = require("./routes/professorRoutes/signal_history_Route");
app.use("/api/signal_history", prof_signal_history)

const prof_signal_classes = require("./routes/professorRoutes/signal_classes_Route");
app.use("/api/signal_classes", prof_signal_classes)

const dashRoute = require("./routes/profRoutes/dashRoute");
app.use("/prof/dashboard", dashRoute);

const student_report = require("./routes/professorRoutes/student_report");
app.use("/api/report", student_report)

const dashstudent = require("./routes/studentRoutes/dashRoutes");
app.use("/student/dashboard", dashstudent);

const prjectStudent = require("./routes/studentRoutes/projectRoute");
app.use("/student/projects", prjectStudent);

const notifiRoute = require("./routes/studentRoutes/notifiRoute");
app.use("/student/notifications", notifiRoute);

app.post('/api/generate-pdf', async (req, res) => {
    try {
        console.log('hit generate-pdf')
        const { profile, evale, signals, commentResults } = req.body;

        if (
            !profile || typeof profile !== 'object' || Array.isArray(profile) ||
            !evale || typeof evale !== 'object' || Array.isArray(evale) ||
            !signals || typeof signals !== 'object' || Array.isArray(signals) ||
            !commentResults || typeof commentResults !== 'object' || Array.isArray(commentResults)
        ) {
            return res.status(400).json({ error: 'Invalid or missing data in request body.' });
        }

        const html = await ejs.renderFile(
            path.join(__dirname, 'views', 'invoice.ejs'),
            { profile, evale, signals, commentResults }
        );

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
        });

        await browser.close();

        res.status(200)
            .header('Content-Type', 'application/pdf')
            .header('Content-Disposition', 'attachment; filename=profile.pdf')
            .send(pdfBuffer);

    } catch (err) {
        console.error('PDF generation error:', err);
        res.status(500).json({ error: 'PDF generation failed.' });
    }
});

// ✅ Route de santé pour le Healthcheck Docker
app.get('/health', (req, res) => {
    res.status(200).send('OK it is Running');
});

// Lancement du serveur uniquement si exécuté directement
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`✅ Server Running on http://localhost:${PORT}`);
    });
}

// Export de l'application pour les tests
module.exports = app;
