import { useState } from 'react';
import styles from './SignUpForm.module.scss'
enum UserInfoFields {
    username = 'username',
    email = 'email',
    password = 'password',
    confirm = 'passwordConfirm'
}

interface UserInfoFieldValue {
    value: string
    errors: string[]
}

type UserInformation = Record<UserInfoFields, UserInfoFieldValue>

// Validators
const minLengthValidator = (min: number) => (val: string): string | null =>
    val.length < min ? `Minimal of ${min} characters.` : null;

const emailValidator = (val: string): string | null =>
    /@/.test(val) ? null : 'Invalid email address.';

const alphanumericValidator = (val: string): string | null => /^[a-z0-9]+$/.test(val) ? null : 'Only alphanumeric is allowed.';

// Form Fields
type ValidateFunc = (str: string, data?: UserInformation) => (string | null)[];
interface Field {
    key: UserInfoFields,
    label: string,
    validation: ValidateFunc
}
const fields: Field[] = [
    {
        key: UserInfoFields.username,
        label: 'Username',
        validation: (val) => [minLengthValidator(4)(val), alphanumericValidator(val)],
    },
    {
        key: UserInfoFields.email,
        label: 'Email',
        validation: (val) => [emailValidator(val)],
    },
    {
        key: UserInfoFields.password,
        label: 'Password',
        validation: (val) => [minLengthValidator(6)(val)],
    },
    {
        key: UserInfoFields.confirm,
        label: 'Confirm Password',
        validation: (val, data) => {
            if (!data || !data.password) return ['Passwords do not match.'];
            return [val === data.password.value ? null : 'Passwords do not match.'];
        },
    },
];


// Default Value Setup
const getDefaultValue = () => fields.reduce((acc, { key }) => {
    acc[key] = { value: '', errors: [] };
    return acc;
}, {} as UserInformation);

async function submitForm(
    formData: Record<UserInfoFields, string>
) {
    const { username, email, password, passwordConfirm } = formData;
    try {
        const response = await fetch(
            'https://www.greatfrontend.com/api/questions/sign-up',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    password_confirm: passwordConfirm,
                }),
            },
        );

        const { message } = await response.json();
        alert(message);
    } catch (_) {
        alert('Error submitting form!');
    }
}

const SignUpForm = () => {

    // 💡 Avoid re-calculating default values on every render by using lazy initialization for useState.
    // other approaches: 
    // 1) assign default value as a constant out side from react or 
    // 2) useMemo
    const [userInfo, setUserInfo] = useState<UserInformation>(() => getDefaultValue());

    return (
        <form className={styles.container}>
            {/* 💡TODO: Consider using a third-party library for form data management and validation to streamline handling.
 */}
            {fields.map(({ key, label, validation }) => {
                const { value, errors } = userInfo[key];
                const errorMsg = errors.filter(error => error !== null).join(' ')
                const errorElId = `${key}-error`
                return (
                    <div key={key} className={styles.field}>
                        <label htmlFor={key}>{label}</label>
                        <input id={key}
                            value={value}
                            aria-describedby={errorElId}
                            onChange={
                                (e) => {
                                    const newVal = e.target.value;

                                    const errorList = validation(newVal, userInfo);

                                    setUserInfo(prev => {
                                        return { ...prev, [key]: { value: newVal, errors: errorList } }
                                    })
                                }
                            }
                        />
                        {errorMsg && (
                            <div className={styles.error} id={errorElId}>
                                {errorMsg}
                            </div>
                        )}
                    </div>
                )
            }
            )}
            <button onClick={async (e) => {
                e.preventDefault()
                await submitForm({
                    username: userInfo.username.value,
                    email: userInfo.email.value,
                    password: userInfo.password.value,
                    passwordConfirm: userInfo.passwordConfirm.value
                })
            }}>Sign Up</button>
        </form>
    );
};

export default SignUpForm;
