import React from 'react';

const TermsOfService = () => {
    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h1>Terms of Service</h1>
                <p>Last updated: February 19, 2026</p>

                <br />
                <section>
                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing or using the Product Review System, you agree to be bound by these Terms of Service.</p>
                </section>

                <br />
                <section>
                    <h2>2. User Content</h2>
                    <p>You are responsible for the content you post, including reviews and comments. Ensure your contributions are lawful and respectful.</p>
                </section>

                <br />
                <section>
                    <h2>3. Intellectual Property</h2>
                    <p>The content and features of this service are owned by Product Review System and are protected by copyright and other intellectual property laws.</p>
                </section>

                <br />
                <section>
                    <h2>4. Termination</h2>
                    <p>We reserve the right to suspend or terminate your access to the service at our sole discretion, without notice, for conduct that we believe violates these Terms.</p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfService;
