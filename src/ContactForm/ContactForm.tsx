import {} from 'react';
import submitForm from './submitForm';

/**
 * 
 * Note:
 * 1. label for input - label.htmlFor input.id
 * 2. input type - name, email, submit
 * 3. form onSubmit action, action url, method
 */

const ContactForm = () => {
    return (
        <form
        // Ignore the onSubmit prop, it's used by GFE to
        // intercept the form submit event to check your solution.
        onSubmit={submitForm}
        action="https://www.greatfrontend.com/api/questions/contact-form"
        method="post">
        <div>
          <label htmlFor="name-input">Name</label>
          <input id="name-input" name="name" type="text" />
        </div>
        <div>
          <label htmlFor="email-input">Email</label>
          <input id="email-input" name="email" type="email" />
        </div>
        <div>
          <label htmlFor="message-input">Message</label>
          <textarea
            id="message-input"
            name="message"></textarea>
        </div>
        <div>
          <input type='submit' value={'Submit'} />
        </div>
      </form>
      );
};

export default ContactForm;
