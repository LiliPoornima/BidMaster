import React from "react";
import { Link } from "react-router-dom";
import "./Terms.css"; 

const Terms = () => {
  return (
    <div className="terms-page">
    <br/><br/><br/><br/>
      <div className="terms-container">
        <h1 className="terms-title">Terms and Conditions</h1>
        <p>
    <b>Welcome to our platform;</b> by registering as a seller and accessing or using our services, you agree to be bound by the following terms and conditions, which govern your use of this website, its features, and all related services provided by us, including but not limited to the registration process, account management, product listings, transactions, and interactions with buyers or other users, and you acknowledge that these terms constitute a legally binding agreement between you, the seller, and us, the platform operator, so please read them carefully before proceeding; you represent that you are at least <b>18 years of age</b> or the legal age of majority in your jurisdiction, whichever is higher, and that you have the full legal capacity to enter into this agreement, and if you are registering on behalf of a business or entity, you warrant that you are duly authorized to act on its behalf; as a seller, you are responsible for providing <b>accurate, complete, and up-to-date information</b> during registration, including your full name, email address, phone number, company name (if applicable), address, and any other details requested, and you agree to maintain the confidentiality of your account credentials, 
    such as your password, and to notify us immediately of any unauthorized use of your account, 
    as you will be solely liable for all activities conducted through it; by using our platform, 
    you agree to comply with all applicable local, national, and international laws, regulations,
     and ordinances, including those related to taxation, consumer protection, data privacy, 
     and intellectual property, and you shall not engage in any illegal, fraudulent,
      or harmful activities, such as listing prohibited items, misrepresenting products,
       or attempting to manipulate pricing or reviews; we reserve the right to 
       <b>suspend or terminate your account</b> at our sole discretion, with or without notice,
        if we suspect any violation of these terms, including failure to adhere to our policies,
         non-payment of fees, or behavior that we deem detrimental to the platform or its users, 
         and upon termination, your access to the platform will cease, though any outstanding obligations,
          such as payment disputes or delivery commitments, will remain your responsibility; 
          you acknowledge that we charge <b>fees</b> for certain services, such as listing 
          products or processing transactions, and these fees will be clearly communicated 
          to you, and you agree to pay them promptly as outlined in our fee schedule,
           understanding that failure to do so may result in account restrictions;
            all content you upload, including product descriptions, images, 
            and other materials, must be <b>original or properly licensed</b>, and by submitting such content,
             you grant us a <b>non-exclusive, worldwide, royalty-free license</b> to use, display,
              and distribute it solely for the purpose of operating and promoting the platform,
               while retaining your ownership of said content; we are not responsible for disputes 
               between you and buyers, though we may offer tools or mediation services at our 
               discretion, and you agree to <b>indemnify and hold us harmless</b> from any claims,
                losses, or damages arising from your use of the platform, including those related
                 to product quality, shipping delays, or buyer complaints; these terms may be 
                 updated from time to time, and we will notify you of significant changes via 
                 email or through the platform, with your continued use thereafter constituting 
                 acceptance of the revised terms, and if any provision of this agreement is found
                 to be unenforceable, the remaining provisions will remain in full effect; finally,
                   this agreement is governed by the laws, 
                   and any disputes arising hereunder shall be resolved exclusively in the courts 
                   and by checking the box during registration to accept
                    these terms, you confirm that you have read, understood, and agreed to be bound 
                    by them in their entirety, so if you do not agree, please do not proceed with
                     registration or use of our services.
</p>

        <p className="back-link">
          <Link to="/register">Back to Registration</Link>
        </p>
      </div>
    </div>
  );
};

export default Terms;