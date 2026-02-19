import React from 'react';
import '../../components/Footer/Footer.css'; // For glass-panel styles via global or component import, but actually glass-panel is in glass.css which is imported in index.css

const PrivacyPolicy = () => {
    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h1>Privacy Policy</h1>
                <p>Last updated: February 19, 2026</p>

                <br />
                <section>
                    <h2>1. Introduction</h2>
                    <p>Welcome to the Product Review System. We respect your privacy and are committed to protecting your personal data.</p>
                </section>

                <br />
                <section>
                    <h2>2. Data We Collect</h2>
                    <p>We may collect personal information such as your name, email address, and profile details when you register or use our services.</p>
                </section>

                <br />
                <section>
                    <h2>3. How We Use Your Data</h2>
                    <p>We use your data to provide and improve our services, manage your account, and communicate with you.</p>
                </section>

                <br />
                <section>
                    <h2>4. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us.</p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
