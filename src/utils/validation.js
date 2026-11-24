export const emailIsValid = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const passwordIsValid = value => value.length >= 8;
export function validateRegistration({ fullname, email, password, confirmPassword }) {
  const errors = {};
  if (!fullname.trim()) errors.fullname = "Please enter your full name.";
  if (!emailIsValid(email)) errors.email = "Enter a valid email address.";
  if (!passwordIsValid(password)) errors.password = "Use at least 8 characters.";
  if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";
  return errors;
}
