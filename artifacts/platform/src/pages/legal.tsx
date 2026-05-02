import { Layout } from "@/components/layout";
import { motion } from "framer-motion";

export default function Legal() {
  return (
    <Layout>
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl prose prose-invert prose-p:text-muted-foreground prose-headings:text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-12">Legal & Privacy Policy</h1>
            
            <h2>1. Introduction</h2>
            <p>
              Welcome to Aurum. We respect your privacy and are committed to protecting your personal data. This privacy notice will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>

            <h2>2. Data We Collect</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              <ul>
                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> includes billing address, email address and telephone numbers.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
              </ul>
            </p>

            <h2>3. GDPR Compliance</h2>
            <p>
              If you are a resident of the European Economic Area (EEA), you have certain data protection rights. Aurum aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.
              If you wish to be informed what Personal Data we hold about you and if you want it to be removed from our systems, please contact us.
            </p>

            <h2>4. Terms of Service</h2>
            <p>
              By accessing the website at aurum.com, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
            </p>

            <h2>5. Contact Us</h2>
            <p>
              For any questions regarding our legal terms or privacy practices, please reach out via our contact page.
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}